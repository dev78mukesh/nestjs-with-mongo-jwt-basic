import { Body, Controller, HttpCode, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { AuthenticationService } from './authentication.service';
import { LocalAuthenticationGuard } from './jwt/localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';
import { User } from 'src/users/user.schema';

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}
    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authenticationService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUser) {
      const { user } = request;
      const cookie = this.authenticationService.getCookieWithJwtToken(user._id);
      request.res?.setHeader('Set-Cookie', cookie);
      return user;
    }
  
}
