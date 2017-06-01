import { server } from '../api';
import * as utils from '../utils';
import history from '../services/history';
import { EntityType, createNew } from '../model';
import ProgressBar from '../components/ProgressBar.html';

declare var validator: validator;

export const lookupTypes: EntityType[] = ['employee', 'department'];

const progress = new ProgressBar({
	target: document.querySelector('body'),
    data: { color: 'blue' }
})

function startLoading(app: IApp) {
    app.set({loading: true});
    progress.start();
}

function completeLoading(app: IApp) {
    app.set({loading: false});
    progress.complete();
} 

const loaded = (intervalTime, start, end, app: IApp, complete: (x: IApp) => void) => {
    if (end - start < intervalTime) {
        setTimeout(() => complete(app), intervalTime);
    } else {
        complete(app);
    }       
}

export interface IApp {
    get: (string) => any;
    set: (object) => void;
    entityType: EntityType;
    id: number;
    refs?: any;
}

export default class AppService {
    validator;

    init(app: IApp) {
        app.entityType = app.get('entityType');
        app.id = app.get('id');
    } 

    initHeader(app: IApp) {			
        app.get('pageHeader').set(app.get('header'));
        this.initValidator(app, app.refs.form);
    }
    
    initValidator(app: IApp, form) {
        if (!form) {
            return;
        }
		// validate a field on "blur" event, a 'select' on 'change' event & a '.reuired' classed multifield on 'keyup':
		$(form)
			.on('blur', 'input[required], input.optional, select.required', validator.checkField)
			.on('change', 'select.required', validator.checkField)
			.on('keypress', 'input[required][pattern]', validator.keypress);
        $('.multi.required').on('keyup blur', 'input', function() {
            validator.checkField.apply($(this).siblings().last()[0]);
        });  
    }

    async serverAction(app: IApp, action, postAction) {
        let start = Date.now();
        let data;

        try{
            startLoading(app);
            data = await action(app.entityType);            
        } catch(e) {
            alert('ERROR: ' + e.message);
        }
        
        let end = Date.now();
        if (data) {
            postAction(data);
        }

        const intervalTime = progress.get('intervalTime');
        loaded(intervalTime, start, end, app, completeLoading);
        return data;
    }

    async getLookups(app: IApp, entities: EntityType[], predicate?: (x: EntityType) => boolean) {
        const loadAll = [];
        entities.forEach(entity => {
            loadAll.push(
                server.getList(entity).then((x) => {
                    const listName = entity + 'List';
                    app.set({[listName]: x});
                    // cache.data[entity] = x;
                    console.log(listName + ' from server', x);
                })
            );                      
        });
        return Promise.all(loadAll);
    }

    async getList(app: IApp) {
        const action = () => server.getList(app.entityType);
        const postAction = (list) => app.set({list});
        this.serverAction(app, action, postAction);
    }

    async getById(app: IApp) {        
        if(app.id == 0){
            this.createNew(app); return;
        }
        const action = () => server.getById(app.entityType, app.id);
        const postAction = (item) => app.set({item});
        this.serverAction(app, action, postAction);
    }

    async submit(event, app: IApp) {
        event.preventDefault();
        const form = app.refs.form;
        const data = app.get('item');

        const validatorResult = validator.checkAll($(form));
        if (!validatorResult.valid) {
            return;
        }

        console.log('item', data);
        const action = () => server.post(app.entityType, data);
        const postAction = (r) => {
            if (r.key > 0) {
                app.id = r.key;
                this.getById(app);
            }
        }
        this.serverAction(app, action, postAction);
    } 

    goBack(event) {
        event.preventDefault();
        history.goBack();
    }

    createNew(app: IApp) {        
        app.set({item: createNew(app.entityType)});
    }
}
