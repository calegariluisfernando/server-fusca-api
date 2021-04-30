import * as jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

interface PayloadData {

    id: number;
    expiration?: number;
}

interface TokenDataInterface {

    idToken: string;
    token: string;
}

interface TokenVerifyInterface {

    status: boolean;
    token?: object | string;
    message?: string;
}

class TokenHandler {

    static sign(payload: PayloadData): TokenDataInterface {

        const { id, expiration } = payload;

        const hoursExpirations = expiration
            ? expiration
            : parseInt(process.env.DEFAULT_VALUE_TOKEN_EXPIRATION_TIME)
        ;

        const jwtid = v4();

        const token = jwt.sign(
            { id },
            process.env.SECRET_KEY,
            {  expiresIn: hoursExpirations * 60 * 60,  jwtid, issuer: process.env.ISSUER_TOKEN }
        );

        return { idToken: jwtid, token };
    }

    static verify(token: string): TokenVerifyInterface {

        let tokenData: TokenVerifyInterface;
        try {

            // Verificar se token é valido
            token = token.split(' ').pop();
            const decoded  = jwt.verify(token, process.env.SECRET_KEY);

            // Verificar se token esta na lista negra.
            tokenData = { status: true, token: decoded };
            return tokenData;
        } catch(err) {

            tokenData = { status: false };
            if (err.expiredAt) {

                tokenData = { status: false, message: 'Expired Token!' };
            }

            return tokenData
        }


    }
}

export { TokenHandler, TokenDataInterface, TokenVerifyInterface, PayloadData };
