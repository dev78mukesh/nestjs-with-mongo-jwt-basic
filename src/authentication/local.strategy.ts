import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthenticationService } from './authentication.service';
import { UserDocument } from 'src/users/user.schema'

@Injectable()
export class LocalStrategy extends PassportStrategy (Strategy) {
    constructor (public readonly authenticationService: AuthenticationService) {
        super({
            usernameField: 'email'
        })
    }

    async validate(email: string, password: string): Promise<UserDocument> {
        return this.authenticationService.getAuthenticatedUser(email, password);
    }
}