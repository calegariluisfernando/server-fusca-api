import { Router, Request, Response, NextFunction } from 'express';
import { activeTokens, blackListToken } from './app';
import { AppError } from './error/AppError';
import { TokenHandler } from "./utils/TokenHandler";

const middleware = Router();

// Middleware Check Token
middleware.use('/', (request: Request, response: Response, next: NextFunction) => {

    const { path } = request;
    const publicPaths = process.env.PUBLIC_ROUTES.split(',').map(p => p.trim());

    if (!publicPaths.includes(path)) {

        const { authorization } = request.headers;

        if (typeof authorization === 'undefined') {

            throw new AppError('Access denied!', 401);
        }

        const checkedToken = TokenHandler.verify(authorization);
        
        if (checkedToken.status === false) {

            if (checkedToken.message) {

                throw new AppError(checkedToken.message, 401);
            } else {

                throw new AppError('Access denied!', 401);
            }

        } else if (blackListToken.map(t => t['idToken']).includes(checkedToken.token['jti'])) {

            throw new AppError('Access denied!', 401);
        } else if (!activeTokens.map(t => t['idToken']).includes(checkedToken.token['jti'])) {

            throw new AppError('Access denied!', 401); 
        }
    }

    next();
});


export { middleware };