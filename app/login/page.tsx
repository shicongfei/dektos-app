"use client";

import Link from "next/link";
import { useState } from "react";
import { ui } from "@/lib/i18n";
import { T } from "@/components/T";
import { Seal } from "@/components/Seal";

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-6">
      <div className="mb-8 flex flex-col items-center gap-3">
        <Seal size={64} />
        <h1 className="font-serif text-2xl font-bold text-ink">
          <T t={ui.loginTitle} />
        </h1>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <label className="block">
          <span className="mb-1 block text-sm text-ink">
            <T t={ui.email} />
          </span>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-md border border-line bg-white/70 px-3 py-3 text-base outline-none focus:border-accent"
            placeholder="name@example.com"
          />
        </label>
        <label className="block">
          <span className="mb-1 flex justify-between text-sm text-ink">
            <T t={ui.password} />
            <button type="button" className="text-xs text-ink-soft">
              <T t={ui.forgot} />
            </button>
          </span>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded-md border border-line bg-white/70 px-3 py-3 text-base outline-none focus:border-accent"
          />
        </label>
        <button type="submit" className="w-full rounded-md bg-ink py-3 text-sm font-medium text-paper">
          <T t={ui.login} />
        </button>
        {submitted && (
          <p className="rounded-md bg-paper-deep p-3 text-center text-sm text-ink-soft" role="status">
            <T t={ui.loginSoon} />
          </p>
        )}
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-ink-soft">
        <span className="h-px flex-1 bg-line" />
        <T t={ui.orContinue} />
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {["Google", "Apple"].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setSubmitted(true)}
            className="rounded-md border border-line bg-white/50 py-2.5 text-sm text-ink"
          >
            {p}
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-ink-soft">
        <T t={ui.noAccount} />{" "}
        <Link href="/login" className="text-accent underline underline-offset-4">
          <T t={ui.signup} />
        </Link>
      </p>
    </div>
  );
}
