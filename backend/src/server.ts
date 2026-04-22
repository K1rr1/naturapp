import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import protectedRouter from "./routes/protected";
import reportsRouter from "./routes/reports";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
console.log("CORS frontendUrl:", frontendUrl);

app.use(
  cors({
    origin: [frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"],
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/dev", authRouter);
app.use("/dev", protectedRouter);
app.use("/dev", reportsRouter);

app.listen(port, () => {
  console.log(`Backend körs på http://localhost:${port}`);
});