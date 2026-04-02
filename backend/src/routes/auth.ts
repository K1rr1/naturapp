import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { users } from "../data/users";

const router = Router();

type LoginBody = {
  username?: string;
  password?: string;
};

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body as LoginBody;

  if (!username || !password) {
    return res.status(400).json({
      message: "Användarnamn och lösenord krävs.",
    });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Fel användarnamn eller lösenord.",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "JWT_SECRET saknas i backend .env.",
    });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username,
      name: user.name,
    },
    secret,
    { expiresIn: "1h" }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      mode: "user",
    },
  });
});

export default router;