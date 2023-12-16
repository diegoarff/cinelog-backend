import { Types, Document } from "mongoose";

export interface IReview {
  userId: Types.ObjectId;
  MediaID: Types.ObjectId;
  score: number;
  content: string;
}

export interface IReviewDocument extends IReview, Document {}
