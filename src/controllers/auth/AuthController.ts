import { Request, Response } from 'express';
import { UsersRepository } from "../../repositories/UsersRepository";
import { getCustomRepository } from "typeorm";
import { Helpers } from "../../utils/Helpers";
import { AppError } from "../../error/AppError";
import { TokenDataInterface, TokenHandler } from "../../utils/TokenHandler";
import { activeTokens, blackListToken } from "../../app";
import { ProfilesRepository } from '../../repositories/mongo/ProfileRepository';

class AuthController {

    async login(request: Request, response: Response) {

        const { email, password } = request.body;

        const repoProfile = getCustomRepository(ProfilesRepository);
        console.log('Passei aqui!');

        const userRespository = getCustomRepository(UsersRepository);
        const user = await userRespository.findOne({ email, password: Helpers.generateMd5(password) });

        if (!user) {

            throw new AppError("User not found!");
        }

        const { id } = user;
        const dadosToken: TokenDataInterface = TokenHandler.sign({ id });

        activeTokens.push({ idToken: dadosToken['idToken'], token: dadosToken['token'] });

        return response.json({ token: dadosToken['token'] });
    }

    async logout(request: Request, response: Response) {

        const { authorization } = request.headers;

        if (typeof authorization !== 'undefined') {

            const token = authorization.split(' ').pop();
            const tokenDecoded = TokenHandler.verify(token);
            const tokenId = tokenDecoded.token['jti'];

            if (tokenDecoded.status && !blackListToken.map(t => t['idToken']).includes(tokenId)) {

                blackListToken.push({ idToken: tokenDecoded.token['jti'], token });
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

                flagRetorno = activeTokens.map(item => item['idToken']).includes(tokenDecoded['jti']);
            }
        }

        return response.json({ isValidToken: flagRetorno ? 1 : 0 });
    }
}

export { AuthController }