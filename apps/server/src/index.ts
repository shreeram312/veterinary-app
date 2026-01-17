import { auth } from "@veterinary-app/auth";
import { VetChatbotSession } from "@veterinary-app/db/models";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(
 cors({
  origin:["http://localhost:3002"],
  credentials:true
 })
);

app.use(express.json());

app.use("/api/auth", toNodeHandler(auth));

app.post("/api/session/create", async (req, res) => {
  try {
    const { clinicId, userName, petName, source } = req.body;


    if (!clinicId) {
      res.status(400).json({ error: "Clinic ID is required" });
      return;
    }

    const sessionId = uuidv4();
    const userId = uuidv4();

    const session = new VetChatbotSession({
      _id: uuidv4(),
      sessionId,
      clinicId,
      context: {
        userId,
        userName: userName || "",
        petName: petName || "",
        source: source || "",
      },
    });

    await session.save();

    console.log("Created User Successfully");

    res.status(201).json({
      sessionId,
      userId,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
});

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
