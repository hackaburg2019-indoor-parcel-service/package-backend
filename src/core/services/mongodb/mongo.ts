import mongoose from 'mongoose';
import { IMongoConfig } from '@home/types';

export namespace MongodbService {
    let config: IMongoConfig;

    export const init = async (c: IMongoConfig): Promise<void> => {
        config = c;
        const uri = (() => {
            if (config.username && config.password) {
                return `mongodb://${config.username}:${config.password}@${config.server}/${config.database}`;
            }
            return `mongodb://${config.server}/${config.database}`;
        })();
        try {
            const options: mongoose.ConnectionOptions = {
                autoReconnect: true,
                useNewUrlParser: true
            };
            const status = await mongoose.connect(uri, options);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    };
}
