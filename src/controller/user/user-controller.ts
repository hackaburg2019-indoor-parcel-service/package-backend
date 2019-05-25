import { Request, Response, NextFunction } from 'express';
import { Delivery } from '@home/models';
import { HttpCodes, I18n } from '@home/misc';

export namespace UserController {

    export const getOpenDeliveries = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deliveries = await Delivery.find({ user: req.user, picked: false });

            res.data = {
                code: HttpCodes.OK,
                message: I18n.INFO_SUCCESS,
                data: deliveries
            };
            return next();
        } catch (e) {
            return next(e);
        }
    };
}
