import { IDevice } from './device';

export interface IUser {
    id?: string | any;
    password: string;
    username: string;
    email: string;
    name: {
        firstname: string;
        lastname: string;
    },
    devices: IDevice[];
    comparePassword: (checkingPassword: string, cb: (e: any, isMatch: any) => void) => void;
}