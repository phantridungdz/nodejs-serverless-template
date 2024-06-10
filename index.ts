import express from "express";
import productRouter from "./api/product";

const app = express();

app.use("/api/product", productRouter);

export default app;
