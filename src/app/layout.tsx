
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// The root layout is simple and only defines the html and body tags.
// The real layout is in src/app/[locale]/layout.tsx
export default function RootLayout({children}: Props) {
  return children;
}
