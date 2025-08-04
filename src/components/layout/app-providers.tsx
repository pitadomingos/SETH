'use client';

import { SchoolDataProvider } from "@/context/school-data-context";
import { AuthProvider } from "@/context/auth-context";
import { ReactNode } from "react";
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

export function AppProviders({ children, messages, locale }: { children: ReactNode, messages: AbstractIntlMessages, locale: string }) {
    
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
