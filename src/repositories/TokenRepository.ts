import { EntityRepository, Repository } from "typeorm";
import { Token } from "../models/Token";

@EntityRepository(Token)
class TokensRepository extends Repository<Token>{}

export { TokensRepository };