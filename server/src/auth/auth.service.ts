import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserProvider, UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerCredentials(registerAuthDto: RegisterAuthDto) {
    this.logger.log('Creating user', registerAuthDto);
    try {
      const existingUser = await this.usersService.findByEmail(
        registerAuthDto.email,
      );
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);
      const newUser = await this.usersService.create({
        email: registerAuthDto.email,
        password: hashedPassword,
        role: UserRole.USER,
        provider: UserProvider.CREDENTIALS,
      });

      this.logger.log('User created', newUser);
      return newUser;
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  async registerOAuth(registerAuthDto: RegisterAuthDto) {
    this.logger.log('Creating user', registerAuthDto);
    try {
      const existingUser = await this.usersService.findByEmail(
        registerAuthDto.email,
      );
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      const newUser = await this.usersService.create({
        email: registerAuthDto.email,
        password: null,
        role: UserRole.USER,
        provider: UserProvider.GOOGLE,
      });

      this.logger.log('User created', newUser);
      return newUser;
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    this.logger.log('Logging in user', loginAuthDto);
    const user = await this.validateUser(loginAuthDto.email);

    if (user.provider === UserProvider.CREDENTIALS) {
      const isPasswordValid = await bcrypt.compare(
        loginAuthDto.password,
        user.password ?? '',
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
    }

    return this.generateJwtToken(user);
  }

  async generateJwtToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { token, user };
  }

  // Validate existing user
  async validateUser(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    return user;
  }
}
