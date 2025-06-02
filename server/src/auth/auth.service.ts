import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    this.logger.log('Creating user', registerAuthDto);
    try {
      const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);
      const user = await this.usersService.create({
        email: registerAuthDto.email,
        password: hashedPassword,
        role: UserRole.USER,
      });
      this.logger.log('User created', user);
      return this.login({
        email: registerAuthDto.email,
        password: registerAuthDto.password,
      });
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    this.logger.log('Logging in user', loginAuthDto);
    try {
      const user = await this.usersService.findByEmail(loginAuthDto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid email');
      }

      const isPasswordValid = await bcrypt.compare(
        loginAuthDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);
      return {
        token,
        user,
      };
    } catch (error) {
      this.logger.error('Error logging in user', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.usersService.findByEmail(email);
  }
}
