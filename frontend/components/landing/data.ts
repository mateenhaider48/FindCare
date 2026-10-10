import type { DoctorAvatarProps } from "@/components/brand/DoctorAvatar";

export type LandingDoctor = {
  key: string;
  name: string;
  role: string;
  field: string;
  code: string;
  desc: string;
  tags: string[];
  avatar: DoctorAvatarProps;
};

export const DOCTORS: LandingDoctor[] = [
  {
    key: "alex",
    name: "Dr. Alex",
    role: "AI CARDIOLOGIST",
    field: "Cardiology",
    code: "CARD",
    desc: "Your AI assistant for cardiovascular health guidance.",
    tags: ["Chest pain triage", "ECG literacy", "BP coaching"],
    avatar: { gender: "male", maleHair: "short", beard: "short", hairColor: "black", skinTone: "light", faceShape: "structured" },
  },
  {
    key: "mira",
    name: "Dr. Mira",
    role: "AI DERMATOLOGIST",
    field: "Dermatology",
    code: "DERM",
    desc: "Photo-guided help for skin, hair and nail concerns.",
    tags: ["Rash review", "Mole checks", "Acne"],
    avatar: { gender: "female", femaleHair: "long", hairColor: "darkBrown", skinTone: "light", eyeColor: "hazel" },
  },
  {
    key: "kenji",
    name: "Dr. Kenji",
    role: "AI NEUROLOGIST",
    field: "Neurology",
    code: "NEUR",
    desc: "Clear guidance on headaches, dizziness and nerve symptoms.",
    tags: ["Migraine", "Numbness", "Sleep"],
    avatar: { gender: "male", maleHair: "textured", glasses: "rectangular", hairColor: "black", skinTone: "medium", eyeColor: "dark" },
  },
  {
    key: "lena",
    name: "Dr. Lena",
    role: "AI PEDIATRICIAN",
    field: "Pediatrics",
    code: "PEDS",
    desc: "Calm, careful support for parents at any hour.",
    tags: ["Fever", "Milestones", "Feeding"],
    avatar: { gender: "female", femaleHair: "bun", hairColor: "auburn", skinTone: "porcelain", age: "young", eyeColor: "green" },
  },
  {
    key: "omar",
    name: "Dr. Omar",
    role: "AI PULMONOLOGIST",
    field: "Pulmonology",
    code: "PULM",
    desc: "Help with breathing, coughs and long-term lung conditions.",
    tags: ["Asthma", "Persistent cough", "Inhalers"],
    avatar: { gender: "male", maleHair: "short", beard: "short", glasses: "oval", frameColor: "gold", hairColor: "black", skinTone: "olive", faceShape: "structured" },
  },
  {
    key: "sofia",
    name: "Dr. Sofia",
    role: "AI PSYCHIATRIST",
    field: "Psychiatry",
    code: "PSYC",
    desc: "A private first step for mood, anxiety and stress.",
    tags: ["Anxiety", "Low mood", "Burnout"],
    avatar: { gender: "female", femaleHair: "hijab", scarf: "navy", skinTone: "olive", glasses: "rounded", frameColor: "tortoise", scrubs: "teal" },
  },
  {
    key: "theo",
    name: "Dr. Theo",
    role: "AI ORTHOPEDIST",
    field: "Orthopedics",
    code: "ORTH",
    desc: "Guidance for joints, sprains, back pain and recovery.",
    tags: ["Back pain", "Sports injury", "Rehab"],
    avatar: { gender: "male", maleHair: "sidePart", hairColor: "darkBrown", skinTone: "brown", beard: "stubble", eyeColor: "dark" },
  },
  {
    key: "ava",
    name: "Dr. Ava",
    role: "AI ENDOCRINOLOGIST",
    field: "Endocrinology",
    code: "ENDO",
    desc: "Plain-language help with hormones, thyroid and diabetes.",
    tags: ["Diabetes", "Thyroid", "Lab results"],
    avatar: { gender: "female", femaleHair: "tied", glasses: "oval", frameColor: "gold", hairColor: "brown", skinTone: "medium", scrubs: "navy" },
  },
];

export type Specialty = { code: string; name: string; isNew?: boolean };

export const SPECIALTY_ROWS: Specialty[][] = [
  [
    { code: "CA", name: "Cardiology" },
    { code: "NE", name: "Neurology" },
    { code: "DE", name: "Dermatology" },
    { code: "PE", name: "Pediatrics" },
    { code: "PS", name: "Psychiatry" },
    { code: "GA", name: "Gastroenterology" },
    { code: "AL", name: "Allergy & Immunology", isNew: true },
    { code: "SL", name: "Sleep Medicine" },
  ],
  [
    { code: "OR", name: "Orthopedics" },
    { code: "PU", name: "Pulmonology" },
    { code: "EN", name: "Endocrinology" },
    { code: "UR", name: "Urology" },
    { code: "GY", name: "Gynecology" },
    { code: "OP", name: "Ophthalmology" },
    { code: "HE", name: "Hematology" },
    { code: "SP", name: "Sports Medicine", isNew: true },
  ],
  [
    { code: "ON", name: "Oncology" },
    { code: "NP", name: "Nephrology" },
    { code: "ENT", name: "ENT" },
    { code: "RH", name: "Rheumatology" },
    { code: "GM", name: "General Medicine" },
    { code: "NU", name: "Nutrition" },
    { code: "GE", name: "Geriatrics" },
    { code: "WH", name: "Women's Health", isNew: true },
  ],
];

export type Testimonial = { name: string; location: string; rating: number; context: string; quote: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Nair",
    location: "Pune, India",
    rating: 5,
    context: "Consulted Dr. Mira · Dermatology",
    quote:
      "I had ignored a rash for weeks. Dr. Mira asked better questions in five minutes than I had asked myself in a month — and told me exactly which specialist to see.",
  },
  {
    name: "Daniel Reid",
    location: "Manchester, UK",
    rating: 5,
    context: "Consulted Dr. Lena · Pediatrics",
    quote:
      "At 2am with a feverish toddler I needed calm, not search results. Dr. Lena walked me through what to watch for and when to go in.",
  },
  {
    name: "Hannah Kim",
    location: "Toronto, Canada",
    rating: 5,
    context: "Consulted Dr. Alex · Cardiology",
    quote:
      "The chest tightness turned out to be nothing serious, but FindCare made sure I got an ECG to know that. That peace of mind is the product.",
  },
  {
    name: "Marcus Tate",
    location: "Austin, USA",
    rating: 5,
    context: "Consulted Dr. Ava · Endocrinology",
    quote:
      "I have lived with type 2 diabetes for years. Dr. Ava finally explained my lab results in language I could act on.",
  },
  {
    name: "Aisha Bakr",
    location: "Dubai, UAE",
    rating: 4,
    context: "Consulted Dr. Sofia · Psychiatry",
    quote: "Talking to Dr. Sofia first made booking a real therapist feel far less daunting. It met me where I was.",
  },
];
