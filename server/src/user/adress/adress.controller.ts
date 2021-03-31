import { Body, Controller, Delete, Get, HostParam, Param, Post } from '@nestjs/common';
import { AdressService } from './adress.service';
import { Adress } from './scheme/adress.entity';

@Controller('user/:usr/adress')
export class AdressController {
  constructor(private readonly adressService: AdressService) {
  }

  @Get()
  findAll(@Param('usr') id : string) : Promise<Adress[]> {
    // console.log(id)
    return this.adressService.findAll()
  }

  @Get('/:id')
  find(@Param('id') id : string, @Param('usr') usrId : string) : Promise<Adress> {
    console.log(id, usrId)
    return this.adressService.find(id)
  }

  @Post('/create')
  create(@Body() adress: Adress, @Param('usr') usrId: string ) : Promise<Adress> {
    return this.adressService.create(adress, usrId)
  }

  @Delete('/id')
  remove(@Param('id') id : string, @Param('usr') usrId : string) {
    return this.adressService.remove(usrId, id)
  }

}
