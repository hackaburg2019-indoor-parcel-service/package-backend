import { IUser } from './user';

export interface IDevice {
    id?: string | any;
    token: string;
    active: boolean;
}
