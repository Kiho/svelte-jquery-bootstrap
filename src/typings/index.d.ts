/// <reference path="../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../node_modules/@types/toastr/index.d.ts" />
/// <reference path="../../node_modules/@types/datatables.net/index.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.d.ts" />

interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}

// interface IDataTable extends Svelte {
//     initHeader: () => void;
//     loadData: () => void;
//     updateTable: () => void;
//     initTable: (JQuery) => any;
//     getTable: () => JQuery;
// }