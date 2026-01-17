import React from "react";
import { SessionStorage } from "@/components/session-storage";
import { StartNewSessionButton } from "@/components/start-new-session-button";
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl space-y-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold">Veterinary Chat</h1>
              <StartNewSessionButton clinicId={clinicId} />
            </div>
            <p className="text-sm text-muted-foreground">
              Session: {sessionId.slice(0, 8)}...
            </p>
          </div>
          <div className="border rounded-lg p-4 min-h-[400px] bg-card">
            <p className="text-muted-foreground text-center">
              Chat interface will be implemented here
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
