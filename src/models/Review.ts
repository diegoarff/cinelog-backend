import { Schema, model } from "mongoose";
import { IReviewDocument } from "../interfaces";
import { Comment } from "./index";

const ReviewSchema = new Schema<IReviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    MediaID: { type: Schema.Types.ObjectId, ref: "Media", required: true },
    content: { type: String },
    score: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ReviewSchema.pre<IReviewDocument>(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const commentsToDelete = await Comment.find({ reviewId: this._id });

    for (const comment of commentsToDelete) {
      await comment.deleteOne();
    }
    next();
  }
);

export default model<IReviewDocument>("Review", ReviewSchema);
