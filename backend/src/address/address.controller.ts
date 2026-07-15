import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { userId: number; email: string };
}

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  saveAddress(@Req() req: AuthenticatedRequest, @Body() dto: AddressDto) {
    return this.addressService.saveAddress(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAddress(@Req() req: AuthenticatedRequest) {
    return this.addressService.getAddress(req.user.userId);
  }
}
