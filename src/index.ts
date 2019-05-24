import 'module-alias/register';
import config from 'config';
import { Logger } from '@home/core';
import { IMongoConfig } from './types';
import { MongodbService } from './core/services';

Logger.init();

(async (): Promise<void> => {
    const mongodbConfig: IMongoConfig = config.get<IMongoConfig>('mongodb');

    try {
        await MongodbService.init(mongodbConfig);
        Logger.info('connected to mongodb');
    } catch (e) {
        Logger.error(`error while connecting to mongodb ${e}`);
        process.exit(1);
    }
})();
