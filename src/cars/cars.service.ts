import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {Car} from "@prisma/client"
import { CarDto } from "./dto/car.dto";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class CarsService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) {}

  async findAll(): Promise<Car[]> {
    return await this.prismaService.car.findMany()
  }

  async create( carDto: CarDto, req: Request) {
    const {name, images, availability} = carDto

    const user = await this.jwtService.decode(req.cookies.token)

    const car = await this.prismaService.car.create({
      data: {
        name, images, availability, userId: user['id']
      }
    })

    return { carId: car.id, message: "Car posted successfully." }
  }

  async findById(param: { id: string }): Promise<Car> {
    const { id } = param
    const foundCar = await this.prismaService.car.findUnique({ where: { id }})
    if (!foundCar) throw new NotFoundException('Car with this id does not exists.')

    return foundCar
  }

  async updateById(param: {id: string}, carDto: CarDto, req: Request): Promise<{ carId: string, message: string }> {
    const { id } = param
    const {name, images, availability} = carDto

    const foundCar = await this.prismaService.car.findUnique({ where: { id }})
    if (!foundCar) throw new NotFoundException('Car with this id does not exists.')

    const user = await this.jwtService.decode(req.cookies.token)

    const car = await this.prismaService.car.update({
      where: { id },
      data: {
        name, images, availability, userId: user['id']
      }
    })

    return { carId: car.id, message: 'Car has been updated.' }
  }

  async deleteById(param: {id: string}) : Promise<{ carId: string, message: string }> {
    const { id } = param
    const foundCar = await this.prismaService.car.findUnique({ where: { id }})
    if (!foundCar) throw new NotFoundException('Car with this id does not exists.')

    await this.prismaService.car.delete({ where: { id }})

    return { carId: id, message: 'Car has been deleted successfully.' }
  }


}
