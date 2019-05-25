import { IUser } from './user';
import { IStation } from './station';

export interface IDelivery {
    id?: string | any;
    user: IUser;
    station: IStation;
    lockNumber: number;
    picked: boolean;
    pickDate?: Date;
    token: string;
    delivered: Date;
}