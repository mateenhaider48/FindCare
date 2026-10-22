import type { Metadata } from "next";
import PageHeader from "@/components/app/PageHeader";
import HistoryList from "@/components/history/HistoryList";
import { apiGet, type Conversation } from "@/lib/api";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage() {
  const conversations = (await apiGet<Conversation[]>("/api/conversations")) ?? [];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-8">
      <PageHeader title="Consultation history" subtitle="Open any consultation to see the full conversation. Share it with your own doctor if you like." />
      <HistoryList conversations={conversations} />
    </div>
  );
}
