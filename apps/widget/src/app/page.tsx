import React from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const veterinaryClinicId = params?.["veterinary-clinic-id"] as string | undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Veterinary Chatbot Widget</h1>
        {veterinaryClinicId ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Veterinary Clinic ID:</p>
            <p className="text-lg font-mono bg-gray-100 px-4 py-2 rounded border">
              {veterinaryClinicId}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No veterinary clinic ID provided</p>
        )}
      </div>
    </div>
  );
};

export default Page;
