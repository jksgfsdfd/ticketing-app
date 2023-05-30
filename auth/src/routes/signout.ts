import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/users/signout", async (req: Request, res: Response) => {
  req.session = undefined;

  res.status(200).json({});
});

export { router as signoutRouter };
