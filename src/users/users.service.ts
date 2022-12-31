import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {Model} from 'mongoose'
import { User, UserDocument } from './user.schema';
import * as mongoose from 'mongoose';
import CreateUserDto from './dto/createUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
    ) {}

    async create(payload: CreateUserDto) {
        console.log(payload)
        const createUser = new this.userModel(payload);
        return await createUser.save()
    }

    async getById(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException(); 
        }

        return user;
    }

    async getByEmail(email: string) {
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }
    
}


