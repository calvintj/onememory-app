import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/role.decorator';
import { RegisterAuthDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from 'src/common/guards/google-auth.guard';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    provider: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.registerCredentials(registerAuthDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(loginAuthDto);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2 * 1000, // 2 hours
    });

    return { user };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.OK)
  async googleAuthRedirect(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Now req.user is the Prisma User object returned by GoogleStrategy.validate()
    const user = req.user;

    // 3) Generate a JWT from that user
    const { token } = await this.authService.generateJwtToken(user as User);

    // 4) Set it in an HTTP-only cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    // 5) Return user profile (frontend can redirect afterward)
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @Get('admin-email')
  getAdminEmail(@Req() req: RequestWithUser) {
    return { message: `Hello admin ${req.user.email}` };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
