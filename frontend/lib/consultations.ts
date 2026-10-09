// Consultation records. Mock data until the backend is connected; sessions
// finished in the browser are kept in localStorage so they show in History.

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

export const HISTORY: Consultation[] = [
  {
    id: "fc-20418",
    date: "2026-10-06",
    start: "10:01",
    end: "10:08",
    doctor: "Dr. Ayesha Khan",
    field: "General Physician",
    concern: "Fever and sore throat",
    urgency: "review",
    told: ["Fever for 3 days, highest 102.8°F last night", "Sore throat with pain when swallowing", "Swelling on both sides of the neck", "Muffled voice since this morning", "Mild breathlessness when lying flat"],
    negatives: "No cough, runny nose or rash",
    assessment:
      "This looks like a bacterial throat infection. Because your voice has changed and you feel breathless lying down, there may be a collection of pus near the tonsils. A senior ENT doctor needs to check this before antibiotics are started.",
    prescription: [
      { name: "Paracetamol 500 mg", dose: "2 tablets", often: "Every 6 hours if needed, max 8 a day", duration: "3 days" },
      { name: "Warm salt water gargle", dose: "1 glass", often: "3 to 4 times a day", duration: "5 days" },
    ],
    prescriptionNote: "An antibiotic may be added after Dr. Imran's review. You'll see it here.",
    advice: ["Rest, sit upright, and take small sips of water or warm drinks.", "Keep your phone nearby so Dr. Imran can reach you."],
    emergency: "if breathing gets harder, you can't swallow your saliva, or you start drooling.",
    review: { by: "Dr. Imran Shah", role: "Consultant ENT surgeon, Margalla General Hospital", phone: "0300 ••• 4512", expectedBy: "10:24", inMinutes: 15 },
  },
  {
    id: "fc-20377",
    date: "2026-10-01",
    start: "21:14",
    end: "21:22",
    doctor: "Dr. Kenji",
    field: "Neurology",
    concern: "Recurring headache",
    urgency: "see-gp",
    told: ["Dull headache behind the eyes for 2 weeks", "Worse in the evening and after screen time", "Sleeping about 5 hours a night"],
    negatives: "No vomiting, weakness or vision loss",
    assessment: "This pattern fits a tension-type headache, likely linked to short sleep and screen strain. It is not dangerous, but a GP visit is worth it if it continues past another week.",
    prescription: [{ name: "Paracetamol 500 mg", dose: "1–2 tablets", often: "Up to 3 times a day if needed", duration: "5 days" }],
    advice: ["Aim for 7–8 hours of sleep and take screen breaks every 30 minutes.", "Keep a short headache diary: time, trigger, how long it lasted."],
    emergency: "if the headache is sudden and severe, or comes with weakness, confusion or trouble speaking.",
  },
  {
    id: "fc-20291",
    date: "2026-09-29",
    start: "16:40",
    end: "16:47",
    doctor: "Dr. Mira",
    field: "Dermatology",
    concern: "Dry itchy rash on arm",
    urgency: "self-care",
    told: ["Itchy, dry patch on the inner elbow for 10 days", "Started after switching to a new soap"],
    negatives: "No fever, blisters or spreading redness",
    assessment: "This looks like mild contact eczema from the new soap. It should settle with moisturiser and avoiding the trigger.",
    prescription: [{ name: "Fragrance-free moisturiser", dose: "Thin layer", often: "Twice a day", duration: "2 weeks" }],
    advice: ["Go back to your old soap.", "Avoid scratching; keep nails short."],
    emergency: "if the rash spreads fast, blisters, or you get a fever.",
  },
  {
    id: "fc-20164",
    date: "2026-09-12",
    start: "08:05",
    end: "08:13",
    doctor: "Dr. Alex",
    field: "Cardiology",
    concern: "Chest tightness on stairs",
    urgency: "urgent",
    told: ["Chest tightness when climbing stairs for a week", "Eases after resting for a few minutes", "Father had a heart attack at 58"],
    assessment: "Chest tightness that comes with effort and eases with rest needs an in-person heart check soon. An ECG within 72 hours is recommended.",
    prescription: [],
    prescriptionNote: "No medicine until you have been examined.",
    advice: ["Avoid heavy exertion until you are seen.", "Book an ECG and GP review within 72 hours."],
    emergency: "if the pain lasts more than a few minutes at rest or spreads to your arm, jaw or back.",
  },
  {
    id: "fc-20090",
    date: "2026-08-30",
    start: "23:02",
    end: "23:10",
    doctor: "Dr. Lena",
    field: "Pediatrics",
    concern: "Child fever, 2 days",
    urgency: "self-care",
    told: ["4-year-old with fever of 38.6°C for 2 days", "Eating less but drinking well", "Playing between fever spikes"],
    assessment: "This is most likely a viral illness. Your child is drinking and playing, which is reassuring.",
    prescription: [{ name: "Paracetamol syrup 120 mg/5 ml", dose: "7.5 ml", often: "Every 6 hours if needed", duration: "3 days" }],
    advice: ["Offer fluids often.", "Dress lightly; no need to wake your child to give medicine."],
    emergency: "if your child is very drowsy, has a rash that doesn't fade when pressed, or struggles to breathe.",
  },
];

const KEY = "fc_history";

export function loadLocal(): Consultation[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Consultation[];
  } catch {
    return [];
  }
}

export function saveLocal(c: Consultation) {
  try {
    localStorage.setItem(KEY, JSON.stringify([c, ...loadLocal().filter((x) => x.id !== c.id)]));
  } catch {
    // storage blocked: the summary still shows for this visit via the URL
  }
}

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", opts);
