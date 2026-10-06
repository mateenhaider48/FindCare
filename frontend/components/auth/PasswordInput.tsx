"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";
import Input from "@/components/ui/Input";

export default function PasswordInput(props: Omit<ComponentProps<typeof Input>, "type" | "trailing">) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="grid size-8 place-items-center rounded-full text-muted hover:bg-mist hover:text-ink"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}
