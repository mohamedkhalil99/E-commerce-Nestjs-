import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductRequestController } from './product-request.controller';
import { ProductRequestService } from './product-request.service';
import { ProductRequest, ProductRequestSchema } from './product-request.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductRequest.name, schema: ProductRequestSchema }])],
  controllers: [ProductRequestController],
  providers: [ProductRequestService],
})
export class ProductRequestModule {}