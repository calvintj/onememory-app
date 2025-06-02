import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { User } from '@prisma/client';

interface GoogleProfile extends Profile {
  emails: { value: string; verified: boolean }[];
  password: string | null;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_CALLBACK_URL
    ) {
      throw new Error('Missing required Google OAuth environment variables');
    }

    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  /**
   * Called by Passport after a successful Google OAuth handshake.
   * If a user with this email exists, return it.
   * Otherwise, create a new OAuth‐only user and return that.
   * The returned User object becomes req.user in the controller.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile, // passport-google-oauth20's Profile type
    done: VerifyCallback,
  ): Promise<any> {
    // 1) Extract email from Google profile
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(
        new UnauthorizedException('No email found in Google profile'),
        null as unknown as User,
      );
    }

    let user: User | null = null;

    // 2) Try to find an existing user by email
    try {
      user = await this.authService.validateUser(email);
    } catch (err: any) {
      console.log(err);
      // findByEmail throws if not found; swallow that error and keep user=null
      user = null;
    }

    // 3) If no user exists, register one via OAuth
    if (!user) {
      // We call registerOAuth with only the email; password will be set to null inside
      user = await this.authService.registerOAuth({
        email,
        password: null as unknown as string,
      });
    }

    // 4) Return that user object – Passport will set it on req.user
    //    (controller can then generate a JWT from it and set a cookie)
    return done(null, user);
  }
}
