//@ts-nocheck
import { NextFunction, Request, Response, Router } from "express";
import { User } from "../config/db";
import upload from "../config/multer";
import { rm } from "fs/promises";
import path from "path";
import {
  userChangePasswordSchema,
  userUpdateschema,
} from "../validation_schemas/user.schema";
import { comparePassword, hashPassword } from "../util/password";
import uploadImageToCloudinary from "../config/cloudinary";
const router = Router();
const uploads = upload.single("img");
const userPropertiestWithPassword = {
  createdAt: true,
  email: true,
  firstName: true,
  id: true,
  img: true,
  lastName: true,
  updatedAt: true,
};
router.patch("/update-profile", [
  uploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findUnique({
        where: {
          id: req.user?.id as number,
        },
      });
      if (!user) {
        return res.status(404).send("user not found");
      }
      const body = req.body;
      if (req.file) {
        const publicId = await uploadImageToCloudinary(
          path.join(__dirname, "../uploads/", req.file?.filename)
        );
        body["img"] = publicId;
      }
      const value = await userUpdateschema.validateAsync(body);
      const updatedUser = await User.update({
        where: {
          id: req.user?.id as number,
        },
        select: userPropertiestWithPassword,
        data: value,
      });
      res.send(updatedUser);
    } catch (err) {
      if (req.file?.filename) {
        //if the validation fails, delete the uploaded file
        await rm(path.join(__dirname, "../uploads/", req.file?.filename));
      }
      next(err);
    }
  },
]);
router.patch(
  "/change-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findUnique({
        where: {
          id: req?.user?.id as number,
        },
      });
      if (!user) {
        return res.status(404).send("User not found");
      }
      const body = req.body;
      const value = await userChangePasswordSchema.validateAsync(body);
      if ((await comparePassword(value.oldPassword, user.password)) === false) {
        return res.status(400).send("Old password is incorrect");
      }
      const updatedUser = await User.update({
        where: {
          id: req?.user?.id as number,
        },
        select: userPropertiestWithPassword,
        data: {
          password: await hashPassword(value.newPassword),
        },
      });
      res.send(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
