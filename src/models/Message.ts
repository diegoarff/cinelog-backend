import { Schema, model } from "mongoose";
import { IMessageDocument } from "../interfaces";

const MessageSchema = new Schema<IMessageDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IMessageDocument>("Message", MessageSchema);
