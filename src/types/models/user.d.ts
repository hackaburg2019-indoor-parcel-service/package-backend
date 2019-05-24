
export interface IUser {
    id?: string | any;
    password: string;
    username: string;
    email: string;
    name: {
        firstname: string;
        lastname: string;
    }
}