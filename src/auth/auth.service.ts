import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as bcrypt from 'bcrypt'
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { jwtSecret } from "../utils/constants";


@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) {}

  async register(authDto: AuthDto): Promise<{ message: string }> {
    const {email, password} = authDto

    const foundUser = await this.prismaService.user.findUnique({where: {email}})

    if (foundUser) throw new BadRequestException('Email already exists.')

    await this.prismaService.user.create({
      data: {
        email,
        password: await this.hashPassword(password)
      }
    })

    return { message: "User has registered successfully." }
  }

  async login(authDto: AuthDto, res: Response): Promise<Response> {
    const { email, password } = authDto

    const user = await this.prismaService.user.findUnique({where: {email}})

    if (!user) throw new BadRequestException('Wrong credentials.')

    if (!await this.comparePasswords(password, user.password)) {
      throw new BadRequestException('Wrong credentials.')
    }

    const token = await this.signToken({id: user.id})
    res.cookie('token', token, { httpOnly: true })

    return res.status(200).json({ message: 'User has logged in successfully.' })
  }

  async logout(res: Response): Promise<Response> {
    res.clearCookie('token')
    return res.status(200).json({ message: 'User has logged out successfully.' })
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
  }

  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compareSync(password, hashedPassword);
  }

  private async signToken(payload: {id: string}) {
    return this.jwtService.signAsync(payload, {secret: jwtSecret, expiresIn: '10m'})
  }

}
