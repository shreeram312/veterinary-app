import React from "react";
import { SessionForm } from "@/components/session-form";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const clinicId = params?.["veterinary-clinic-id"] as string | undefined;

  if (!clinicId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-bold">Invalid Access</h1>
          <p className="text-muted-foreground">
            No veterinary clinic ID provided. Please use a valid link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <SessionForm clinicId={clinicId} />
    </div>
  );
};

export default Page;
