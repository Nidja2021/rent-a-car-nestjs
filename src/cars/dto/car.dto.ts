import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CarDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsArray()
  images: string[]

  @IsNotEmpty()
  @IsBoolean()
  availability: boolean
}