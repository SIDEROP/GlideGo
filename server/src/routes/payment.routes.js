import { Router } from "express";
import {
  createPayment,
  updatePaymentStatus,
  getPaymentDetails,
} from "../controllers/payment.contr.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createPayment);
router.put("/:paymentId", authMiddleware, updatePaymentStatus);
router.get("/:paymentId", authMiddleware, getPaymentDetails);

export default router;