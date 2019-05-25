import mongoose, { Document, Schema, Model } from 'mongoose';

import _ from 'lodash';
import { IDelivery } from '@home/types/models';
import { PackageError } from '@home/errors';
import { ErrorCode } from '@home/types';
import { Station } from './station';
import { I18n } from '@home/misc';

export interface IDeliveryModel extends IDelivery, Document { }

const deliveryOptions: mongoose.SchemaOptions = {
    toJSON: {
        transform: function(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
};

const deliverySchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    station: { type: Schema.Types.ObjectId, required: true, ref: 'Station' },
    lockNumber: { type: Number, required: true },
    picked: {type: Boolean, required: false, default: false },
    token: { type: String, required: true },
    delivered: { type: Date },
    pickDate: { type: Date }
}, deliveryOptions);

deliverySchema.pre('save', async function() {
    const newDocument: IDeliveryModel = <IDeliveryModel> this;

    try {
        const station = await Station.findById(newDocument.station).exec();

        if (newDocument.pickDate) {
            throw new PackageError(I18n.WARN_DELIVERY_PICKDATE_PROVIDED);
        }
        if (!station) {
            throw new PackageError(I18n.WARN_STATION_NOT_FOUND);
        }

        if (!_.includes(station.stationNumbers, newDocument.lockNumber)) {
            throw new PackageError(I18n.WARN_STATION_LOCKER_NOT_FOUND);
        }

        const deliveries = await Delivery.find({ station: newDocument.station, picked: false, lockNumber: newDocument.lockNumber }).exec();

        if (deliveries.length !== 0) {
            throw new PackageError(I18n.WARN_STATION_LOCKER_BUSY);
        }

        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
});

export const Delivery: Model<IDeliveryModel> = mongoose.model<IDeliveryModel>('Delivery', deliverySchema, 'delivery');
