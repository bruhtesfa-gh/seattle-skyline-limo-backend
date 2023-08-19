import { NextFunction, Request, Response, Router } from "express";
const router = Router();
import blogRouter from "./blog.routes";
import vehicleRouter from "./vehicle.routes";
import bookRouter from "./book.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import serviceRouter from "./service.routes";
import { catchAsync } from "../util/error";
import { Blog, Book, User, Vehicle } from "../config/db";
import { isAuth } from "../util/auth";
import { sendMail } from "../config/mail";

router.use("/auth", authRouter);
router.use("/blog", blogRouter);
router.use("/book", bookRouter);
router.use("/service", serviceRouter);
router.use("/user", catchAsync(isAuth), userRouter);
router.use("/vehicle", vehicleRouter);
router.post("/mail", async (req, res) => {
  const { name, email, phone, message } = req.body;
  await sendMail({
    name,
    email,
    phone,
    message,
  });
  res.send("success");
});
router.get("/stat", async (req, res) => {
  const numberOfPendingReservation = await Book.count({
    where: {
      status: "PENDING",
    },
  });
  const numberOfCompletedReservation = await Book.count({
    where: {
      status: "COMPLETED",
    },
  });
  const numberOfReservation = await Book.count();
  const numberOfRejectedReservation = await Book.count({
    where: {
      status: "REJECTED",
    },
  });
  const numberOfBlogs = await Blog.count();
  const numberOfVehicle = await Vehicle.count();
  const numberOfNewReservation = await Book.count({
    where: {
      createdAt: {
        gte: new Date(new Date().getTime() - 12 * 60 * 60 * 1000),
      },
    },
  });
  res.send({
    numberOfPendingReservation,
    numberOfCompletedReservation,
    numberOfRejectedReservation,
    numberOfBlogs,
    numberOfReservation,
    numberOfVehicle,
    numberOfNewReservation,
  });
});
router.get(
  "/me",
  catchAsync(isAuth),
  catchAsync(async (req: Request, res: Response) => {
    return res.json(req.user);
  })
);
export default router;
