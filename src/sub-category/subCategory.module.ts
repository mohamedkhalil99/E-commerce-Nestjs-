import { Module } from '@nestjs/common';
import { SubCategoryController } from './subCategory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from './subCategory.schema';
import { SubCategoryService } from './subCategory.service';
import { Category, CategorySchema } from 'src/category/category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SubCategory.name, schema: SubCategorySchema }]),
  MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}