import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service';
import MongoError from 'src/utils/mongoError.enum';
import LogInDto from './dto/login.dto';
import TokenPayload from './jwt/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}
    
    public async register(payload: RegisterDto) {
        const hashedPassword = await bcrypt.hash(payload.password, 10)
        try {
            return await this.userService.create({
                ...payload,
                password: hashedPassword
            });
        } catch(err) {
            if (err?.code === MongoError.DuplicateKey) {
                throw new HttpException(
                    'User with that email already exists',
                    HttpStatus.BAD_REQUEST,
                  );
            }

            throw new HttpException(
                'Something went wrong',
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
        }
    }

    public getCookieWithJwtToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
          'JWT_EXPIRATION_TIME',
        )}`;
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
          const user = await this.userService.getByEmail(email);
          await this.verifyPassword(plainTextPassword, user.password);
          return user;
        } catch (error) {
          throw new HttpException(
            'Wrong credentials provided',
            HttpStatus.BAD_REQUEST,
          );
        }
      }


      private async verifyPassword(
        plainTextPassword: string,
        hashedPassword: string,
      ) {
        const isPasswordMatching = await bcrypt.compare(
          plainTextPassword,
          hashedPassword,
        );
        if (!isPasswordMatching) {
          throw new HttpException(
            'Wrong credentials provided',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
}
