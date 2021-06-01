import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/mysql/User";

@EntityRepository(User)
class UsersRepository extends Repository<User>{}

export { UsersRepository };