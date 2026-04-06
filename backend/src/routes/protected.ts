import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user;

  res.json({
    message: "Du är autentiserad",
    user,
  });
});

export default router;