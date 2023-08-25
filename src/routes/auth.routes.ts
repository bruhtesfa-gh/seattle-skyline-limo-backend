import { Router } from "express";
import passport from "passport";
import { generateToken } from "../util/token";
import { User } from "../config/db";
import { hashPassword, passwordCompare } from "../util/auth";
const router = Router();

router.post("/register", async function (req, res, next) {
  // register new user
  const { email, password, firstName, lastName, img } = req.body;
  console.log(req.body);
  try {
    if (!email || !password || !firstName || !lastName || !img) {
      return res.status(400).send({
        data: {
          message: "all fields are required",
        },
      });
    }
    let existingUser = await User.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).send({
        data: {
          message: "user already exists",
        },
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        img,
      },
    });
    if (!user) {
      return res.status(500).send({
        data: {
          message: "something went wrong",
        },
      });
    }
    const token = await generateToken(user);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "none",
      })
      .send({
        data: {
          message: "succeeessfuly registered",
          user,
          token,
        },
      });
  } catch (err: any) {
    return res.status(500).send({
      data: {
        message: err.message,
      },
    });
  }
});


router.post(
  "/login",
  passport.authenticate("local", {
    session: false,
  }),
  async function (req, res) {
    const token = await generateToken(req.user as User);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "none",
      })
      .send({
        data: {
          token,
          message: "succeeessfuly loggedIn",
        },
      });
  }
);
router.post("/logout", async function (req, res) {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .send({
      data: {
        message: "succeeessfuly loggedIn",
      },
    });
});

export default router;
