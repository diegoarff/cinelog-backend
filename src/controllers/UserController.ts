import { Request, Response } from "express";
import { AuthRequest } from "../interfaces";
import BaseController from "./BaseController";
import { User } from "../models";

class UserController extends BaseController {
  updatePassword = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user._id;

    const { oldPassword, newPassword } = req.body;

    try {
      const user = await User.findById(userId);
      if (user == null) {
        return this.errorRes(res, 404, "User not found");
      }

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return this.errorRes(res, 400, "Invalid password");
      }

      user.password = newPassword;

      await user.save();

      return this.successRes(res, 200, "Password updated successfully");
    } catch (error) {
      return this.errorRes(res, 500, "Error updating password", error);
    }
  };

  getAuthUser = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user._id;

    try {
      const user = await User.findById(
        userId,
        "-password -createdAt -updatedAt -email"
      );

      if (!user) {
        return this.errorRes(res, 404, "User not found");
      }

      return this.successRes(res, 200, "User retrieved", user);
    } catch (error) {
      return this.errorRes(res, 500, "Error getting user", error);
    }
  };

  getUser = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;

    try {
      const user = await User.findById(
        userId,
        "-password -createdAt -updatedAt -email"
      );

      if (!user) {
        return this.errorRes(res, 404, "User not found");
      }

      return this.successRes(res, 200, "User retrieved", user);
    } catch (error) {
      return this.errorRes(res, 500, "Error getting user", error);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<Response> => {
    const { username, avatar } = req.body;
    const userId = (req as AuthRequest).user._id;

    try {
      const user = await User.findOne({ _id: userId });

      if (user == null) {
        return this.errorRes(res, 404, "User not found");
      }

      user.username = username ?? user.username;
      user.avatar = avatar ?? user.avatar;

      await user.save();

      return this.successRes(res, 200, "User updated", user.toSafeObject());
    } catch (error) {
      return this.errorRes(res, 500, "Error updating user", error);
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as AuthRequest).user._id;

    try {
      const user = await User.findOne({ _id: userId });

      if (user === null) {
        return this.errorRes(res, 404, "User not found");
      }

      await user.deleteOne();

      return this.successRes(res, 200, "Account deleted");
    } catch (error) {
      return this.errorRes(res, 500, "Error deleting user", error);
    }
  };
}

export default new UserController();
