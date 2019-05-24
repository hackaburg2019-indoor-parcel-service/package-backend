
export interface IMongoConfig {
    server: string;
    username: string;
    password: string;
    database: string;
}

export interface IConfig {
    mongodb: IMongoConfig;
}