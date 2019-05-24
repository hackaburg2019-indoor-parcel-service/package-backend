import 'module-alias/register';
import config from 'config';
import { Logger } from '@home/core';
import { IMongoConfig, IExpressConfig } from './types';
import { MongodbService, ExpressService } from './core/services';

Logger.init();

(async (): Promise<void> => {
    const mongodbConfig: IMongoConfig = config.get<IMongoConfig>('mongodb');
    const expressConfig: IExpressConfig = config.get<IExpressConfig>('express');

    try {
        await MongodbService.init(mongodbConfig);
        Logger.info('connected to mongodb');
    } catch (e) {
        Logger.error(`error while connecting to mongodb ${e}`);
        process.exit(1);
    }

    try {
        await ExpressService.init(expressConfig);
        Logger.info('spawned http server');
    } catch (e) {
        Logger.error(`error while spawning http server ${e}`);
    }
})();
