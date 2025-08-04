'use client';

import { SchoolDataProvider } from "@/context/school-data-context";
import { AuthProvider } from "@/context/auth-context";
import { ReactNode } from "react";
import { NextIntlClientProvider, useMessages } from 'next-intl';

export function AppProviders({ children, locale }: { children: ReactNode, locale: string }) {
    const messages = useMessages();
    
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
                <SchoolDataProvider>
                    {children}
                </SchoolDataProvider>
            </AuthProvider>
        </NextIntlClientProvider>
    );
}
