import express from "express";
import { loginUser,insertUser,Userdata } from "../controllers/UserController.js";
import { authmiddleware } from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/login",loginUser);

router.post("/insert",insertUser);

router.get("/user",authmiddleware,Userdata);

export default router;