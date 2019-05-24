import { RequestHandler } from 'express';
import { body, check } from 'express-validator/check';
import { ExpressHandler } from '../express-handler';
import { I18n } from '../template';

export namespace DeliveryValidator {

    export const newDelivery = (): RequestHandler[] => {
        return [
            check('customer', I18n.WARN_INVALID_PARAMS).isString(),
            check('locker', I18n.WARN_INVALID_PARAMS).isNumeric(),
            ExpressHandler.validateBody
        ];
    };
}
