import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthDto } from "./dto/auth.dto";
import { Response } from "express";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() authDto: AuthDto): Promise<{ message: string }> {
    return this.authService.register(authDto)
  }

  @Post('login')
  login(@Body() authDto: AuthDto, @Res() res: Response): Promise<Response> {
    return this.authService.login(authDto, res)
  }

  @Get('logout')
  logout(@Res() res: Response): Promise<Response> {
    return this.authService.logout(res)
  }
}
