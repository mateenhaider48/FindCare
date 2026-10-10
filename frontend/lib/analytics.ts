// Mock analytics for the dashboard until the backend reports real numbers.

export type AgentStatus = "online" | "degraded" | "offline";

export type AgentHealth = {
  key: string;
  name: string;
  field: string;
  status: AgentStatus;
  sessionsToday: number;
  avgReply: string;
  issue?: string;
};

export const TODAY = {
  patients: 148,
  patientsDelta: 12,
  consultations: 163,
  escalated: 9,
  avgMinutes: 7.4,
};

/** Patients who started a consultation, per hour today. */
export const PATIENTS_BY_HOUR: { hour: string; count: number }[] = [
  { hour: "08", count: 6 },
  { hour: "09", count: 11 },
  { hour: "10", count: 17 },
  { hour: "11", count: 14 },
  { hour: "12", count: 12 },
  { hour: "13", count: 9 },
  { hour: "14", count: 13 },
  { hour: "15", count: 16 },
  { hour: "16", count: 15 },
  { hour: "17", count: 12 },
  { hour: "18", count: 10 },
  { hour: "19", count: 13 },
];

export const AGENTS: AgentHealth[] = [
  { key: "ayesha", name: "Dr. Ayesha", field: "General Physician", status: "online", sessionsToday: 148, avgReply: "1.2 s" },
  { key: "alex", name: "Dr. Alex", field: "Cardiology", status: "online", sessionsToday: 21, avgReply: "1.6 s" },
  { key: "mira", name: "Dr. Mira", field: "Dermatology", status: "degraded", sessionsToday: 18, avgReply: "4.8 s", issue: "Photo analysis timing out on large images" },
  { key: "kenji", name: "Dr. Kenji", field: "Neurology", status: "online", sessionsToday: 14, avgReply: "1.4 s" },
  { key: "lena", name: "Dr. Lena", field: "Pediatrics", status: "online", sessionsToday: 25, avgReply: "1.3 s" },
  { key: "omar", name: "Dr. Omar", field: "Pulmonology", status: "offline", sessionsToday: 0, avgReply: "—", issue: "Knowledge base update in progress, back at 20:00" },
  { key: "sofia", name: "Dr. Sofia", field: "Psychiatry", status: "online", sessionsToday: 19, avgReply: "1.9 s" },
  { key: "theo", name: "Dr. Theo", field: "Orthopedics", status: "online", sessionsToday: 11, avgReply: "1.5 s" },
];

export const STATUS: Record<AgentStatus, { label: string; className: string; dot: string }> = {
  online: { label: "Online", className: "bg-success-soft text-success", dot: "bg-success" },
  degraded: { label: "Degraded", className: "bg-warning-soft text-warning", dot: "bg-warning" },
  offline: { label: "Offline", className: "bg-danger-soft text-danger", dot: "bg-danger" },
};
