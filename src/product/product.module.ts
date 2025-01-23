import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { Category, CategorySchema } from 'src/category/category.schema';
import { SubCategory, SubCategorySchema } from 'src/sub-category/subCategory.schema';
import { Brand, BrandSchema } from 'src/brand/brand.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema }]),
  MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}