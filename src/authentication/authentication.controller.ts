import { Body, Controller, Get, HttpCode, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { AuthenticationService } from './authentication.service';
import { LocalAuthenticationGuard } from './jwt/localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';
import { User } from 'src/users/user.schema';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import JwtAuthenticationGuard from './jwt/jwt-authentication.guard';

@Controller('authentication')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
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


    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    @HttpCode(200)
    async logOut(@Req() request: RequestWithUser) {
      request.res?.setHeader(
        'Set-Cookie',
        this.authenticationService.getCookieForLogOut(),
      );
    }
  
    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
      return request.user;
    }
}
