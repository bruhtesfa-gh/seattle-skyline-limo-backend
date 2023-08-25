import { CommentPostschema } from "../validation_schemas/comment.schema";
import { NextFunction, Request, Response } from "express";
import { Comment } from "../config/db";
import { catchAsync } from "../util/error";
import CustomError from "../util/CustomeError";

export const postComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const value = await CommentPostschema.validateAsync(req.body);
    const comment = await Comment.create({
      data: value,
    });
    return res.status(201).send(comment);
  }
);
export const getComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query?.page) || 1;
    const PAGE_SIZE = 10;
    const limit = Number(req.query?.limit) || PAGE_SIZE;
    const results = await Comment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        blogId: req?.params?.blogId,
      },
    });
    res.send(results);
  }
);
export const getComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.id;
    const comment = await Comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      return next(new CustomError("Comment not found", 404));
    }
    res.send(comment);
  }
);
export const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentID = req.params.id;
    const comment = await Comment.findUnique({
      where: {
        id: commentID,
      },
    });
    if (!comment) {
      return next(new CustomError("Comment not found", 404));
    }
    await Comment.delete({
      where: {
        id: commentID,
      },
    });
    res.send("Comment deleted");
  }
);
