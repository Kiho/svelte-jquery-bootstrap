import { Employee } from './employee';
import { Department } from './department';

export type EntityType ='department' | 'employee';

export { IDepartment } from './department';
export { IEmployee } from './employee';

export interface IEntity {
    loading: boolean;
    error: string;
    data: Object;
    item: Object;
}

export const createNew = (path: EntityType) => {
    switch (path) {
        case 'employee':
            return Object.assign({}, Employee);
        case 'department':
            return Object.assign({}, Department);
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