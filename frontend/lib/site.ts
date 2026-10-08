export const site = {
  name: "FindCare",
  nav: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Specialties", href: "/#specialties" },
    { label: "AI doctors", href: "/#ai-doctors" },
  ],
  routes: {
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    triage: "/triage",
  },
} as const;
