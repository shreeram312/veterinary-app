import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AuthWrap from "@/components/auth-wrap";  

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <AuthWrap>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-6 max-w-full">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthWrap>
  );
}
