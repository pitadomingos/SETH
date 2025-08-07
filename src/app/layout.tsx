
import { ReactNode } from "react";

// The root layout only needs to pass children and params.
// The locale-specific layout will handle the rest.
export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return children;
}
