import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserRequestDto } from 'src/dto/user.request.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findUserByIdWithoutPassword(UserId: string): Promise<User | null> {
    const User = await this.userModel.findById(UserId).select('-password');
    return User;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async existsByEmail(email: string): Promise<object> {
    const result = await this.userModel.exists({ email });
    return result;
  }

  async create(User: UserRequestDto): Promise<User> {
    return await this.userModel.create(User);
  }

  async findByIdAndUpdateImg(id: string, fileName: string) {
    const User = await this.userModel.findById(id);

    User.imgUrl = `http://localhost:8000/media/${fileName}`;

    return User.imgUrl;
  }

  async findAll() {
    const Userlist = await this.userModel.find({});

    return Userlist;
  }

  async updateUserPassword(userId: string, data: UserRequestDto) {
    const result = await this.userModel.updateOne(
      { userId },
      {
        password: data.password,
      },
    );

    return result;
  }
}
