"use client"
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockFiles,
  CodeBlockFilename,
  CodeBlockCopyButton,
  CodeBlockBody,
  CodeBlockItem,
  CodeBlockContent,
} from "@/components/code-block";

const WIDGET_URL = process.env.NEXT_PUBLIC_WIDGET_URL;

export default  function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();   

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  const bubbleCode: { language: string; filename: string; code: string }[] = [
    {
      language: "html",
      filename: "bubble-widget.html",
      code: `<script src="${WIDGET_URL}/chatbot.js" veterinary-clinic-id=${session?.user?.id} async></script>`,
    },
  ];
  
  const sectionCode: { language: string; filename: string; code: string }[] = [
    {
      language: "html",
      filename: "section-widget.html",
      code: `<script src="${WIDGET_URL}/chatbot.js" data-type="section" veterinary-clinic-id=${session?.user?.id}></script>`,
    },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user?.name || "Guest"    }</p>

      <Snippet code={bubbleCode} />   
      <Snippet code={sectionCode}       />   
    </div>
  );
}

const Snippet = ({
  code,
}: {
  code: { language: string; filename: string; code: string }[];
}) => {
  return (
    <CodeBlock
      data={code}
      defaultValue={code[0].language}
      className="h-fit w-full smooth-scrollbar [&_pre]:!overflow-x-auto [&_pre]:!text-sm [&_pre]:!max-h-32"
    >
      <CodeBlockHeader>
        <CodeBlockFiles>
          {(item) => (
            <CodeBlockFilename key={item.language} value={item.language}>
              {item.filename}
            </CodeBlockFilename>
          )}
        </CodeBlockFiles>
        <CodeBlockCopyButton
          onCopy={() => console.log("Copied code to clipboard")}
          onError={() => console.error("Failed to copy code to clipboard")}
        />
      </CodeBlockHeader>
      <CodeBlockBody>
        {(item) => (
          <CodeBlockItem key={item.language} value={item.language}>

            {/* @ts-expect-error - we know this is a string */}
            <CodeBlockContent language={item.language as Language}>
              {item.code}
            </CodeBlockContent>
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  );
};
