import { NextFunction, Request, Response } from 'express';
import { IApiPostDelivery, IApiPostPickDelivery } from '@home/types/core';
import { Station, User, IDeliveryModel, Delivery } from '@home/models';
import { IUser, IDelivery } from '@home/types/models';
import { HttpCodes, I18n } from '@home/misc';

export namespace DeliveryController {

    export const postCreateDelivery = async (req: Request, res: Response, next: NextFunction) => {
        const delivery: IApiPostDelivery = req.body;
        let deviceIp = req.headers['x-forwarded-for'] as string | undefined || req.connection.remoteAddress as string;

        if (deviceIp.substr(0, 7) === '::ffff:') {
            deviceIp = deviceIp.substr(7);
        }

        try {
            const station = await Station.findOne({ deviceIp: deviceIp }).exec();

            if (!station) {
                res.data = {
                    code: HttpCodes.NotFound,
                    message: I18n.WARN_STATION_NOT_FOUND
                };
                return next();
            }

            const user = await User.findOne({ username: delivery.customer }).exec();

            if (!user) {
                res.data = {
                    code: HttpCodes.NotFound,
                    message: I18n.WARN_USER_NOT_FOUND
                };
                return next();
            }

            const token = (Math.floor(1000 + Math.random() * 9000)).toString();

            const newDeliveryModel = <IDelivery> {
                station: station,
                picked: false,
                lockNumber: delivery.locker,
                token: token,
                user: user,
                delivered: new Date()
            };

            const newDelivery = new Delivery(newDeliveryModel);

            await newDelivery.save();

            res.data = {
                code: HttpCodes.OK,
                message: I18n.INFO_SUCCESS,
                data: newDelivery
            };

            return next();

        } catch (e) {
            return next(e);
        }
        // TODO: Handle post create
    };

    export const postPickDelivery = async (req: Request, res: Response, next: NextFunction) => {
        const newPick = <IApiPostPickDelivery> req.body;
        let deviceIp = req.headers['x-forwarded-for'] as string | undefined || req.connection.remoteAddress as string;

        if (deviceIp.substr(0, 7) === '::ffff:') {
            deviceIp = deviceIp.substr(7);
        }

        try {
            const station = await Station.findOne({ deviceIp: deviceIp }).exec();

            if (!station) {
                res.data = {
                    code: HttpCodes.NotFound,
                    message: I18n.WARN_STATION_NOT_FOUND
                };
                return next();
            }

            const delivery = await Delivery.findOne({ station: station, picked: false, token: newPick.token.toString() }).exec();

            if (!delivery) {
                res.data = {
                    code: HttpCodes.NotAcceptable,
                    message: I18n.WARN_TOKEN_WRONG
                };
                return next();
            }

            delivery.picked = true;
            delivery.pickDate = new Date();

            await Delivery.updateOne({ _id: delivery.id }, delivery).exec();

            res.data = {
                code: HttpCodes.OK,
                message: I18n.INFO_SUCCESS
            };

            return next();
        } catch (e) {
            return next(e);
        }
    };
}
