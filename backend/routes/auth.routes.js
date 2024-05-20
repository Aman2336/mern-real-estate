import express from "express";
import { google, signup, signout } from "../controller/auth.controller.js";
import { login } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", google);
router.get("/signout", signout);
export default router;
