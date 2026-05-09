import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/account/user.routes.js";
import memberRoutes from "./modules/member/member.routes.js";
import lifeGroupRoutes from "./modules/lifegroup/lifegroup.routes.js";
import ministryRoutes from "./modules/ministry/ministry.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";
import lgAttendanceRoutes from "./modules/lifegroup/lifegroupAttendance.routes.js";

import contributionRoutes from "./modules/finance/contribution.routes.js";
import expenseRoutes from "./modules/finance/expense.routes.js";
import worshipServiceRoutes from "./modules/worship/worshipService.routes.js";

// test route
import productRoute from "./modules/product/product.route.js";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/lifegroups", lifeGroupRoutes);
app.use("/api/ministries", ministryRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use("/api/lifegroup-attendance", lgAttendanceRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/service", worshipServiceRoutes);

app.use("/api/products", productRoute);

//test route
app.get("/", (req, res) => {
  res.send("Hello, from node API Server in react!");
});

// Database connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running`);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
};

startServer();
