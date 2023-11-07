//@ts-nocheck
import { rm } from "fs/promises";
import {
  BlogPostschema,
  BlogUpdateschema,
} from "../validation_schemas/blog.schema";
import { NextFunction, Request, Response } from "express";
import upload from "../config/multer";
import { Blog } from "../config/db";
import path from "path";
import { catchAsync } from "../util/error";
import CustomError from "../util/CustomeError";
import uploadImageToCloudinary from "../config/cloudinary";

const uploads = upload.single("img");

export const postBlog = [
  uploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await BlogPostschema.validateAsync({
        ...req.body,
        img: req.file?.filename,
      });
      const publicId = await uploadImageToCloudinary(
        path.join(__dirname, "../uploads/", req.file?.filename)
      );
      const blog = await Blog.create({
        data: {
          userId: +req.user?.id,
          ...value,
          img: publicId,
        },
      });
      return res.send(blog);
    } catch (err) {
      if (req.file?.filename) {
        //if the validation fails, delete the uploaded file
        await rm(path.join(__dirname, "../uploads/", req.file?.filename));
      }
      next(err);
    }
  },
];
export const getBlogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query?.page) || 1;
    const PAGE_SIZE = 6;
    const limit = Number(req.query?.limit) || PAGE_SIZE;
    const results = await Blog.findMany({
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
export const getBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = +req.params.id;
    const blog = await Blog.findUnique({
      include: {
        user: true,
      },
      where: {
        id: blogId,
      },
    });
    if (!blog) {
      return next(new CustomError("blog not found", 404));
    }
    res.send(blog);
  }
);

export const deleteBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = +req.params.id;
    const blog = await Blog.findUnique({
      where: {
        id: blogId,
      },
    });
    if (!blog) {
      return next(new CustomError("blog not found", 404));
    }
    await Blog.delete({
      //TODO delete file
      where: {
        id: blogId,
      },
    });
    res.send("Blog deleted");
  }
);

export const updateBlog = [
  uploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = +req.params.id;
      const blog = await Blog.findUnique({
        where: {
          id: blogId,
        },
      });
      if (!blog) {
        return next(new CustomError("blog not found", 404));
      }
      const body = req.body;
      if (req.file) {
        const publicId = await uploadImageToCloudinary(
          path.join(__dirname, "../uploads/", req.file?.filename)
        );
        body["img"] = publicId;
      }
      const value = await BlogUpdateschema.validateAsync(body);
      const updatedBlog = await Blog.update({
        where: {
          id: blogId,
        },
        data: value,
      });
      res.send(updatedBlog);
    } catch (err) {
      if (req.file?.filename) {
        //if the validation fails, delete the uploaded file
        await rm(path.join(__dirname, "../uploads/", req.file?.filename));
      }
      next(err);
    }
  },
];
