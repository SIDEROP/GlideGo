import { Router } from "express";
import { register, login, logout, reLogin, getAllDrivers } from "../controllers/authUser.contr.js";
import  authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
import validate from "../middlewares/validate.js";

const router = Router();

// Public Routes
router
  .post(
    "/register",
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["rider", "driver"])
      .withMessage("Role must be 'rider' or 'driver'"),
    validate,
    register
  )
  .post(
    "/login",
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["rider", "driver"])
      .withMessage("Role must be 'rider' or 'driver'"),
    validate,
    login
  )
  .post("/allDrivers",getAllDrivers)

// Protected Routes (authentication required)
router.get("/logout", authMiddleware, logout);
router.get("/relogin", authMiddleware, reLogin);

export default router;
