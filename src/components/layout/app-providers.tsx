
'use client';

import { SchoolDataProvider } from "@/context/school-data-context";
import { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <SchoolDataProvider>
            {children}
        </SchoolDataProvider>
    );
}
