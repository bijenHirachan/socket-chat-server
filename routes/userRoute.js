import express from "express";
import {
  login,
  logout,
  register,
  allUsers,
  getMyProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/users").get(isAuthenticated, allUsers);

router.route("/logout").get(isAuthenticated, logout);
router.route("/me").get(isAuthenticated, getMyProfile);

router.route("/register").post(register);
router.route("/login").post(login);

export default router;
