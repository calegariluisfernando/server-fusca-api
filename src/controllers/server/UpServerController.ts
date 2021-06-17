import { getCustomRepository } from "typeorm"
import { activeTokens, blackListToken } from "../../app"
import { TokensRepository } from "../../repositories/TokenRepository"

class UpServerController {

    async obterDadosToken() {

        const tokensRepository = getCustomRepository(TokensRepository);
        
    }
}

export { UpServerController }