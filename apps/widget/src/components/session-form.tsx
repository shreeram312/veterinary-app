"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface SessionFormProps {
  clinicId: string;
}

interface StoredSession {
  sessionId: string;
  clinicId: string;
  userId: string;
}

const SESSION_STORAGE_KEY = (clinicId: string) => `vet_chatbot_session_${clinicId}`;

export function SessionForm({ clinicId }: SessionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    petName: "",
    source: "",
  });

  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY(clinicId));
    if (storedSession) {
      try {
        const session: StoredSession = JSON.parse(storedSession);
        if (session.sessionId && session.clinicId === clinicId) {
          setHasExistingSession(true);
          router.push(`/chat?sessionId=${session.sessionId}&clinicId=${clinicId}`);
          return;
        }
      } catch (error) {
        console.error("Error parsing stored session:", error);
        localStorage.removeItem(SESSION_STORAGE_KEY(clinicId));
      }
    }
    setIsLoading(false);
  }, [clinicId, router]);

  const handleStartNewSession = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY(clinicId));
    setFormData({
      userName: "",
      petName: "",
      source: "",
    });
    setHasExistingSession(false);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/session/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          credentials:"include",
          
          body: JSON.stringify({
            clinicId,
            userName: formData.userName,
            petName: formData.petName,
            source: formData.source,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const data = await response.json();
      
      const sessionData: StoredSession = {
        sessionId: data.sessionId,
        clinicId,
        userId: data.userId,
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY(clinicId), JSON.stringify(sessionData));
      
      router.push(`/chat?sessionId=${data.sessionId}&clinicId=${clinicId}`);
    } catch (error) {
      console.error("Error creating session:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
        Welcome to Vet Chat
      </h2>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Provide your details to start chatting (all fields optional)
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="userName" className="text-foreground font-medium">
            Your Name
          </Label>
          <Input
            id="userName"
            className="h-11 rounded-lg border-border bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
            placeholder="John Doe (optional)"
            value={formData.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="petName" className="text-foreground font-medium">
            Pet Name
          </Label>
          <Input
            id="petName"
            className="h-11 rounded-lg border-border bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
            placeholder="Buddy (optional)"
            value={formData.petName}
            onChange={(e) =>
              setFormData({ ...formData, petName: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="source" className="text-foreground font-medium">
            How did you find us?
          </Label>
          <Input
            id="source"
            className="h-11 rounded-lg border-border bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
            placeholder="e.g., Website, Referral, Social Media"
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Chat"}
        </Button>
      </form>
    </div>
  );
}
