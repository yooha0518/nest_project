import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Cat } from 'src/cats/cats.schema';

export class ReadOnlyCatRequestDto extends PickType(Cat, [
  'email',
  'name',
] as const) {
  @ApiProperty({
    example: '1234',
    description: 'id',
  })
  id: string;
}
