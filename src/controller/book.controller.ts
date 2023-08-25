import {
  BookPostschema,
  BookUpdateschema,
} from "../validation_schemas/book.schema";
import { NextFunction, Request, Response } from "express";
import { Book } from "../config/db";
import { catchAsync } from "../util/error";
import CustomError from "../util/CustomeError";

import nodemailer from "nodemailer";
import { COMFIRMAION_EMAIL } from "../config/mail";

export const postReservation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const value = await BookPostschema.validateAsync(req.body);
    const book = await Book.create({
      data: value,
      include: {
        vehicle: true,
      },
    });
    if (!book)
      return next(new CustomError("reservation not created", 500));
    // send email to user that tells him that his reservation is created and we will contact him soon
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, //
      },
    });

    // lets define our html template
    await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: book.email, // list of receivers
      subject: "Limousine Service Reservation Confirmation & Details", // Subject line
      html: COMFIRMAION_EMAIL(book), // html body
    });
    return res.status(201).send(book);
  }
);
export const getReservations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query?.page) || 1;
    const PAGE_SIZE = 10;
    const limit = Number(req.query?.limit) || PAGE_SIZE;
    const results = await Book.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(results);
  }
);
export const getReservation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.id;
    const book = await Book.findUnique({
      where: {
        id: bookId,
      },
      include: {
        vehicle: true,
      },
    });
    if (!book) {
      return next(new CustomError("reservation not found", 404));
    }
    res.send(book);
  }
);
export const deleteReservation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.id;
    const book = await Book.findUnique({
      where: {
        id: bookId,
      },
    });
    if (!book) {
      return next(new CustomError("reservation not found", 404));
    }
    await Book.delete({
      where: {
        id: bookId,
      },
    });
    res.send("reservation deleted");
  }
);

export const updateReservation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.id;
    const book = await Book.findUnique({
      where: {
        id: bookId,
      },
    });
    if (!book) {
      return next(new CustomError("reservation not found", 404));
    }
    const value = await BookUpdateschema.validateAsync(req.body);
    const updatedBook = await Book.update({
      where: {
        id: bookId,
      },
      data: value,
    });
    res.send(updatedBook);
  }
);
