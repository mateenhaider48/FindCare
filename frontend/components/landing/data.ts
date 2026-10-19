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

// One doctor per working AI agent. These 22 specialties are fully wired: the
// classifier can select them, the router sends them to a real agent, and each
// agent has its knowledge base. (Nutrition, Rehabilitation and Dental agents
// exist but have no data yet, so they are not listed.)
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
  {
    key: "hassan",
    name: "Dr. Hassan",
    role: "AI GASTROENTEROLOGIST",
    field: "Gastroenterology",
    code: "GAST",
    desc: "Support for stomach, gut and digestion problems.",
    tags: ["Acid reflux", "Abdominal pain", "IBS"],
    avatar: { gender: "male", maleHair: "short", beard: "short", hairColor: "darkBrown", skinTone: "olive", eyeColor: "brown" },
  },
  {
    key: "noor",
    name: "Dr. Noor",
    role: "AI NEPHROLOGIST",
    field: "Nephrology",
    code: "NEPH",
    desc: "Guidance on kidney health and related lab results.",
    tags: ["Kidney function", "Swelling", "Blood pressure"],
    avatar: { gender: "female", femaleHair: "hijab", scarf: "mist", skinTone: "light", eyeColor: "dark" },
  },
  {
    key: "bilal",
    name: "Dr. Bilal",
    role: "AI UROLOGIST",
    field: "Urology",
    code: "URO",
    desc: "Private help with urinary, bladder and prostate concerns.",
    tags: ["Urinary symptoms", "Prostate", "Stones"],
    avatar: { gender: "male", maleHair: "short", hairColor: "black", skinTone: "brown", beard: "short", eyeColor: "dark" },
  },
  {
    key: "elif",
    name: "Dr. Elif",
    role: "AI RHEUMATOLOGIST",
    field: "Rheumatology",
    code: "RHEU",
    desc: "Help with joint pain, arthritis and autoimmune symptoms.",
    tags: ["Joint pain", "Arthritis", "Stiffness"],
    avatar: { gender: "female", femaleHair: "long", hairColor: "brown", skinTone: "light", glasses: "rounded", frameColor: "charcoal", eyeColor: "hazel" },
  },
  {
    key: "rhea",
    name: "Dr. Rhea",
    role: "AI OPHTHALMOLOGIST",
    field: "Ophthalmology",
    code: "OPHT",
    desc: "Guidance for eye pain, vision changes and red eyes.",
    tags: ["Vision changes", "Eye pain", "Redness"],
    avatar: { gender: "female", femaleHair: "tied", hairColor: "black", skinTone: "medium", glasses: "rectangular", frameColor: "tortoise", eyeColor: "brown" },
  },
  {
    key: "sami",
    name: "Dr. Sami",
    role: "AI ENT SPECIALIST",
    field: "ENT",
    code: "ENT",
    desc: "Ear, nose, throat, sinus and voice concerns.",
    tags: ["Sore throat", "Ear pain", "Sinuses"],
    avatar: { gender: "male", maleHair: "textured", hairColor: "darkBrown", skinTone: "light", beard: "stubble", eyeColor: "brown" },
  },
  {
    key: "zara",
    name: "Dr. Zara",
    role: "AI GYNECOLOGIST",
    field: "Gynecology",
    code: "GYN",
    desc: "Private support for women's reproductive health.",
    tags: ["Cycle concerns", "Pelvic pain", "Screening"],
    avatar: { gender: "female", femaleHair: "long", hairColor: "darkBrown", skinTone: "olive", scrubs: "teal", eyeColor: "dark" },
  },
  {
    key: "ivan",
    name: "Dr. Ivan",
    role: "AI HEMATOLOGIST",
    field: "Hematology",
    code: "HEM",
    desc: "Help understanding blood counts and clotting concerns.",
    tags: ["Anemia", "Blood counts", "Clotting"],
    avatar: { gender: "male", maleHair: "sidePart", hairColor: "salt", skinTone: "light", age: "mature", glasses: "oval", frameColor: "charcoal", eyeColor: "blueGrey" },
  },
  {
    key: "grace",
    name: "Dr. Grace",
    role: "AI ONCOLOGIST",
    field: "Oncology",
    code: "ONC",
    desc: "Steady guidance on cancer concerns and screening.",
    tags: ["Screening", "Symptoms", "Follow-up"],
    avatar: { gender: "female", femaleHair: "bun", hairColor: "grey", skinTone: "porcelain", age: "mature", eyeColor: "green" },
  },
  {
    key: "yusuf",
    name: "Dr. Yusuf",
    role: "AI HEPATOLOGIST",
    field: "Hepatology",
    code: "HEP",
    desc: "Guidance on liver health and related symptoms.",
    tags: ["Liver function", "Jaundice", "Hepatitis"],
    avatar: { gender: "male", maleHair: "short", hairColor: "black", skinTone: "medium", beard: "short", eyeColor: "dark" },
  },
  {
    key: "dimitri",
    name: "Dr. Dimitri",
    role: "AI VASCULAR SURGEON",
    field: "Vascular Surgery",
    code: "VASC",
    desc: "Help with veins, arteries and circulation outside the heart.",
    tags: ["Varicose veins", "Circulation", "Swelling"],
    avatar: { gender: "male", maleHair: "mature", hairColor: "salt", skinTone: "light", age: "mature", faceShape: "structured", eyeColor: "blueGrey" },
  },
  {
    key: "leo",
    name: "Dr. Leo",
    role: "AI NEUROSURGEON",
    field: "Neurosurgery",
    code: "NSG",
    desc: "Guidance on brain, spine and nerve conditions.",
    tags: ["Back & spine", "Nerve pain", "Head injury"],
    avatar: { gender: "male", maleHair: "short", hairColor: "darkBrown", skinTone: "olive", glasses: "rectangular", frameColor: "charcoal", faceShape: "structured", eyeColor: "dark" },
  },
  {
    key: "hina",
    name: "Dr. Hina",
    role: "AI ALLERGIST & IMMUNOLOGIST",
    field: "Allergy & Immunology",
    code: "ALLG",
    desc: "Help with allergies, hives and immune-system concerns.",
    tags: ["Food allergy", "Hives", "Hay fever"],
    avatar: { gender: "female", femaleHair: "hijab", scarf: "sand", skinTone: "medium", glasses: "oval", frameColor: "gold", eyeColor: "brown" },
  },
  {
    key: "faisal",
    name: "Dr. Faisal",
    role: "AI INFECTIOUS DISEASE SPECIALIST",
    field: "Infectious Disease",
    code: "INFD",
    desc: "Guidance on fevers, infections and travel-related illness.",
    tags: ["Persistent fever", "Typhoid & dengue", "Travel illness"],
    avatar: { gender: "male", maleHair: "sidePart", hairColor: "black", skinTone: "brown", beard: "short", scrubs: "teal", eyeColor: "dark" },
  },
];

export type Specialty = { code: string; name: string; isNew?: boolean };

// Only specialties backed by a working AI agent.
export const SPECIALTY_ROWS: Specialty[][] = [
  [
    { code: "CA", name: "Cardiology" },
    { code: "NE", name: "Neurology" },
    { code: "DE", name: "Dermatology" },
    { code: "PE", name: "Pediatrics" },
    { code: "PS", name: "Psychiatry" },
    { code: "PU", name: "Pulmonology" },
    { code: "EN", name: "Endocrinology" },
  ],
  [
    { code: "OR", name: "Orthopedics" },
    { code: "GA", name: "Gastroenterology" },
    { code: "NP", name: "Nephrology" },
    { code: "UR", name: "Urology" },
    { code: "GY", name: "Gynecology" },
    { code: "OP", name: "Ophthalmology" },
    { code: "ENT", name: "ENT" },
  ],
  [
    { code: "RH", name: "Rheumatology" },
    { code: "HE", name: "Hematology" },
    { code: "ON", name: "Oncology" },
    { code: "HP", name: "Hepatology" },
    { code: "VS", name: "Vascular Surgery" },
    { code: "NS", name: "Neurosurgery" },
    { code: "AL", name: "Allergy & Immunology" },
    { code: "ID", name: "Infectious Disease" },
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
