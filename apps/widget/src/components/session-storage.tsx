"use client";

import { useEffect } from "react";

interface SessionStorageProps {
  sessionId: string;
  clinicId: string;
  userId?: string;
}

const SESSION_STORAGE_KEY = (clinicId: string) => `vet_chatbot_session_${clinicId}`;

export function SessionStorage({ sessionId, clinicId, userId }: SessionStorageProps) {
  useEffect(() => {
    const sessionData = {
      sessionId,
      clinicId,
      userId: userId || "",
    };
    
    localStorage.setItem(SESSION_STORAGE_KEY(clinicId), JSON.stringify(sessionData));
  }, [sessionId, clinicId, userId]);

  return null;
}
