import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'nestjs',
      signOptions: {
        expiresIn: 3600,
      }
    }),
    TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
