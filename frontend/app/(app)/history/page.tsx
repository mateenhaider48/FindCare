import type { Metadata } from "next";
import PageHeader from "@/components/app/PageHeader";
import HistoryList from "@/components/history/HistoryList";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-8">
      <PageHeader title="Consultation history" subtitle="Open any consultation to see the full summary, medicine and advice. Share it with your own doctor if you like." />
      <HistoryList />
    </div>
  );
}
