import BaseController from './BaseController';
import type { Request, Response } from 'express';
import { User } from '../models';

class AuthController extends BaseController {
  signUp = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, email, password } = req.body;

      const userExists = await User.exists({ username });

      if (userExists !== null) {
        return this.errorRes(res, 400, 'Username is already taken');
      }

      const emailExists = await User.exists({ email });
      if (emailExists !== null) {
        return this.errorRes(res, 400, 'Account with email already exists');
      }

      const user = await User.create({
        username,
        email,
        password,
    });

      return this.successRes(res, 201, 'User created', user.toSafeObject());
    } catch (error) {
      return this.errorRes(res, 500, 'Internal server error');
    }
  };

  signIn = async (req: Request, res: Response): Promise<Response> => {
    const { identifier, password } = req.body;

    try {
      const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
      });

      if (user == null) {
        return this.errorRes(res, 404, 'User not found');
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return this.errorRes(res, 400, 'Invalid password');
      }

      const token = user.createToken();

      return this.successRes(res, 200, 'User logged in', {
        token,
        userId: user._id,
      });
    } catch (error) {
      return this.errorRes(res, 500, 'Internal server error', error);
    }
  };
}

export default new AuthController();
