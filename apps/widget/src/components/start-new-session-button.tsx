"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface StartNewSessionButtonProps {
  clinicId: string;
}

const SESSION_STORAGE_KEY = (clinicId: string) => `vet_chatbot_session_${clinicId}`;

export function StartNewSessionButton({ clinicId }: StartNewSessionButtonProps) {
  const router = useRouter();

  const handleStartNewSession = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY(clinicId));
    router.push(`/?veterinary-clinic-id=${clinicId}`);
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleStartNewSession}
      className="rounded-lg border-border text-foreground hover:bg-muted"
    >
      Start New Session
    </Button>
  );
}
