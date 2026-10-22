import type { Metadata } from "next";
import SessionScreen, { type SessionDoctor } from "@/components/session/SessionScreen";
import { DOCTORS } from "@/components/landing/data";
import { JUNIOR_DOCTOR } from "@/lib/consultations";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Consultation in progress" };

/** Full-screen live consultation (no app sidebar). */
export default async function SessionPage({ searchParams }: { searchParams: Promise<{ doctor?: string; q?: string; c?: string }> }) {
  const { doctor: key, q, c } = await searchParams;
  const { name: patient } = await requireUser();
  const conversationId = c && /^\d+$/.test(c) ? Number(c) : undefined;
  const specialist = DOCTORS.find((d) => d.key === key);
  const doctor: SessionDoctor = specialist
    ? { name: specialist.name, short: specialist.name, role: `${specialist.field} · AI specialist`, field: specialist.field, avatar: specialist.avatar }
    : { name: JUNIOR_DOCTOR.name, short: JUNIOR_DOCTOR.short, role: JUNIOR_DOCTOR.role, field: "General Physician", avatar: JUNIOR_DOCTOR.avatar };

  // Server component, rendered once per request: the session starts now.
  // eslint-disable-next-line react-hooks/purity
  const startedAt = Date.now();
  return <SessionScreen doctor={doctor} patient={patient} opening={q} startedAt={startedAt} conversationId={conversationId} />;
}
