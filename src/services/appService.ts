import { server } from '../api';
import * as utils from '../utils';
import history from '../services/history';
import { EntityType } from '../model';
import ProgressBar from '../components/ProgressBar.html';

export const lookupTypes: EntityType[] = ['employee', 'department'];

const progress = new ProgressBar({
	target: document.querySelector('body'),
    data: { color: 'blue' }
})

const loaded = (intervalTime, start, end, complete: () => void) => {
    if (end - start < intervalTime) {
        setTimeout(complete, intervalTime);
    } else {
        complete();
    }       
}

export interface IApp {
    get: (string) => any;
    set: (object) => void;
    entityType: EntityType;
    id: number;
}

export default class AppService {
    init(app: IApp) {
        app.entityType = app.get('entityType');
        app.id = app.get('id');
    } 

    initHeader(app: IApp) {			
        const headerData = app.get('header');
        app.get('pageHeader').set(headerData);
    }
    
    async serverAction(app: IApp, action, postAction) {
        let start = Date.now();
        let data;

        const startLoading = () => {
            app.set({loading: false});
            progress.start();
        }
        const completeLoading = () => {
            app.set({loading: false});
            progress.complete();
        } 
        
        try{
            startLoading();
            data = await action(app.entityType);            
        } catch(e) {
            alert('ERROR: ' + e.message);
        }
        
        let end = Date.now();
        if (data) {
            postAction(data);
        }

        const intervalTime = progress.get('intervalTime');
        loaded(intervalTime, start, end, completeLoading);
        return data;
    }

    async getLookups(app: IApp, entities: EntityType[], predicate?: (EntityType) => boolean) {
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
        const action = () => server.getById(app.entityType, app.id);
        const postAction = (item) => app.set({item});
        this.serverAction(app, action, postAction);
    }

    handleSubmit(event, app: IApp) {
        // prevent the page from reloading
        event.preventDefault();

        const data = app.get('item');
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

    handleBack(event) {
        // prevent the page from reloading
        event.preventDefault();
        history.goBack();
    }
}
