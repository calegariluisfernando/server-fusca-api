import { getCustomRepository } from "typeorm"
import { activeTokens, blackListToken } from "../../app"
import { TokensRepository } from "../../repositories/TokenRepository"

class UpServerController {

    async obterDadosToken() {

        const tokensRepository = getCustomRepository(TokensRepository);
        const tokens = await tokensRepository.find({});

        console.log('Tokens:', tokens);
        
    }
}

export { UpServerController }