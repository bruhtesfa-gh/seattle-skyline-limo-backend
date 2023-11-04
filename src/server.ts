import express, { NextFunction, Request, Response } from "express";
import path from "path";
import router from "./routes/index.routes";
import { globalErrorHandler } from "./util/error";
import rateLimit from "express-rate-limit";
import cors from "cors";
import passportLocal from "./config/passport-local";
import cookieParser from "cookie-parser";
import passport from "passport";

//import { User } from "./config/db";


// (async () => {
//   await User.create({
//     data: {
//       email: "neba@gmail.com",
//       lastName: "Daniel",
//       firstName: "Nebiyu",
//       password: "$2a$10$EZq8FjlPlFQJtctyPFfOfuYBRf1SAb57C/Kj1AzKUrgFfpSpzAQSG",
//       // password: "123456",
//     },
//   });
// })();


const app = express();

app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "127.0.0.1:3000",
      "https://seattle-skyline-limo.netlify.app/",
      "https://seattle-skyline-limo-admin.netlify.app/",
      "http://localhost",
      "127.0.0.1"
    ],
  })
);
app.use(cookieParser());
app.use(passport.initialize({}));
app.use(router);
app.use(rateLimit());
app.listen(4000, () => {
  console.log("Server started on port 4000");
});
passportLocal(passport);

app.use(globalErrorHandler);
process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);

});

process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
 
});
