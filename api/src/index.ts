import dotenv from "dotenv";
import express from "express";
import type { Request, Response, Application } from "express";
import { squareRouter } from "./routes/square.ts";

dotenv.config();

const port = 3000;
const app: Application = express();

app.use("/square", squareRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
