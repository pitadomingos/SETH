
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This is the new root page, which will just redirect to the public home page.
export default function RootPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/home');
    }, [router]);

    return null; // Render nothing while redirecting
}
