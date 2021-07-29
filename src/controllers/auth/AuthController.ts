import { Request, Response } from 'express';
import { UsersRepository } from "../../repositories/UsersRepository";
import { getCustomRepository } from "typeorm";
import { Helpers } from "../../utils/Helpers";
import { AppError } from "../../error/AppError";
import { TokenDataInterface, TokenHandler } from "../../utils/TokenHandler";
import { TokensRepository } from '../../repositories/TokenRepository';
import { Token } from '../../models/Token';
import { activeTokens, blackListToken } from "../../server";

class AuthController {

    async login(request: Request, response: Response) {

        const { email, password } = request.body;

        const userRespository = getCustomRepository(UsersRepository);

        const user = await userRespository.findOne({ email, password: Helpers.generateMd5(password) });

        if (!user) {

            throw new AppError("User not found!");
        }

        const { id } = user;
        const dadosToken: TokenDataInterface = TokenHandler.sign({ id });

        const tokenRepository = getCustomRepository(TokensRepository);
        const tokenModel = tokenRepository.create({ idtoken: dadosToken['idToken'], strToken: dadosToken['token'], user });
        await tokenRepository.save(tokenModel);

        activeTokens.push({ 
            idToken     : tokenModel.idtoken, 
            strToken    : tokenModel.strToken, 
            idUser      : tokenModel.user.id, 
            createdAt   : tokenModel.created_at 
        });
        
        return response.json({ token: dadosToken['token'] });
    }

    async logout(request: Request, response: Response) {

        const { authorization } = request.headers;

        if (typeof authorization !== 'undefined') {

            const token = authorization.split(' ').pop();
            const tokenDecoded = TokenHandler.verify(token);
            const tokenId = tokenDecoded.token['jti'];

            if (tokenDecoded.status && !blackListToken.map((t: Token) => t.idtoken).includes(tokenId)) {

                const idxToken = activeTokens.findIndex((t: Token) => t.idtoken === tokenId);

                if (idxToken >= 0) {

                    blackListToken.push(activeTokens[idxToken]);
                    activeTokens.splice(idxToken, 1);
                }
            }
        }

        return response.status(200).json({});
    }

    async checkToken(request: Request, response: Response) {

        const { authorization } = request.headers;
        let flagRetorno = false;

        if (typeof authorization !== 'undefined') {

            const strToken = authorization.split(' ').pop();
            const { status, token: tokenDecoded } = TokenHandler.verify(strToken);

            if (status) {

                flagRetorno = activeTokens.find((t: Token) => t.idtoken === tokenDecoded['jti']);
            }
        }

        return response.json({ isValidToken: flagRetorno ? 1 : 0 });
    }
}

export { AuthController }