import React from "react";
import { SessionStorage } from "@/components/session-storage";
import { StartNewSessionButton } from "@/components/start-new-session-button";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ChatPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ChatPage = async ({ searchParams }: ChatPageProps) => {
  const params = await searchParams;
  const sessionId = params?.sessionId as string | undefined;
  const clinicId = params?.clinicId as string | undefined;

  if (!sessionId || !clinicId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-bold">Session Not Found</h1>
          <p className="text-muted-foreground">
            Please start a new session from the main page.
          </p>
          <Link href="/">
            <Button variant="outline">Back to Main Page</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SessionStorage sessionId={sessionId} clinicId={clinicId} />
      <div className="flex flex-col h-screen">
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full px-4 py-4">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Veterinary Chat
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Session: {sessionId.slice(0, 8)}...
              </p>
            </div>
            <StartNewSessionButton clinicId={clinicId} />
          </div>
          <div className="flex-1 min-h-0">
            <ChatInterface sessionId={sessionId} clinicId={clinicId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
