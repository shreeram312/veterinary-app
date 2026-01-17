"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface ChatInterfaceProps {
  sessionId: string;
  clinicId: string;
}

export function ChatInterface({ sessionId, clinicId }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  
  if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    console.warn("NEXT_PUBLIC_SERVER_URL is not set, using default: http://localhost:3000");
  }

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: `${apiUrl}/api/chat`,
      body: {
        sessionId,
        clinicId,
      },
      credentials: "include",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready") return;

    const userInput = input.trim();
    setInput("");
    sendMessage({ text: userInput });
  };

  const getMessageContent = (message: typeof messages[0]) => {
    if (message.parts && message.parts.length > 0) {
      return message.parts
        .filter((part): part is { type: "text"; text: string } => part.type === "text")
        .map((part) => part.text)
        .join("");
    }
    return "";
  };

  return (
    <div className="flex flex-col h-full border border-border rounded-lg bg-card overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted text-foreground">
              <p className="text-sm whitespace-pre-wrap">
                Hello! I&apos;m your veterinary assistant. How can I help you and your pet today?
              </p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{getMessageContent(message)}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-lg px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <div className="bg-destructive/10 text-destructive rounded-lg px-4 py-2">
              <p className="text-sm">Sorry, something went wrong. Please try again.</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-border p-4 bg-background shrink-0"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your pet's health..."
            className="flex-1 h-11 rounded-lg border-border bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
            disabled={status !== "ready"}
          />
          <Button
            type="submit"
            disabled={!input.trim() || status !== "ready"}
            className="h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
