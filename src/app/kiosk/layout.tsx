
import { SchoolDataProvider } from '@/context/school-data-context';

export default function KioskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground h-screen w-screen overflow-hidden">
        <SchoolDataProvider>
            {children}
        </SchoolDataProvider>
    </div>
  );
}
