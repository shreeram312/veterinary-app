"use client";
import { redirect } from "next/navigation";
import { Code, Copy } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const WIDGET_URL = process.env.NEXT_PUBLIC_WIDGET_URL;

export default function IntegrationPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  const embedCode = `<!-- VetChat SDK Configuration (Optional) -->
<script>
  window.VetChatbotConfig = {
    userId: "USER_ID_HERE",
    userName: "USER_NAME", // Optional
    petName: "PET_NAME"    // Optional
  };
</script>

<!-- VetChat Widget Loader -->
<script src="${WIDGET_URL}/chatbot.js" veterinary-clinic-id="${session?.user?.id}" async></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Embed Chatbot</h2>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
            v1.0.2 Stable
          </span>
        </div>
        <div className="p-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Copy and paste this code snippet into the &lt;head&gt; or just before the closing &lt;/body&gt; tag of your website.
          </p>
          <div className="relative rounded-lg bg-slate-900 p-4">
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-4 rounded-md bg-white hover:bg-gray-100"
              onClick={copyToClipboard}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <pre className="overflow-x-auto pr-20 text-sm">
              <code className="text-slate-300 whitespace-pre">{embedCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
