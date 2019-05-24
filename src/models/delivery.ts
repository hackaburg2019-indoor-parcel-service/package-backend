import mongoose, { Document, Schema, Model } from 'mongoose';

import { IDelivery } from '@home/types/models';
import { PackageError } from '@home/errors';
import { ErrorCode } from '@home/types';

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
    station: { type: Schema.Types.ObjectId, required: true, ref: 'station' },
    lockNumber: { type: Number, required: true },
    picked: {type: Boolean, required: false, default: false },
    token: { type: String, required: true },
    delivered: { type: Date }
}, deliveryOptions);

deliverySchema.pre('validate', async function() {
    const newDocument: IDeliveryModel = <IDeliveryModel> this;

    try {
        if (newDocument.delivered) {
            throw new PackageError('Delivered is provided', ErrorCode.DELIVERED_INVALID);
        }
        if (newDocument.token) {
            throw new PackageError('Token provided', ErrorCode.DELIVERED_INVALID);
        }

        // TODO: Check station if number is valid
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
});

export const Delivery: Model<IDeliveryModel> = mongoose.model<IDeliveryModel>('Delivery', deliverySchema, 'delivery');
