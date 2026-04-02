import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/dev", authRouter);

app.listen(port, () => {
  console.log(`Backend körs på http://localhost:${port}`);
});