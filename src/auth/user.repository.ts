import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        const { username, password } = authCredentialsDTO;

        const user = this.create({ username, password });
        try {
            await this.save(user);
        } catch (error) {
            console.log(error.code);
            if(error.code === '23505') {
                throw new ConflictException('Username is already exist.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}