import { PickType } from '@nestjs/swagger';
import { Cat } from 'src/cats/cats.schema';

export class LoginrequestDto extends PickType(Cat, [
  'email',
  'password',
] as const) {}
