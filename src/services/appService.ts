import { server } from '../api';
import * as utils from '../utils';
import history from '../services/whistory';
import { EntityType, createNew } from '../model';
import ProgressBar from '../components/ProgressBar.html';

declare var validator: validator;

export const lookupTypes: EntityType[] = ['employee', 'department'];

const progress = new ProgressBar({
	target: document.querySelector('body'),
  props: { color: 'blue' }
})

function startLoading(app: IApp) {
  // app.loading = true; 
  progress.start();
}

function completeLoading(app: IApp) {
  // app.loading = false;
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
  get: () => any;
  $set: (object) => void;
  entityType: EntityType;
  lookups: object;
  id: number;
  form?: HTMLFormElement;
  item?: object;
  list?: any[];
}

export default class AppService {
  validator;

  constructor(private _page?: string) {
    console.log('AppService: constructor()', _page);
  }

  init(app: IApp) { 
    // const {id, entityType} = app.get();       
    // app.entityType = entityType;
    // app.id = id;
  } 

  initHeader(app: IApp) {			
    // app.get().pageHeader.set(app.get().header);
    if (app.form) {
      this.initValidator(app.form);
    }
    console.log('AppService: init()', this._page);
  }
    
  initValidator(form) {
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

    const { intervalTime } = progress;
    loaded(intervalTime, start, end, app, completeLoading);
    return data;
  }

  async getLookups(app: IApp, entities: EntityType[], predicate?: (x: EntityType) => boolean) {
    const loadAll = [];
    entities.forEach(entity => {
      loadAll.push(
        server.getList(entity).then((x) => {
            const listName = entity + 'List';
            app.lookups[listName] = x;
            // app.$set({ lookups: { [listName]: x } });
            console.log(listName + ' from server', x);
        })
      );                      
    });
    return Promise.all(loadAll);
  }

  async getList(app: IApp) {
    const action = () => server.getList(app.entityType);
    const postAction = (list) => {
        console.log('List from server', list);
        app.$set({list});
    };
    this.serverAction(app, action, postAction);
  }

  async getById(app: IApp) {        
    if(app.id == 0){
        this.createNew(app); return;
    }
    const action = () => server.getById(app.entityType, app.id);
    const postAction = item => app.$set({ item });
    this.serverAction(app, action, postAction);
  }

  async submit(event, app: IApp) {
    event.preventDefault();
    const form = app.form;
    const data = app.item;

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
    app.$set({ item: createNew(app.entityType) });
  }
}
