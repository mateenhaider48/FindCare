export const site = {
  name: "FindCare",
  nav: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Specialties", href: "/#specialties" },
    { label: "For doctors", href: "/#for-doctors" },
  ],
  routes: {
    login: "/login",
    signup: "/signup",
    triage: "/triage",
  },
} as const;
