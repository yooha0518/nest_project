import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRequestDto } from 'src/dto/user.request.dto';
import { User } from '../user.schema';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isuserExist = await this.userRepository.existsByEmail(email);

    if (isuserExist) {
      throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }

  async uploadImg(user: User, file: Express.Multer.File) {
    const fileName = `user/${file.filename}`;

    const newuser = await this.userRepository.findByIdAndUpdateImg(
      user.id,
      fileName,
    );
    console.log(newuser);
    return newuser;
  }

  async getAllUser() {
    const alluser = await this.userRepository.findAll();
    const readOnlyuser = alluser.map((user) => user.readOnlyData);
    return readOnlyuser;
  }

  async updateUserPassword(userId: string, data: UserRequestDto) {
    const result = await this.userRepository.updateUserPassword(userId, data);
    return result;
  }
}
