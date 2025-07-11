
'use client';

import { useAuth } from "@/context/auth-context";
import { SchoolDataProvider } from "@/context/school-data-context";
import { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
    const { user, role } = useAuth();
    
    return (
        <SchoolDataProvider user={user} role={role}>
            {children}
        </SchoolDataProvider>
    );
}
