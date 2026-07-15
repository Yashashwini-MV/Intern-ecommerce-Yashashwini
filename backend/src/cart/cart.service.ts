import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartDto } from './dto/add-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Product } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async addToCart(userId: number, dto: AddCartDto) {
    const existingCartItem = await this.prisma.cart.findFirst({
      where: {
        userId,
        productId: dto.productId,
      },
    });

    if (existingCartItem) {
      return this.prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + dto.quantity },
      });
    }

    return this.prisma.cart.create({
      data: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });
  }

  async getCart(userId: number) {
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
    });

    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const response = await firstValueFrom(
            this.httpService.get<Product>(
              `https://dummyjson.com/products/${item.productId}`,
            ),
          );
          const product = response.data;
          return {
            productId: item.productId,
            quantity: item.quantity,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            lineTotal: product.price * item.quantity,
          };
        } catch {
          return null;
        }
      }),
    );

    return cartWithProducts.filter((item) => item !== null);
  }

  async updateQuantity(userId: number, productId: number, dto: UpdateCartDto) {
    const existingCartItem = await this.prisma.cart.findFirst({
      where: { userId, productId },
    });

    if (!existingCartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    return this.prisma.cart.update({
      where: { id: existingCartItem.id },
      data: { quantity: dto.quantity },
    });
  }

  async removeFromCart(userId: number, productId: number) {
    const existingCartItem = await this.prisma.cart.findFirst({
      where: { userId, productId },
    });

    if (!existingCartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    return this.prisma.cart.delete({
      where: { id: existingCartItem.id },
    });
  }
}
