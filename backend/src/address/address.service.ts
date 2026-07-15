import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async saveAddress(userId: number, dto: AddressDto) {
    const existingAddress = await this.prisma.address.findUnique({
      where: { userId },
    });

    if (existingAddress) {
      return this.prisma.address.update({
        where: { userId },
        data: dto,
      });
    }

    return this.prisma.address.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async getAddress(userId: number) {
    const address = await this.prisma.address.findUnique({
      where: { userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }
}
