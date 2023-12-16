import { Document } from "mongoose";

export interface IChat {
name: string | null;
usersId: string[];
isPrivate: boolean;
}

export interface IChatDocument extends IChat, Document {}