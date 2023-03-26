import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class AuthDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email.' })
  email: string

  @IsNotEmpty()
  @Length(3, 20, { message: 'Password should be between 3 and 20 chars.' })
  password: string
}