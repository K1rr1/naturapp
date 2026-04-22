import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { addUser, findUserByUsername } from "../data/store";

const router = Router();

type LoginBody = {
  username?: string;
  password?: string;
};

type RegisterBody = {
  username?: string;
  password?: string;
};

function createToken(user: { id: string; username: string }) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET saknas i backend .env.");
  }

  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      
    },
    secret,
    { expiresIn: "1h" }
  );
}

router.post("/login", (req: Request, res: Response) => {
  const { username: rawUsername, password } = req.body as LoginBody;
  const username = rawUsername?.trim();

  if (!username || !password) {
    return res.status(400).json({
      message: "Användarnamn och lösenord krävs.",
    });
  }

  const user = findUserByUsername(username);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
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
      name: user.username,
      mode: "user",
    },
  });
});

router.post("/register", (req: Request, res: Response) => {
  const { username: rawUsername, password } = req.body as RegisterBody;
  const username = rawUsername?.trim();

  if (!username || !password) {
    return res.status(400).json({
      message: "Användarnamn och lösenord krävs.",
    });
  }

  const usernameExists = Boolean(findUserByUsername(username));

  if (usernameExists) {
    return res.status(409).json({
      message: "Användarnamnet är redan taget.",
    });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    username,
    passwordHash: bcrypt.hashSync(password, 10),
  };

  addUser(newUser);

  const token = createToken(newUser);

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.username,
      mode: "user",
    },
  });
});

export default router;