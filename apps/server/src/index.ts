import { auth } from "@veterinary-app/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import sessionRoutes from "./routes/session.routes";
import chatRoutes from "./routes/chat.routes";
import appointmentRoutes from "./routes/appointment.routes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3001", "https://veterinary-app-admin.vercel.app", "https://veterinary-app-widget.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", toNodeHandler(auth));

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/api/session", sessionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
