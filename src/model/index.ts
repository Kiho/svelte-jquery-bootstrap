import { Project } from './project';
import { Employee } from './employee';
import { Invoice } from './invoice';
import { Department } from './department';

export type EntityType = 'project' | 'department' | 'employee' | 'invoice';

export { IInvoice } from './invoice';
export { IProject } from './project';
export { IDepartment } from './department';
export { IEmployee } from './employee';

export interface IEntity {
    loading: boolean;
    error: string;
    data: Object;
    item: any;
}

export const createNew = (path: EntityType) => {
    switch (path) {
        case 'project':
            return Object.assign({}, Project);
        case 'employee':
            return Object.assign({}, Employee);
        case 'department':
            return Object.assign({}, Department);
        case 'invoice':
            return Object.assign({}, Invoice);
    }
    return null;
};

export interface IEntityItem {
    id: number;
}

export interface IEntityArray extends Array<IEntityItem> {
    server_message?: string;
}

export interface IEntitySet {
    [name: string]: IEntityArray;
}