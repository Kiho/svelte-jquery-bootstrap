import { Employee } from './Employee';
import { Department } from './Department';

export type EntityType ='department' | 'employee';

export { Department } from './Department';
export { Employee } from './Employee';

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