import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '@home/types';
import { IVerifyOptions } from 'passport-local';
import { HttpCodes } from '@home/misc';
import { Passport } from '@home/core/services';

export namespace AuthController {

    export const postLogin = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('login', { session: true }, (e: Error, user: IUser, info: IVerifyOptions) => {
            if (e) return next(e);
            if (!user) {
                res.data = {
                    code: HttpCodes.NotFound,
                    message: info.message
                };
                return next();
            }
            req.login(user, (eLogin) => {
                if (eLogin) return next(eLogin);
                Passport.generateToken(req);
                res.data = {
                    code: HttpCodes.OK,
                    message: info.message,
                    data: Passport.respondToken(req)
                };
                return next();
            });
        })(req, res, next);
    };
}
