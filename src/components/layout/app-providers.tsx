
'use client';

import { SchoolDataProvider } from "@/context/school-data-context";
import { AuthProvider } from "@/context/auth-context";
import { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <SchoolDataProvider>
                {children}
            </SchoolDataProvider>
        </AuthProvider>
    );
}
