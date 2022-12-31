import { Body, Controller, Post } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { AuthenticationService } from './authentication.service';
@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}
    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authenticationService.register(registrationData);
    }
}
