
import { ReactNode } from "react";

export default function KioskLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-background text-foreground h-screen w-screen overflow-hidden">
        {children}
    </div>
  );
}
