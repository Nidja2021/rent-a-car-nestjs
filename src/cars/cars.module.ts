import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule],
  controllers: [CarsController],
  providers: [CarsService]
})
export class CarsModule {}
