import { Document, Types } from "mongoose";

export interface IMessage {
userId: Types.ObjectId;
chatId: Types.ObjectId;
content: string;
}

export interface IMessageDocument extends IMessage, Document {}