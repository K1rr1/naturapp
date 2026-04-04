import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { users } from "../data/users";

const router = Router();

type LoginBody = {
  username?: string;
  password?: string;
};

type RegisterBody = {
  username?: string;
  password?: string;
  name?: string;
};

function createToken(user: { id: string; username: string; name: string }) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET saknas i backend .env.");
  }

  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      name: user.name,
    },
    secret,
    { expiresIn: "1h" }
  );
}

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

  const token = createToken(user);

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

router.post("/register", (req: Request, res: Response) => {
  const { username, password, name } = req.body as RegisterBody;

  if (!username || !password || !name) {
    return res.status(400).json({
      message: "Namn, användarnamn och lösenord krävs.",
    });
  }

  const usernameExists = users.some((u) => u.username === username);

  if (usernameExists) {
    return res.status(409).json({
      message: "Användarnamnet är redan taget.",
    });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    username,
    password,
    name,
  };

  users.push(newUser);

  const token = createToken(newUser);

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      mode: "user",
    },
  });
});

export default router;