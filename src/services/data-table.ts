import { server } from '../api';
import toastr from '../common/toastr';

export default {
    tableInstance: null,
    oncreate: async function (component: any, initTable, table, url) { // life-cycle hook 
        this.table = table;
        this.tableInstance = initTable(table);
        await this.loadData(component, url);
    },
    ondestroy: function () { // cleanup life-cycle method.
        this.table.remove(); // remove jQuery object
    },
    loadData: async function (component: any, url: string) {        
        const json = await server.doFetch(url);
        component.$set({ list: json });
        toastr.info(`Retrieved data from ${url}`, 'Info');
    },
    updateTable: function (list) {
        const table = this.tableInstance; // https://svelte.technology/guide#component-get-key-
        if (table) {
            table.clear();
            table.rows.add(list);
            table.draw();
        }
    },
}
