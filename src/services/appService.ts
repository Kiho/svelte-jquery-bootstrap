import { server } from '../api';
import * as utils from '../utils';
import history from '../services/history';
import { EntityType } from '../model';

export const lookupTypes: EntityType[] = ['employee', 'department'];

// set loading delay
const loaded = (time, app) => {
    setTimeout(() => app.set({loading: false}), time)
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
        try{
            app.set({
                loading: true
            });
            data = await action(app.entityType);
        } catch(e) {
            alert('ERROR: ' + e.message);
        }
        let end = Date.now();
        if (data) {
            postAction(data);
        }
        if (end - start < 300) {
            loaded(300 - (end - start), app);
        } else {
            app.set({
                loading: false
            });
        }
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
        // const action = () => server.getById(app.entityType, app.get('id'));
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
