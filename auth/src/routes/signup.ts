import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { BadRequestError } from "@maanas.backend/commons";
import { validateRequest } from "@maanas.backend/commons";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new BadRequestError("Email already registered", email);
    }

    const newUser = User.build({ email, password });

    // implementing the hash with prehook eliminates redundancy. If there was a page to change pass, we would have to do the conversion there also
    await newUser.save();

    const accessKey = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!,
      {
        expiresIn: "15m",
      }
    );

    req.session = {
      jwt: accessKey,
    };

    res.status(201).json(newUser.toJSON());
  }
);

export { router as signupRouter };
