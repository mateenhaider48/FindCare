// Consultation types and shared config (urgency labels, red-flag keywords,
// the junior doctor, date formatting). Real records come from the backend.

export type Urgency = "self-care" | "see-gp" | "review" | "urgent";

export type Medicine = { name: string; dose: string; often: string; duration: string };

export type Consultation = {
  id: string;
  /** ISO date of the session. */
  date: string;
  start: string;
  end: string;
  doctor: string;
  field: string;
  concern: string;
  urgency: Urgency;
  told: string[];
  negatives?: string;
  assessment: string;
  prescription: Medicine[];
  prescriptionNote?: string;
  advice: string[];
  emergency: string;
  review?: { by: string; role: string; phone: string; expectedBy: string; inMinutes: number };
};

export const URGENCY: Record<Urgency, { label: string; className: string; dot: string }> = {
  "self-care": { label: "Self-care", className: "bg-success-soft text-success", dot: "bg-success" },
  "see-gp": { label: "See a GP", className: "bg-warning-soft text-warning", dot: "bg-warning" },
  review: { label: "Needs review", className: "bg-[#fff1df] text-[#a86200]", dot: "bg-[#e08a1e]" },
  urgent: { label: "Urgent", className: "bg-danger-soft text-danger", dot: "bg-danger" },
};

export const RED_FLAGS = ["chest pain", "can't breathe", "cannot breathe", "shortness of breath", "breathless", "fainted", "unconscious", "severe bleeding", "stroke", "suicid", "seizure", "drooling", "can't swallow"];

/** Not emergencies, but a senior doctor should look before treatment starts. */
export const REVIEW_FLAGS = ["muffled", "swelling", "swollen", "stiff neck", "103", "104", "blood", "lying flat", "getting worse", "worse every day"];

/** The AI junior doctor who takes every first consultation. */
export const JUNIOR_DOCTOR = {
  name: "Dr. Ayesha Khan",
  short: "Dr. Ayesha",
  role: "General Physician · AI junior doctor",
  avatar: { gender: "female", femaleHair: "hijab", scarf: "blue", skinTone: "medium", eyeColor: "dark" } as const,
};

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", opts);
