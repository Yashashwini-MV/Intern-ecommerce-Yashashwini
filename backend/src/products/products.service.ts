import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable()
export class ProductsService {
  constructor(private readonly httpService: HttpService) {}

  async getAllProducts(): Promise<ProductsResponse> {
    const response = await firstValueFrom(
      this.httpService.get<ProductsResponse>('https://dummyjson.com/products'),
    );
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Product>(`https://dummyjson.com/products/${id}`),
      );
      return response.data;
    } catch {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
}
