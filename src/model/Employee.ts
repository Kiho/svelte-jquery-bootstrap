import { IEntityItem } from '.';

export interface IEmployee extends IEntityItem {
    name?: string;
    title?: string;
    departmentId?: number;
    rate?: number;
}

export const Employee: IEmployee = {
    id: 0,
    name: "",
    title: "",
    departmentId: 0,
    rate: 0
}