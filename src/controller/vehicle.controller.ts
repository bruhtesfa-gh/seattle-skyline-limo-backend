//@ts-nocheck
import { rm } from "fs/promises";
import {
  VehiclePostschema,
  VehicleUpdateschema,
} from "../validation_schemas/vehicle.schema";
import { NextFunction, Request, Response } from "express";
import upload from "../config/multer";
import { Vehicle } from "../config/db";
import path from "path";
import { catchAsync } from "../util/error";
import CustomError from "../util/CustomeError";
import uploadImageToCloudinary from "../config/cloudinary";

const uploads = upload.single("img");
export const postVehicle = [
  uploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await VehiclePostschema.validateAsync({
        ...req.body,
        userId: req.user?.id,
        img: req.file?.filename,
      });
      const publicId = await uploadImageToCloudinary(
        path.join(__dirname, "../uploads/", req.file?.filename)
      );
      const car = await Vehicle.create({
        data: {
          ...value,
          img: publicId,
        },
      });
      return res.send(car);
    } catch (err) {
      if (req.file?.filename) {
        //if the validation fails, delete the uploaded file
        await rm(path.join(__dirname, "../uploads/", req.file?.filename));
      }
      next(err);
    }
  },
];
export const getVehicles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query?.page) || 1;
    const PAGE_SIZE = 6;
    const limit = Number(req.query?.limit) || PAGE_SIZE;
    const results = await Vehicle.findMany({
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
export const getVehicle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const carId = req.params.id;
    const car = await Vehicle.findUnique({
      where: {
        id: carId,
      },
    });
    if (!car) {
      return next(new CustomError("Vehicle not found", 404));
    }
    res.send(car);
  }
);

export const deleteVehicle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const carId = req.params.id;
    const car = await Vehicle.findUnique({
      where: {
        id: carId,
      },
    });
    if (!car) {
      return next(new CustomError("Vehicle not found", 404));
    }
    await Vehicle.delete({
      where: {
        id: carId,
      },
    });
    res.send("car deleted");
  }
);

export const updateVehicle = [
  uploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const carId = req.params.id;
      const car = await Vehicle.findUnique({
        where: {
          id: carId,
        },
      });
      if (!car) {
        return next(new CustomError("Vehicle not found", 404));
      }
      const body = req.body;
      if (req.file) {
        const publicId = await uploadImageToCloudinary(
          path.join(__dirname, "../uploads/", req.file?.filename)
        );
        body["img"] = publicId;
      }
      const value = await VehicleUpdateschema.validateAsync(body);
      const updatedCar = await Vehicle.update({
        where: {
          id: carId,
        },
        data: value,
      });
      res.send(updatedCar);
    } catch (err) {
      if (req.file?.filename) {
        //if the validation fails, delete the uploaded file
        await rm(path.join(__dirname, "../uploads/", req.file?.filename));
      }
      next(err);
    }
  },
];
