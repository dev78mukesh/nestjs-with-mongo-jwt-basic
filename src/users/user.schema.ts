import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose'

export type UserDocument = User & Document;

@Schema({
    toJSON: {
        getters: true,
        virtuals: true
    }
})

export class User {
    @Transform(({ value }) => value.toString())
    _id: ObjectId;

    @Prop({required: true})
    firstName: string;

    @Prop({required: true})
    lastName: string;

    @Prop({unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    fullName: string;

}


const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({firstName: 'text', lastName: 'text'});

UserSchema.virtual('fullName').get(function(this: User) {
    return `${this.firstName} ${this.lastName}`;
});


export { UserSchema };
