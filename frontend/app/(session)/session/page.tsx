import type { Metadata } from "next";
import { cookies } from "next/headers";
import SessionScreen, { type SessionDoctor } from "@/components/session/SessionScreen";
import { DOCTORS } from "@/components/landing/data";
import { JUNIOR_DOCTOR } from "@/lib/consultations";
import { adminAuth } from "@/lib/firebase-admin";
import { redirect } from "next/dist/client/components/navigation";


export const metadata: Metadata = { title: "Consultation in progress" };

/** Full-screen live consultation (no app sidebar). */
export default async function SessionPage({ searchParams }: { searchParams: Promise<{ doctor?: string; q?: string }> }) {
  const { doctor: key, q } = await searchParams;
  const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("fc_session")?.value;
  
    if (!sessionCookie) {
      redirect("/login");
    }
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    );
  const patient = decodedClaims.name || "Patient"  
  const specialist = DOCTORS.find((d) => d.key === key);
  const doctor: SessionDoctor = specialist
    ? { name: specialist.name, short: specialist.name, role: `${specialist.field} · AI specialist`, field: specialist.field, avatar: specialist.avatar }
    : { name: JUNIOR_DOCTOR.name, short: JUNIOR_DOCTOR.short, role: JUNIOR_DOCTOR.role, field: "General Physician", avatar: JUNIOR_DOCTOR.avatar };

  // Server component, rendered once per request: the session starts now.
  // eslint-disable-next-line react-hooks/purity
  const startedAt = Date.now();
  return <SessionScreen doctor={doctor} patient={patient} opening={q} startedAt={startedAt} />;
}
