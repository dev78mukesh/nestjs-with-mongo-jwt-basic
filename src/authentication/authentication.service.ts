import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service';
import MongoError from 'src/utils/mongoError.enum';
@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UsersService
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
}
