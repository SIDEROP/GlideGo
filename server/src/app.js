import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

let app = express();

// use midlwares
app
  .use(express.json({ limit: "20kb" }))
  .use(express.urlencoded({ limit: "20kb", extended: true }))
  .use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "X-CSRF-Token",
      ],
      credentials: true,
    })
  )
  .use(cookieParser())
  .use(express.static("dist"))

// import routes 
import authUserRouter from "./routes/authUser.routes.js"
import rideRouter from "./routes/ride.routes.js"
import paymentRouter from "./routes/payment.routes.js"

// use routes middlewares
app.use("/api/v1",authUserRouter)
app.use("/api/v1",rideRouter)
app.use("/api/v1",paymentRouter)


export default app