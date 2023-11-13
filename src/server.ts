import express from "express";
import path from "path";
import router from "./routes/index.routes";
import { globalErrorHandler } from "./util/error";
// import rateLimit from "express-rate-limit";
import cors from "cors";
import passportLocal from "./config/passport-local";
import cookieParser from "cookie-parser";
import passport from "passport";
import axios from "axios";
const app = express();

// Replace 'example.com' with your server's domain or IP address
const serverUrl = 'http://seattle-skyline-limo-server.onrender.com/users';
// Replace 300000 (5 minutes) with the desired interval in milliseconds
const interval = 6000;

/**
 * Keeps the server alive by sending a ping request to the server URL.
 *
 * @param {string} serverUrl - The URL of the server.
 * @return {void} This function does not return a value.
 */
const keepServerAlive = () => {
  axios.get(serverUrl).then((res) => {
    if (!res.data) {
      throw new Error(`Failed to ping server at ${serverUrl}`);
    }
  }).catch((error) => {
    console.error(`Failed to ping server at ${serverUrl}:`, error);
  })
}



app.use(express.static(path.join(__dirname, "uploads")));
// app.set('trust proxy', true)
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "127.0.0.1:3000",
      "https://seattle-skyline-limo.netlify.app",
      "https://seattle-skyline-limo-admin.netlify.app",
      "http://localhost",
      "127.0.0.1"
    ],
  })
);
app.use(cookieParser());
app.use(passport.initialize({}));
app.use(router);
// app.use(rateLimit());
app.listen(4000, () => {
  console.log("Server started on port 4000");
  // Start pinging the server at the specified interval
  setInterval(keepServerAlive, interval);
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
