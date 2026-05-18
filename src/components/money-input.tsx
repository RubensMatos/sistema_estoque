"use client";

import { useMemo, useState } from "react";

type Props = {
  name: string;
  defaultValue?: number;
  placeholder?: string;
  className?: string;
};

function formatFromCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function MoneyInput({ name, defaultValue = 0, placeholder = "0,00", className = "input" }: Props) {
  const [cents, setCents] = useState<number>(Math.max(0, Math.round(defaultValue * 100)));

  const visibleValue = useMemo(() => formatFromCents(cents), [cents]);
  const numericValue = useMemo(() => (cents / 100).toFixed(2), [cents]);

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        className={className}
        value={visibleValue}
        placeholder={placeholder}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          const next = digits ? Number(digits) : 0;
          setCents(next);
        }}
      />
      <input type="hidden" name={name} value={numericValue} />
    </>
  );
}
