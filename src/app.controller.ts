import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} //소비자가 물건을 구매

  @Get() // @Get('/')
  getHello(
    @Req() req: Request,
    @Body() Body,
    @Param() param: { id: string; name: string },
  ): string {
    console.log(req);
    console.log(param);

    return this.appService.getHello(); //소비자가 물건을 구매
  }
}
