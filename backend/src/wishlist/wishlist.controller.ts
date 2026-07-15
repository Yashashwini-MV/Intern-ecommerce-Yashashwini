import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { WishlistService } from './wishlist.service';
import { AddWishlistDto } from './dto/add-wishlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: { userId: number; email: string };
}

@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addToWishlist(@Req() req: AuthenticatedRequest, @Body() dto: AddWishlistDto) {
    return this.wishlistService.addToWishlist(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getWishlist(@Req() req: AuthenticatedRequest) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  removeFromWishlist(
    @Req() req: AuthenticatedRequest,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeFromWishlist(req.user.userId, productId);
  }
}
