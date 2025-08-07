import { ReactNode } from "react";

// This layout is now a pass-through to neutralize the [locale] segment.
// The actual layout is handled by src/app/layout.tsx
export default function LocaleLayout({
  children
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
