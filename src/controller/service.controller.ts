//@ts-nocheck
import { rm } from "fs/promises";
import {
  ServicePostschema,
  ServiceUpdateschema,
} from "../validation_schemas/service.schema";
import { NextFunction, Request, Response } from "express";
import upload from "../config/multer";
import { Service } from "../config/db";
import path from "path";
import { catchAsync } from "../util/error";
import CustomError from "../util/CustomeError";
import uploadImageToCloudinary from "../config/cloudinary";

const uploads = upload.single("img");
export const postService = [
  uploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await ServicePostschema.validateAsync({
        ...req.body,
        img: req.file?.filename,
      });
      const publicId = await uploadImageToCloudinary(
        path.join(__dirname, "../uploads/", req.file?.filename)
      );
      const Service = await Service.create({
        data: {
          userId: req.user?.id,
          ...value,
          img: publicId,
        },
      });
      return res.send(Service);
    } catch (err) {
      if (req.file?.filename) {
        //if the validation fails, delete the uploaded file
        await rm(path.join(__dirname, "../uploads/", req.file?.filename));
      }
      next(err);
    }
  },
];
export const getServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query?.page) || 1;
    const PAGE_SIZE = 6;
    const limit = Number(req.query?.limit) || PAGE_SIZE;
    const results = await Service.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(results);
  }
);
export const getService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceId = req.params.id;
    const service = await Service.findUnique({
      include: {
        user: true,
      },
      where: {
        id: serviceId,
      },
    });
    if (!service) {
      return next(new CustomError("service not found", 404));
    }
    res.send(Service);
  }
);

export const deleteService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceId = req.params.id;
    const service = await Service.findUnique({
      where: {
        id: serviceId,
      },
    });
    if (!service) {
      return next(new CustomError("service not found", 404));
    }
    await Service.delete({
      //TODO delete file
      where: {
        id: serviceId,
      },
    });
    res.send("service deleted");
  }
);

export const updateService = [
  uploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceId = req.params.id;
      const service = await Service.findUnique({
        where: {
          id: serviceId,
        },
      });
      if (!service) {
        return next(new CustomError("service not found", 404));
      }
      const body = req.body;
      if (req.file) {
        const publicId = await uploadImageToCloudinary(
          path.join(__dirname, "../uploads/", req.file?.filename)
        );
        body["img"] = publicId;
      }
      const value = await ServiceUpdateschema.validateAsync(body);
      const updatedService = await Service.update({
        where: {
          id: serviceId,
        },
        data: value,
      });
      res.send(updatedService);
    } catch (err) {
      if (req.file?.filename) {
        //if the validation fails, delete the uploaded file
        await rm(path.join(__dirname, "../uploads/", req.file?.filename));
      }
      next(err);
    }
  },
];
