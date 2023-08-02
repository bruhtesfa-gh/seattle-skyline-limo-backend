import express, { NextFunction, Request, Response } from "express";
import path from "path";
import router from "./routes/index.routes";
import { globalErrorHandler } from "./util/error";
import rateLimit from "express-rate-limit";
import cors from "cors";
import passportLocal from "./config/passport-local";
import cookieParser from "cookie-parser";
import passport from "passport";
import { verifyToken } from "./util/token";
import { User } from "./config/db";
const PORT = process.env.PORT || 4040;

const app = express();
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "static")));
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: [
      "https://seattle-skyline-limo.netlify.app",
      "https://seattle-skyline-limo-admin.netlify.app",
      "https://limo-admin.onrender.com",
      "https://seattle-limo.onrender.com",
      "http://localhost:3000",
      "http://localhost:5173",
      "127.0.0.1:3000",
      "https://seattle-limos.onrender.com",
      "http://localhost",
      "127.0.0.1"
    ],
  })
);
app.use(cookieParser());
app.use(passport.initialize({}));
app.use(router);
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/static/index.html"));
});
app.use(rateLimit());
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
passportLocal(passport);
//global error handler
app.use(globalErrorHandler);
process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);
  // app.close(() => {
  //   process.exit(1);
  // }
  // );
});

process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
  // app.close(() => {
  //   process.exit(1);

  // });
});
