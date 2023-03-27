import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.JwtExtract])
    });
  }

  private static JwtExtract(req: Request): string | null {
    if (req.cookies && 'token' in req.cookies)
      return req.cookies.token
    return null
  }


}