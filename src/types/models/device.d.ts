import { IUser } from './user';

export interface IDevice {
    id?: string | any;
    user: IUser;
    token: string;
    active: boolean;
}
