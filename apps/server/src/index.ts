import { openai } from "@ai-sdk/openai";
import { auth } from "@veterinary-app/auth";
import { VetChatbotSession, Message } from "@veterinary-app/db/models";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createBookAppointmentTool } from "./lib/appointment-tool";
const app = express();

app.use(
 cors({
  origin:["http://localhost:3002","http://localhost:3001"],
  credentials:true
 })
);

app.use(express.json());

app.use("/api/auth", toNodeHandler(auth));

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});



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



const SYSTEM_PROMPT = `You are a helpful veterinary assistant chatbot. You can only answer questions related to:
- Pet care and health
- Vaccination schedules
- Diet and nutrition for pets
- Common pet illnesses and symptoms
- Preventive care for pets
- General veterinary advice

If a user asks about anything unrelated to veterinary topics, politely explain that you can only help with pet and veterinary-related questions.

When users want to book an appointment, collect the following information one at a time:
1. Pet Owner Name
2. Pet Name  
3. Phone Number
4. Preferred Date & Time

Be friendly, helpful, and provide accurate veterinary information.`;

app.post("/api/chat", async (req: any, res: any) => {
 
  try {
  
    const { messages, sessionId } : { messages: UIMessage[], sessionId: string } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: "Session ID is required" });
      return;
    }

    const session = await VetChatbotSession.findOne({ sessionId });
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const convertedModelMessages = await convertToModelMessages(messages)
    
    const modelMessage = new Message({
      _id: uuidv4(),
      id: uuidv4(),
      chatId: sessionId,
      role: "user",
      parts: messages,
    });
    await modelMessage.save();

    const bookAppointmentTool = createBookAppointmentTool(sessionId);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `${SYSTEM_PROMPT} here is user more information: ${JSON.stringify(session.context)}`,
      messages: convertedModelMessages,
      tools: {
        bookAppointment: bookAppointmentTool,
      },
      onFinish: async ({ text }) => {
        const assistantMsg = new Message({
          _id: uuidv4(),
          id: uuidv4(),
          chatId: sessionId,
          role: "assistant",
          parts: text,
        });
        await assistantMsg.save();
      },
        stopWhen:stepCountIs(3),
    });



    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

app.get("/api/chat/history/:sessionId", async (req: any, res: any) => {
  try {
    const { sessionId } = req.params;

    const messages = await Message.find({ chatId: sessionId })
      .sort({ createdAt: 1 })
      .lean();

    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      role: msg.role,
      content: msg.parts,
      createdAt: msg.createdAt,
    }));

    res.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
