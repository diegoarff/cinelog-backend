
import { Document, Types } from 'mongoose';

export interface IComment {
    userId: Types.ObjectId;
    reviewId: Types.ObjectId | null;
    commentId: Types.ObjectId | null;
    content: string;
    }

export interface ICommentDocument extends IComment, Document {}