import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import {
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
  Body,
  UseGuards,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserRequestDto } from 'src/dto/user.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyUserRequestDto } from 'src/dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginrequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';
import { UserService } from '../services/user.service';
import { User } from '../user.schema';

@Controller('User')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private readonly authService: AuthService,
  ) {} //의존성 주입

  @ApiOperation({ summary: '현재 유저 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user: User) {
    return user.readOnlyData;
  }

  @ApiOperation({ summary: '유저 비밀번호 변경' })
  @Put('user')
  updateUserPassword(
    @Body() updateData: UserRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.UserService.updateUserPassword(user.id, updateData);
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error....',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: ReadOnlyUserRequestDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: UserRequestDto) {
    return await this.UserService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginrequestDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '이미지 업로드' })
  @UseInterceptors(FileInterceptor('image', multerOptions('User')))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadUserImg(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    console.log(file, 'file');
    return this.UserService.uploadImg(user, file);
  }

  @ApiOperation({ summary: '모든 유저 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllUser() {
    return this.UserService.getAllUser();
  }
}
