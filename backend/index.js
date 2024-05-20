import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.routes.js"
import path from "path";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("success");
  })
  .catch((err) => {
    console.log(err);
  });

const _dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("server is running at port 3000");
});

app.use("/backend/user", userRouter);
app.use("/backend/auth", authRouter);
app.use("/backend/listing", listingRouter);//this is for creating listings that user can add or we can explicitly add in our db

app.use(express.static(path.join(_dirname,'/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, 'frontend', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "internal server error";
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});
