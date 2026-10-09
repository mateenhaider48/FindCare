import type { Metadata } from "next";
import PageHeader from "@/components/app/PageHeader";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 sm:p-8">
      <PageHeader title="Settings" subtitle="Your profile helps your AI doctor give better guidance." />
      <Card>
        <form className="space-y-4">
          <Input label="Full name" name="name" defaultValue="Hamad" />
          <Input label="Email" name="email" type="email" defaultValue="iammhamad8@gmail.com" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Age" name="age" type="number" placeholder="e.g. 28" />
            <Input label="Known allergies" name="allergies" placeholder="e.g. penicillin" />
          </div>
          <Input label="Current medications" name="meds" placeholder="Optional" />
          <Button type="button">Save changes</Button>
        </form>
      </Card>
    </div>
  );
}
