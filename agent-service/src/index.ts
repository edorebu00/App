import "dotenv/config";
import cors from "cors";
import express from "express";
import { searchRouter } from "./routes/search";
import { chatRouter } from "./routes/chat";
import { documentsRouter } from "./routes/documents";

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: process.env.WEB_APP_ORIGIN || "*",
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/search", searchRouter);
app.use("/api/chat", chatRouter);
app.use("/api/documents", documentsRouter);

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`My Vehicle agent-service in ascolto sulla porta ${port}`);
});
