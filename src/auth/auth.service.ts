import { UserRepository } from './../user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginrequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly UserRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginrequestDto) {
    const { email, password } = data;

    console.log('AuthService 실행');

    const cat = await this.UserRepository.findUserByEmail(email);

    if (!cat) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      cat.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    const payload = { email: email, sub: cat.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
