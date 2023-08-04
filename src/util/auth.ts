import { User } from "../config/db";
import { verifyToken } from "./token";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export const passwordCompare = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export async function isAuth(req: Request, res: Response, next: NextFunction) {
  const decodedToken = await verifyToken(req.cookies.token || req.headers.authorization?.split(" ")[1] || "");

  const user = await User.findUniqueOrThrow({
    where: {
      id: decodedToken.sub,
    },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      id: true,
      updatedAt: true,
      img: true,
      createdAt: true,
    },
  });
  req.user = user;
  next();
}
