import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser } from '@home/types/models';
import { PackageError } from '@home/errors';
import { ErrorCode } from '@home/types';

export interface IUserModel extends IUser, Document {}

const userOptions: mongoose.SchemaOptions = {
    toJSON: {
        transform: function(doc, ret: IUserModel, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
};

const userSchema = new mongoose.Schema({
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: {
        firstname: { type: String },
        lastname: { type: String }
    },
    devices: [{
        token: { type: String, required: true },
        active: { type: Boolean, required: true, default: true }
    }]
}, userOptions);

userSchema.methods.comparePassword = function(checkingPassword: string, cb: (e: any, isMatch: any) => {}) {
    if (!this.password) {
        cb(new Error('No password set'), undefined);
    }

    bcrypt.compare(checkingPassword, this.password, (e: mongoose.Error, isMatch: boolean) => {
        if (!this.password) {
            cb(new Error('No password set'), undefined);
        }
        cb(e, isMatch);
    });
};

export const User: Model<IUserModel> = mongoose.model<IUserModel>('User', userSchema, 'user');

