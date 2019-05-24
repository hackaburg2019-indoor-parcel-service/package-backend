import { IUser } from './user';
import { IStation } from './station';

export interface IDelivery {
    id?: string | any;
    user: IUser;
    station: IStation;
    picked: boolean;
    token: string;
    delivered: Date;
}