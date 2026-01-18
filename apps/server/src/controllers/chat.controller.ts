import { VetChatbotSession, Message } from "@veterinary-app/db/models";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { createBookAppointmentTool } from "../lib/appointment-tool";
import { SYSTEM_PROMPT } from "../constants/prompts";

export const chat = async (req: Request, res: Response) => {
  try {
    const { messages, sessionId }: { messages: UIMessage[]; sessionId: string } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: "Session ID is required" });
      return;
    }

    const session = await VetChatbotSession.findOne({ sessionId });
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const convertedModelMessages = await convertToModelMessages(messages);

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

    const now = new Date();
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const currentTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const contextInfo = [];
    if (session.context?.userName) contextInfo.push(`Pet Owner Name: ${session.context.userName}`);
    if (session.context?.petName) contextInfo.push(`Pet Name: ${session.context.petName}`);
    if (session.context?.source) contextInfo.push(`Source: ${session.context.source}`);

    const contextString =
      contextInfo.length > 0
        ? `\n\nCURRENT USER CONTEXT (Use this information - DO NOT ask for it again):\n${contextInfo.join("\n")}`
        : "\n\nCURRENT USER CONTEXT: No additional context provided.";

    const dateTimeInfo = `\n\nCURRENT DATE AND TIME:\nToday is ${currentDate}. The current time is ${currentTime}. Use this information to calculate tomorrow's date, day after tomorrow's date, or any relative dates when users ask for appointment scheduling.`;

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `${SYSTEM_PROMPT}${dateTimeInfo}${contextString}`,
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
      stopWhen: stepCountIs(3),
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const messages = await Message.find({ chatId: sessionId }).sort({ createdAt: 1 }).lean();

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
};
