import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";

import { ActivityLogTable } from "./activity-log";

export const metadata = {
  title: "BuzzDaddy Overview",
  description: "Manage account and website settings.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Activity Log"
        text="Consolidated view of all BuzzDaddy activity."
      ></DashboardHeader>
      <div className="grid gap-10">
        <ActivityLogTable />
      </div>
    </DashboardShell>
  );
}