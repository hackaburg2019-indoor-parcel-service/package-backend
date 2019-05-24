import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import config from 'config';
import passportLocal from 'passport-local';
import jwt from 'jsonwebtoken';
import { User } from '@home/models';
import { IUser, IExpressConfig } from '@home/types';
import { I18n } from '@home/misc';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
    return done(undefined, user.id);
});

passport.deserializeUser(async(id, done) => {
    User.findById(id, (e: any, user: any) => {
        done(e, user);
    });
});

declare global {
    namespace Express {
        interface Request {
            token?: string;
            user?: IUser | any;
        }
    }
}

passport.use('login', new LocalStrategy({
    // @ts-ignore
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'password'
}, async (req: Request, username: string, password: string, done) => {
    try {
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return done(undefined, false, { message: I18n.WARN_USER_NOT_FOUND });
        }

        user.comparePassword(password, (e, isMatch) => {
            if (e) return done(e);
            if (!isMatch) {
                return done(undefined, false, { message: I18n.WARN_USER_PASSWORD_WRONG });
            }
            return done(undefined, user, { message: I18n.INFO_SUCCESS });
        });
    } catch (e) {
        return done(e);
    }
}));


export namespace Passport {
    const expressConfig = config.get<IExpressConfig>('express');

    export const generateToken = (req: Request) => {
        let refreshObject: Object = { };
        if (!req.body.unlimited) {
            refreshObject = {
                expiresIn: '1h'
            };
        }

        req.token = jwt.sign({
            username: (req.user || { username: undefined}).username,
            id: (req.user || {id: undefined}).id
        }, expressConfig.token || '', refreshObject);
    };

    export const respondToken = (req: Request) => {
        return {
            user: (req.user || {username: undefined}).username,
            token: req.token
        };
    };

    export const respondManageToken = (req: Request) => {
        return {
            user: (req.user || { username: undefined} ).username,
            token: req.token
        };
    };
}
