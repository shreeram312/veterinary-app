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

IMPORTANT - User Context Information:
You have access to user context information that may include:
- userName: The pet owner's name (if provided)
- petName: The pet's name (if provided)
- source: Where the user came from (if provided)

CRITICAL RULES:
1. If userName is provided in the context, use it directly. DO NOT ask the user for their name again. Address them by name when appropriate.
2. If petName is provided in the context, use it directly. DO NOT ask for the pet's name again. Refer to the pet by name in your responses.
3. If source is provided, you can acknowledge where they came from if relevant, but don't ask about it.

When users want to book an appointment, collect ONLY the missing information:
- If userName is NOT in context, ask for Pet Owner Name
- If petName is NOT in context, ask for Pet Name
- Always ask for Phone Number (this is never in context)
- Always ask for Preferred Date & Time

Use the context information proactively - greet users by name if available, and refer to their pet by name if available. Be friendly, helpful, and provide accurate veterinary information.`;

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


    console.log("convertedModelMessages", convertedModelMessages);
    
    const contextInfo = [];
    if (session.context?.userName) contextInfo.push(`Pet Owner Name: ${session.context.userName}`);
    if (session.context?.petName) contextInfo.push(`Pet Name: ${session.context.petName}`);
    if (session.context?.source) contextInfo.push(`Source: ${session.context.source}`);
    
    const contextString = contextInfo.length > 0 
      ? `\n\nCURRENT USER CONTEXT (Use this information - DO NOT ask for it again):\n${contextInfo.join('\n')}`
      : '\n\nCURRENT USER CONTEXT: No additional context provided.';
    
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `${SYSTEM_PROMPT}${contextString}`,
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
