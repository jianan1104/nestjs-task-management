import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        const { username, password } = authCredentialsDTO;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({ username, password: hashedPassword });
        try {
            await this.save(user);
        } catch (error) {
            console.log(error.code);
            // duplicate username
            if(error.code === '23505') {
                throw new ConflictException('Username is already exist.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}