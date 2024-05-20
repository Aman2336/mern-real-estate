import express from "express";
import { createlisting } from "../controller/listing.controller.js";
import { verifyuser } from "../utils/verifyuser.js";
import {
  deletelisting,
  updatelisting,
  getlisting,
  getlistings
} from "../controller/listing.controller.js";
const router = express.Router();

router.post("/create", verifyuser, createlisting);
router.delete("/delete/:id", verifyuser, deletelisting);
router.post("/update/:id", verifyuser, updatelisting);
router.get('/get/:id',getlisting);
router.get('/get',getlistings);
export default router;
