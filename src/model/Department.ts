import { IEntityItem } from '.';

export interface IDepartment extends IEntityItem {
    name?: string;
    groupName?: string;
}

export const Department: IDepartment = {
    id: 0,
    name: "",
    groupName: ""
}