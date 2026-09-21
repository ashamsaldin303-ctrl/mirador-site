"use client";

/**
 * SectionHeading — the shared §-numbered heading anatomy used by every
 * section: mono kicker (§n + label), display title, intro paragraph.
 * Arabic display type: no letter-spacing (ltr-only tracking), higher leading.
 */

import { useLanguage } from "@/components/site/language-provider";
import { Reveal } from "@/components/site/reveal";
import type { Bi } from "@/lib/manual-content";

export function SectionHeading({
  index,
  kicker,
  title,
  intro,
}: {
  index: string;
  kicker: Bi<string>;
  title: Bi<string>;
  intro: Bi<string>;
}) {
  const { t } = useLanguage();

  return (
    <Reveal className="mb-10 md:mb-14">
      <p className="font-mono text-xs font-medium uppercase text-primary ltr:tracking-wider">
        {index} · {t(kicker)}
      </p>
      <h2 className="mt-3 text-section ltr:leading-tight rtl:leading-snug">
        {t(title)}
      </h2>
      <p className="prose-body mt-4 max-w-prose text-muted-foreground">
        {t(intro)}
      </p>
    </Reveal>
  );
}
