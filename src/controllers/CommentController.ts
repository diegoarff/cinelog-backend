import { Request, Response } from "express";
import BaseController from "./BaseController";
import { AuthRequest, ICommentDocument } from "../interfaces";
import { Comment, Review } from "../models";

class CommentController extends BaseController {
  //funcion para crear un comentario]
  createComment = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user._id;
    const { type, isReplyTo, content } = req.body;
    if (!type || !content || !isReplyTo) {
      return this.errorRes(res, 400, "Missing fields");
    }
    if (type !== "comment" && type !== "review") {
      return this.errorRes(res, 400, "Invalid type");
    }

    //check if the review or comment exists
    if (type === "review") {
      const review = await Review.findById(isReplyTo);
      if (!review) {
        return this.errorRes(res, 400, "Review not found");
      }
    } else if (type === "comment") {
      const comment = await Comment.findById(isReplyTo);
      if (!comment) {
        return this.errorRes(res, 400, "Comment not found");
      }
    }

    try {
      const newComment: ICommentDocument = new Comment({
        commentId: type === "comment" ? isReplyTo : null,
        reviewId: type === "review" ? isReplyTo : null,
        userId: userId,
        content: content,
      });
      await newComment.save();

      const response = await newComment.populate(
        "userId",
        "-email -password -createdAt -updatedAt"
      );
      return this.successRes(res, 200, "comment created", response);
    } catch (error) {
      return this.errorRes(res, 500, "Error creating comment", error);
    }
  };

  //funcion para borrar un comentario
  deleteComment = async (req: Request, res: Response): Promise<Response> => {
    const { commentId } = req.params;
    if (!commentId) {
      return this.errorRes(res, 400, "Missing fields");
    }
    try {
      const userId = (req as AuthRequest).user._id;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return this.errorRes(res, 400, "Comment not found");
      }
      if (!comment.userId.equals(userId)) {
        return this.errorRes(res, 401, "You can only delete your own comments");
      }
      await comment.deleteOne();
      return this.successRes(res, 200, "comment deleted", comment);
    } catch (error) {
      return this.errorRes(res, 500, "Error deleting comment", error);
    }
  };

  //funcion para editar un comentario
  editComment = async (req: Request, res: Response): Promise<Response> => {
    const { commentId } = req.params;
    const { content } = req.body;
    if (!commentId || !content) {
      return this.errorRes(res, 400, "Missing fields");
    }
    try {
      const userId = (req as AuthRequest).user._id;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return this.errorRes(res, 400, "Comment not found");
      }
      if (!comment.userId.equals(userId)) {
        return this.errorRes(res, 401, "You can only edit your own comments");
      }
      comment.content = content;
      await comment.save();
      return this.successRes(res, 200, "comment edited", comment);
    } catch (error) {
      return this.errorRes(res, 500, "Error editing comment", error);
    }
  };
  //funcion para obtener todos los comentarios de una review o comentario
  getComments = async (req: Request, res: Response): Promise<Response> => {
    const { type, isReplyTo } = req.params;
    if (!type || !isReplyTo) {
      return this.errorRes(res, 400, "Missing fields");
    }
    if (type !== "comment" && type !== "review") {
      return this.errorRes(res, 400, "Invalid type");
    }
    try {
      const comments = await Comment.find({
        commentId: type === "comment" ? isReplyTo : null,
        reviewId: type === "review" ? isReplyTo : null,
      })
        .populate("userId", "-email -password -createdAt -updatedAt")
        .sort({ createdAt: -1 });
      return this.successRes(res, 200, "Comments found", comments);
    } catch (error) {
      return this.errorRes(res, 500, "Error getting comments", error);
    }
  };

  //funcion para obtener un comentario
  getComment = async (req: Request, res: Response): Promise<Response> => {
    const { commentId } = req.params;
    if (!commentId) {
      return this.errorRes(res, 400, "Missing fields");
    }
    try {
      const comment = await Comment.findById(commentId).populate(
        "userId",
        "-email -password -createdAt -updatedAt"
      );
      return this.successRes(res, 200, "Comment found", comment);
    } catch (error) {
      return this.errorRes(res, 500, "Error getting comment", error);
    }
  };
}

export default new CommentController();
