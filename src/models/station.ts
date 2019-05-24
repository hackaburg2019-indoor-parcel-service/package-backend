import mongoose, { Document, Schema, Model } from 'mongoose';

import { IStation } from '@home/types/models';
import { PackageError } from '@home/errors';
import { ErrorCode } from '@home/types';

export interface IStationModel extends IStation, Document {}

const stationOptions: mongoose.SchemaOptions = {
    toJSON: {
        transform: function(doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
};

const stationSchema = new mongoose.Schema({
    etage: { type: Number, required: true },
    deviceIp: { type: String, required: true, default: '127.0.0.1' },
    stationNumbers: [{ type: Number, required: true }],
    stationType: { type: String, required: true }
}, stationOptions);

stationSchema.pre('validate', async function() {
    const newDocument: IStationModel = <IStationModel> this;

    try {
        // TODO: Handle checks
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
});

export const Station: Model<IStationModel> = mongoose.model<IStationModel>('Station', stationSchema, 'station');
