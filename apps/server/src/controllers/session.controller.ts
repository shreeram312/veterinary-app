import { VetChatbotSession } from "@veterinary-app/db/models";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const createSession = async (req: Request, res: Response) => {
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
};
