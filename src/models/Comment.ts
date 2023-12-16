import { Schema, model } from "mongoose";
import { ICommentDocument } from "../interfaces";
import Comment from "./Comment";

const CommentSchema = new Schema<ICommentDocument>(
  {
    commentId: { type: Schema.Types.ObjectId, ref: "Comment", required: false },
    reviewId: { type: Schema.Types.ObjectId, ref: "Review", required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CommentSchema.pre<ICommentDocument>(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const commentsToDelete = await Comment.find({ commentId: this._id });

    for (const comment of commentsToDelete) {
      await comment.deleteOne();
    }
    next();
  }
);

export default model<ICommentDocument>("Comment", CommentSchema);
