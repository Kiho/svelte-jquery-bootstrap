import { server } from '../api';
import toastr from '../common/toastr';

export default {
    data: function (data) { // default data: https://svelte.technology/guide#default-data
        return Object.assign({
            tableInstance: undefined,
            dataSource: [],
        }, data);
    },
    oncreate: async function (component: any, service, lookups) { // life-cycle hook 
        await service.getLookups(component, lookups)
        component.loadData();
        this.initialize(component);
    },
    initialize(component: any){
        component.initHeader();
        const table = component.initTable(component.getTable()); 
        component.set({ tableInstance: table });     
        component.observe('dataSource', dataSource => { // watch for changes in 'dataSource'
            if (dataSource) {
                component.updateTable();
            }
        });
    },
    ondestroy: function () { // cleanup life-cycle method.
        this.getTable().remove(); // remove jQuery object
    },
    loadData: async function () {
        const json = await server.doFetch(this.get().url);
        this.set({ dataSource: json });
        toastr.info(`Retrieved data from ${this.get().url}`, 'Info');
    },
    updateTable: function () {
        const table = this.get().tableInstance; // https://svelte.technology/guide#component-get-key-
        if (table) {
            table.clear();
            table.rows.add(this.get().dataSource);
            table.draw();
        }
    },
    getTable: function () {
        return $(this.refs.rtable);
    },
    initHeader() {			
        this.get().pageHeader.set(this.get().headerData);
    },
}
