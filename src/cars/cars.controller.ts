import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { CarsService } from './cars.service';
import { Car } from "@prisma/client";
import { CarDto } from "./dto/car.dto";
import { AuthGuard } from "@nestjs/passport";
import { UserGuard } from "../auth/auth.guards";
import { Request } from "express";

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): Promise<Car[]> {
    return this.carsService.findAll()
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(UserGuard)
  @Post()
  createCar(@Body() carDto: CarDto, @Req() req: Request) {
    return this.carsService.create(carDto, req)
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findById(@Param() param: {id: string}): Promise<Car> {
    return this.carsService.findById(param)
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @Patch(':id')
  updateById(@Param() param: {id: string}, @Body() carDto: CarDto, @Req() req: Request): Promise<{ carId: string, message: string}> {
    return this.carsService.updateById(param, carDto, req)
  }

  @HttpCode(HttpStatus.GONE)
  @UseGuards(UserGuard)
  @Delete(':id')
  deleteById(@Param() param: {id: string}): Promise<{ carId: string, message: string }> {
    return this.carsService.deleteById(param)
  }
}
