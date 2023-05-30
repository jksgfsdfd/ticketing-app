import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { validateRequest } from "@maanas.backend/commons";
import { Password } from "../services/password";
import { BadRequestError } from "@maanas.backend/commons";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").trim().isLength({ min: 4, max: 20 }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid Credentials");
    }
    if (!(await Password.compare(password, user.password))) {
      throw new BadRequestError("Invalid Credentials");
    }

    const jwtKey = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
      {
        expiresIn: "15m",
      }
    );

    req.session = {
      jwt: jwtKey,
    };

    res.status(200).json(user.toJSON());
  }
);

export { router as signinRouter };
