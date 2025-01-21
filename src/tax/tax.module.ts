import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { Tax, TaxSchema } from './tax.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tax.name, schema: TaxSchema }]),],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule {}