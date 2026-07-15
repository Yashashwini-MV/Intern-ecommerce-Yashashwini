import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async placeOrder(userId: number) {
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const address = await this.prisma.address.findUnique({
      where: { userId },
    });

    if (!address) {
      throw new BadRequestException(
        'No address found. Please add an address before checkout.',
      );
    }

    const itemsWithPrices = await Promise.all(
      cartItems.map(async (item) => {
        const response = await firstValueFrom(
          this.httpService.get<Product>(
            `https://dummyjson.com/products/${item.productId}`,
          ),
        );
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: response.data.price,
        };
      }),
    );

    const totalAmount = itemsWithPrices.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
        },
      });

      await tx.orderItem.createMany({
        data: itemsWithPrices.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      await tx.cart.deleteMany({
        where: { userId },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: { orderItems: true },
      });
    });
  }

  async getOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: true },
      orderBy: { orderDate: 'desc' },
    });
  }
}
