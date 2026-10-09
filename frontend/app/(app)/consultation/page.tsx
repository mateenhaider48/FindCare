import type { Metadata } from "next";
import PageHeader from "@/components/app/PageHeader";
import ConsultationStart from "@/components/app/ConsultationStart";

export const metadata: Metadata = { title: "Consultation" };

export default async function ConsultationPage({ searchParams }: { searchParams: Promise<{ doctor?: string }> }) {
  const { doctor } = await searchParams;
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-8">
      <PageHeader
        title="Start a consultation"
        subtitle="Describe how you feel in your own words. Your AI junior doctor asks follow-ups, checks for red flags and brings in a specialist when needed."
      />
      <ConsultationStart doctorKey={doctor} />
    </div>
  );
}
