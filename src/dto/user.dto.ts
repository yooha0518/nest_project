import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/user.schema';

export class ReadOnlyUserRequestDto extends PickType(User, [
  'email',
  'name',
] as const) {
  @ApiProperty({
    example: '1234',
    description: 'id',
  })
  id: string;
}
