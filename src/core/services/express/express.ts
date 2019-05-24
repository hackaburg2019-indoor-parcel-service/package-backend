import express, { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import { IExpressConfig } from '@home/types';
import { Logger } from '@home/core/utils';
import { I18n, ExpressHandler } from '@home/misc';

import { DeliveryRoute, AuthRouter } from '@home/routes';
import lusca = require('lusca');
import passport = require('passport');


export namespace ExpressService {
    const app = express();
    let config: IExpressConfig;

    export const init = async (c: IExpressConfig): Promise<void> => {
        config = c;

        app.set('port', config.port);
        app.use(compression());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(methodOverride());
        app.use(lusca.xssProtection(true));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(Logger.getExpressLogger());

        if (process.env.NODE_ENV === 'dev') {
            app.use((req: Request, res: Response, next: NextFunction) => {

                // Website you wish to allow to connect
                res.setHeader('Access-Control-Allow-Origin', '*');

                // Request methods you wish to allow
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

                // Request headers you wish to allow
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-access-token, authorization');

                // Set to true if you need the website to include cookies in the requests sent
                // to the API (e.g. in case you use sessions)
                res.setHeader('Access-Control-Allow-Credentials', '1');

                // Pass to next layer of middleware
                next();
            });
        }

        app.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.status(200).send(I18n.INFO_SUCCESS);
        });

        app.use(`/${config.version}/delivery`, DeliveryRoute);
        app.use(`/${config.version}/auth`, AuthRouter);


        app.use('*', ExpressHandler.express);
        app.all('*', ExpressHandler.checkResponse);
        app.all('*', ExpressHandler.unkownRouteHandler);

        try {
            await app.listen(app.get('port'));
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    };
}
