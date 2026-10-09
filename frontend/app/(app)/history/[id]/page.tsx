import type { Metadata } from "next";
import ConsultationSummary from "@/components/history/ConsultationSummary";

export const metadata: Metadata = { title: "Consultation summary" };

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConsultationSummary id={id} />;
}
