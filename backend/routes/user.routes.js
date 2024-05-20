import express from "express";
import { test } from "../controller/user.controller.js";
import { updateuser, deleteuser,getuser } from "../controller/user.controller.js";
import { verifyuser } from "../utils/verifyuser.js";
import { getuserlistings } from "../controller/user.controller.js";
const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyuser, updateuser);
router.delete("/delete/:id", verifyuser, deleteuser);
router.get("/listings/:id", verifyuser, getuserlistings);
router.get("/:id", verifyuser, getuser);
export default router;
