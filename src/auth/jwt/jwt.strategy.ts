import { UserRepository } from './../../user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //jwt전략
  constructor(private readonly UserRepository: UserRepository) {
    console.log('JwtStrategy 실행');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'process.env.JWT_SECRET',
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user = await this.UserRepository.findUserByIdWithoutPassword(
      payload.sub,
    );

    if (user) {
      return user; //req.user 등록
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
