import { Document } from "mongoose";

export interface IUser {
username: string;
email: string;
password: string;
avatar: string;
critic: boolean;
}

export interface IUserDocument extends IUser, Document {
    comparePassword: (password: string) => Promise<boolean>;
    createToken: () => string;
    toSafeObject: () => object;
}