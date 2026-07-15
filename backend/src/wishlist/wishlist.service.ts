import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { AddWishlistDto } from './dto/add-wishlist.dto';
import { Product } from '../products/products.service';

@Injectable()
export class WishlistService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async addToWishlist(userId: number, dto: AddWishlistDto) {
    const existingWishlistItem = await this.prisma.wishlist.findFirst({
      where: {
        userId,
        productId: dto.productId,
      },
    });

    if (existingWishlistItem) {
      throw new ConflictException('Product already in wishlist');
    }

    return this.prisma.wishlist.create({
      data: {
        userId,
        productId: dto.productId,
      },
    });
  }

  async getWishlist(userId: number): Promise<Product[]> {
    const wishlistItems = await this.prisma.wishlist.findMany({
      where: { userId },
    });

    const products = await Promise.all(
      wishlistItems.map(async (item) => {
        const response = await firstValueFrom(
          this.httpService.get<Product>(
            `https://dummyjson.com/products/${item.productId}`,
          ),
        );
        return response.data;
      }),
    );

    return products;
  }

  async removeFromWishlist(userId: number, productId: number) {
    const existingWishlistItem = await this.prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!existingWishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    return this.prisma.wishlist.delete({
      where: {
        id: existingWishlistItem.id,
      },
    });
  }
}
