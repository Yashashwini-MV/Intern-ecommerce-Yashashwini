import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { userId: number; email: string };
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  placeOrder(@Req() req: AuthenticatedRequest) {
    return this.ordersService.placeOrder(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getOrders(@Req() req: AuthenticatedRequest) {
    return this.ordersService.getOrders(req.user.userId);
  }
}
