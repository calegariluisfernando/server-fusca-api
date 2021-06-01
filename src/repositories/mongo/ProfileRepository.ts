import { MongoEntityManager, MongoRepository } from 'typeorm';
import { Profile } from '../../models/mongo/Profile';

@MongoEntityManager(Profile)
class ProfilesRepository extends MongoRepository<Profile>{}

export { ProfilesRepository }