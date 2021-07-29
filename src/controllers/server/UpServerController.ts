import {getCustomRepository, MoreThan} from "typeorm"
import { TokensRepository } from "../../repositories/TokenRepository"
import {activeTokens} from "../../server";

class UpServerController {

    async loadTokensDatabase() {

        const defaultExpirationHours = parseInt(process.env.DEFAULT_VALUE_TOKEN_EXPIRATION_TIME) * 60 * 60 * 1000;
        let now = new Date();
        now.setTime(now.getTime() - defaultExpirationHours);

        const tokensRepository = getCustomRepository(TokensRepository);
        const tokens = await tokensRepository.find({ created_at: MoreThan(now) });

        for (const tokenModel of tokens) {

            let data = {
                idToken     : tokenModel.idtoken,
                strToken    : tokenModel.strToken,
                idUser      : tokenModel.user.id,
                createdAt   : tokenModel.created_at
            };
            let idxTokenAlreadyExists = activeTokens.findIndex(t => t['idToken'] === tokenModel.idtoken);

            if (idxTokenAlreadyExists >= 0) {

                activeTokens[idxTokenAlreadyExists] = data;
            } else {

                activeTokens.push(data);
            }
        }
    }
}

export { UpServerController }
