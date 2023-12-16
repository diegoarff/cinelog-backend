import { Schema, model } from "mongoose";
import { IChatDocument } from "../interfaces";

const ChatSchema = new Schema<IChatDocument>(
  {
    name: { type: Schema.Types.Mixed, default: null },
    usersId: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    isPrivate: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IChatDocument>("Chat", ChatSchema);
