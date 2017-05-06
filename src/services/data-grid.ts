import { server } from '../api';
import toastr from '../common/toastr';

export default {
    data: function (data) { // default data: https://svelte.technology/guide#default-data
        return Object.assign({
            tableInstance: undefined,
            dataSource: [],
        }, data);
    },
    oncreate: function (component) { // life-cycle hook 
        component.initTable();    // see: https://svelte.technology/guide#lifecycle-hooks       
        component.observe('dataSource', dataSource => { // watch for changes in 'dataSource'
            // see: https://svelte.technology/guide#component-observe-key-callback-options-
            if (dataSource && dataSource.length > 0) {
                component.updateTable();
            }
        });
    },
    ondestroy: function () { // cleanup life-cycle method. See: https://svelte.technology/guide#component-teardown-
        this.getTable().remove(); // remove jQuery object
    },
    methods: { 
        updateTable: function () {
            const table = this.get('tableInstance'); // https://svelte.technology/guide#component-get-key-
            if (table) {
                table.clear();
                table.rows.add(this.get('dataSource'));
                table.draw();
                toastr.info(`Retrieved data from ${this.get('url')}`, 'Info');
            }
        },
        loadData: function () {
            server.doFetch(this.get('url')).then(json => {
                this.set({ dataSource: json });
            });
        }
    }
}