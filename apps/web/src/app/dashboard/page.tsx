"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Users, Code } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { env } from "@veterinary-app/env/web";
import { CodeBlock, CodeBlockBody, CodeBlockContent, CodeBlockCopyButton, CodeBlockFilename, CodeBlockFiles, CodeBlockHeader, CodeBlockItem } from "@/components/code-block";

const WIDGET_URL = process.env.NEXT_PUBLIC_WIDGET_URL;

interface DashboardStats {
  totalSessions: number;
  totalAppointments: number;
}

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const [stats, setStats] = useState<DashboardStats>({ totalSessions: 0, totalAppointments: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.id) return;

      try {
        setStatsLoading(true);
        const response = await fetch(
          `${env.NEXT_PUBLIC_SERVER_URL}/api/appointments/stats?clinicId=${session.user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchStats();
    }
  }, [session?.user?.id]);

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


  const copyToClipboard = () => {
    navigator.clipboard.writeText(bubbleCode[0].code);
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Appointments</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {statsLoading ? "..." : stats.totalAppointments.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">All time appointments</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <Calendar className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {statsLoading ? "..." : stats.totalSessions.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">All chatbot sessions</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden max-w-full w-full">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Embed Chatbot</h2>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
            v1.0.2 Stable
          </span>
        </div>
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-hidden max-w-full w-full">
          <div className="space-y-2 min-w-0">
            <h3 className="text-sm font-medium text-foreground">Bubble Widget</h3>
            <Snippet code={bubbleCode} />
          </div>
          
        </div>
      </div>
    </div>
  );
}


const Snippet = ({
  code,
}: {
  code: { language: string; filename: string; code: string }[];
}) => {
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <CodeBlock
        data={code}
        defaultValue={code[0].language}
        className="h-fit w-full min-w-0 max-w-full [&>div]:min-w-0 [&>div]:max-w-full [&_pre]:overflow-x-auto [&_pre]:text-[11px] [&_pre]:leading-tight [&_pre]:max-h-16 [&_pre]:min-w-0 [&_pre]:max-w-full [&_pre]:py-2 [&_code]:max-w-full [&_code]:min-w-0 [&_code]:break-all [&_code]:whitespace-pre [&_.shiki]:max-w-full [&_.shiki]:min-w-0 [&_.line]:break-all [&_.line]:whitespace-pre"
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
            <CodeBlockContent language={item.language as any}>
              {item.code}
            </CodeBlockContent>
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
    </div>
  );
};