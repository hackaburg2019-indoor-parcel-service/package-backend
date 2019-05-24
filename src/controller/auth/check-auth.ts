import { Request, Response, NextFunction } from 'express';
import config from 'config';
import { HttpCodes } from '@home/misc';
import { User } from '../../models';
import jwt from 'jsonwebtoken';
import { PackageError } from '@home/errors';
import { I18n } from '../../misc';
import { ErrorCode } from '@home/types/errors';
import { IExpressConfig } from '@home/types';

export namespace CheckAuth {
    const expressConfig = config.get<IExpressConfig>('express');

    export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
        const token: string = req.token || req.headers['authorization'] as string;

        if (token) {
            jwt.verify(token, expressConfig.token, async (e: any, decoded: any) => {
                if (e) {
                    res.data = {
                        code: HttpCodes.Unauthorized,
                        message: e
                    };
                    return next(e);
                }
                req.user = decoded;
                const user = await User.findById(req.user.id);
                if (!user) return next(new PackageError(I18n.WARN_USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND));
                req.user = user;
                return next();
            });
        } else {
            res.data = {
                code: HttpCodes.BadRequest,
                message: I18n.WARN_TOKEN_NOT_PROVIDED
            };
            return next();
        }
    };
}
