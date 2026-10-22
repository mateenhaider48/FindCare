import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConsultationTranscript from "@/components/history/ConsultationTranscript";
import { apiGet, type Conversation, type Message } from "@/lib/api";

export const metadata: Metadata = { title: "Consultation summary" };

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [messages, conversations] = await Promise.all([
    apiGet<Message[]>(`/api/conversations/${id}/messages`),
    apiGet<Conversation[]>("/api/conversations"),
  ]);

  // The messages endpoint 404s for an id that is not this user's.
  if (messages === null) notFound();

  const conversation = conversations?.find((c) => String(c.id) === id) ?? null;

  return (
    <ConsultationTranscript
      title={conversation?.title ?? "Consultation"}
      date={conversation?.created_at ?? messages[0]?.created_at ?? null}
      messages={messages}
    />
  );
}
