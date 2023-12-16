import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export function checkAuth(
    req: Request,
    res: Response,
    next: NextFunction): void 
    {
    passport.authenticate(
        'jwt',
        { session: false },
        (err: Error, user: Express.User) => {
            if (err) {
                return res
                .status(500)
                .json({ status: 'error', message: 'Internal Server Error' });
            }

            if (!user) {
                return res
                .status(401)
                .json({ status: 'error', message: 'Unauthorized' });
            }

            req.user = user;
            next();
        },
    )(req, res, next);
}