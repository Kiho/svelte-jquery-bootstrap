import Fuse from 'fuse.js';

function dig(obj, selector) {
    var result = obj;
    const splitter = selector.split('.');

    for (let i = 0; i < splitter.length; i++){
        if (result == undefined)
            return undefined;                
        result = result[splitter[i]];
    }

    return result;
}

export const collect = function(obj, field) {
    if (typeof(field) === 'function')
        return field(obj);
    else if (typeof(field) === 'string')
        return dig(obj, field);
    else
        return undefined;
}

export class DataGridComponent {
    svt: Svelte;

    init(svt: Svelte) {
        this.svt = svt;
    }

    get: (name?: string) => any;
    set: (data: any) => void;

    setPage(reload, currentPage, offset = 0) {
        if (reload) {
            this.svt.set({currentPage: currentPage + offset});
            this.processRows(this.svt.get('rows'));
        }
    }

    nextPage = (e) => {
        const { processedRows, currentPerPage, currentPage } = this.svt.get();
        this.setPage(processedRows.length > currentPerPage * currentPage, currentPage, 1);
    }

    previousPage = (e) => {
        const { currentPage } = this.svt.get();
        this.setPage(currentPage > 1, currentPage, -1);
    }

    onTableLength = (e) => {
        const { rows, currentPage } = this.svt.get();
        this.svt.set({currentPerPage: e.target.value});
        this.setPage(true, currentPage);
    }

    sort = (index) => {
        console.log('sort', index);
        let { sortable, sortColumn, sortType, currentPage } = this.svt.get();
        if (!sortable)
            return;
        if (sortColumn === index) {
            sortType = sortType === 'asc' ? 'desc' : 'asc';
        } else {
            sortType = 'asc';
            sortColumn = index;
        }
        this.svt.set({sortType, sortColumn});
        this.setPage(true, currentPage);
    }

    searchData(searchText) {
        this.processRows(this.svt.get('rows'), searchText);
    }

    search = (e) => {
        this.svt.set({searching: !this.svt.get('searching')});
    }

    click = (row) => {
        if(!this.svt.get('clickable')){
            return;
        }

        if(getSelection().toString()){
            // Return if some text is selected instead of firing the row-click event.
            return;
        }
        // this.$emit('row-click', row)
    }

    exportExcel() {
        const {title} = this.svt.get();
        const mimeType = 'data:application/vnd.ms-excel';
        const html = this.renderTable().replace(/ /g, '%20');

        const documentPrefix = title != '' ? title.replace(/ /g, '-') : 'Sheet'
        const d = new Date();

        var dummy = document.createElement('a');
        dummy.href = mimeType + ', ' + html;
        dummy.download = documentPrefix
            + '-' + d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
            + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()
            +'.xls';
        dummy.click();
    }

    print() {
        let win = window.open("");
        win.document.write(this.renderTable());
        win.print();
        win.close();
    }

    renderTable() {
        const { currentPage, columns, rows } = this.svt.get();
        let table = '<table><thead>';

        table += '<tr>';
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            table += '<th>';
            table += 	column.label;
            table += '</th>';
        }
        table += '</tr>';

        table += '</thead><tbody>';
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            table += '<tr>';
            for (let j = 0; j < columns.length; j++) {
                const column = columns[j];
                table += '<td>';
                table +=	collect(row, column.field);
                table += '</td>';
            }
            table += '</tr>';
        }

        table += '</tbody></table>';

        return table;
    }

    paginateRows(rows) {
        const { currentPerPage, currentPage, paginate } = this.svt.get();
        let paginatedRows = rows;
        if (paginate)
            paginatedRows = paginatedRows.slice((currentPage - 1) * currentPerPage, currentPerPage === -1 ? paginatedRows.length + 1 : currentPage * currentPerPage);
        this.svt.set({paginated: paginatedRows});
        console.log('paginatedRows', paginatedRows);
    }

    processRows(rows, searchText?) {
        let computedRows = rows;				
        const { currentPage, columns,
            sortable, sortColumn, sortType, 
            searching, searchInput, exactSearch } = this.svt.get();
        if (!searchText) {
            searchText   =searchInput;
        }
         
        if (sortable !== false && sortColumn > -1 && columns)
            computedRows = computedRows.sort((x,y) => {
                if (!columns[sortColumn])
                    return 0;

                const cook = (x) => {
                    x = collect(x, columns[sortColumn].field);
                    if (typeof(x) === 'string') {
                        x = x.toLowerCase();
                        if (columns[sortColumn].numeric)
                            x = x.indexOf('.') >= 0 ? parseFloat(x) : parseInt(x);
                    }
                    return x;
                }

                x = cook(x);
                y = cook(y);

                return (x < y ? -1 : (x > y ? 1 : 0)) * (sortType === 'desc' ? -1 : 1);
            })

        if (searching && searchText) {
            const searchConfig = { keys: columns.map(c => c.field), threshold: undefined, distance: undefined, getFn: null }

            // Enable searching of numbers (non-string)
            // Temporary fix of https://github.com/krisk/Fuse/issues/144
            searchConfig.getFn = function (obj, path) {
                if(isNaN(Number(obj[path])))
                return JSON.stringify(obj[path]);
                    return obj[path];
            }

            if (exactSearch) {
                //return only exact matches
                searchConfig.threshold = 0,
                searchConfig.distance = 0
            }

            computedRows = (new Fuse(computedRows, searchConfig)).search(searchText);
        }

        this.svt.set({processedRows: computedRows});
        this.paginateRows(computedRows);
    }

    setPerPageOptions() {
        let { currentPerPage, defaultPerPage, perPage } = this.svt.get();
        let options = perPage;

        // Force numbers
        options = options.map( v => parseInt(v));
        
        // Set current page to first value
        currentPerPage = options[0];

        // Sort options
        options.sort((a,b) => a - b);

        // And add "All"
        options.push(-1);

        // If defaultPerPage is provided and it's a valid option, set as current per page
        if (options.indexOf(defaultPerPage) > -1) {
            currentPerPage = parseInt(defaultPerPage);
        }

        console.log('currentPerPage', currentPerPage, options);
        this.svt.set({currentPerPage, perPageOptions: options});
    }
}