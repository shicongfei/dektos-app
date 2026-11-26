"use client";

import { useState } from "react";
import type { Membership } from "@/lib/content";
import { ui } from "@/lib/i18n";
import { useLang } from "./LangProvider";
import { T } from "./T";

function money(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function Pricing({ data }: { data: Membership }) {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const { lang } = useLang();
  const cur = data.currency;

  return (
    <div>
      <div className="mx-auto mb-2 flex w-fit rounded-full border border-line bg-white/60 p-1 text-sm" role="group">
        {(["monthly", "yearly"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            aria-pressed={period === p}
            className={`rounded-full px-5 py-1.5 transition-colors ${period === p ? "bg-ink text-paper" : "text-ink-soft"}`}
          >
            <T t={p === "monthly" ? ui.monthly : ui.yearly} />
          </button>
        ))}
      </div>
      <p className="mb-6 text-center text-xs text-ink-soft">
        <T t={ui.yearlySave} />
      </p>

      <div className="mb-6 flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm text-paper">
        <span className="font-serif">◆</span>
        <T t={ui.earlyBird} />
      </div>

      <div className="space-y-4">
        {data.tiers.map((tier) => {
          const price = period === "monthly" ? tier.monthly : tier.monthly * data.yearly_months;
          const early = price * data.early_bird_discount;
          const unit = period === "monthly" ? ui.perMonth : ui.perYear;
          const isFree = tier.monthly === 0;
          const features = lang === "zh" ? tier.features_zh : tier.features_en;

          return (
            <article
              key={tier.id}
              className={`relative rounded-md border p-5 ${
                tier.highlight ? "border-accent bg-white/80 ring-1 ring-accent" : "border-line bg-white/50"
              }`}
            >
              <h3 className="font-serif text-lg font-semibold text-ink">
                <T zh={tier.name_zh} en={tier.name_en} />
              </h3>

              <div className="mt-2 flex items-baseline gap-2">
                {isFree ? (
                  <span className="font-serif text-3xl font-bold text-ink">{cur}0</span>
                ) : (
                  <>
                    <span className="font-serif text-3xl font-bold text-ink">
                      {cur}
                      {money(price)}
                    </span>
                    <span className="text-sm text-ink-soft">
                      <T t={unit} />
                    </span>
                  </>
                )}
              </div>

              {!isFree && (
                <p className="mt-1 text-sm text-accent">
                  <T t={ui.earlyBirdPrice} /> {cur}
                  {money(early)}
                  <T t={unit} />
                  <span className="ml-2 text-xs text-ink-soft line-through">
                    {cur}
                    {money(price)}
                  </span>
                </p>
              )}

              <ul className="mt-4 space-y-2 text-sm text-ink">
                {features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled
                className={`mt-5 w-full rounded-md py-2.5 text-sm ${
                  isFree ? "border border-line text-ink-soft" : tier.highlight ? "bg-accent text-paper" : "bg-ink text-paper"
                } disabled:cursor-not-allowed`}
                title={lang === "zh" ? ui.paymentSoon.zh : ui.paymentSoon.en}
              >
                <T t={isFree ? ui.currentPlan : ui.choosePlan} />
              </button>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs text-ink-soft">
        <T t={ui.paymentSoon} />
      </p>
    </div>
  );
}
