
'use client';

import { SchoolDataProvider } from "@/context/school-data-context";
import { AuthProvider } from "@/context/auth-context";
import { ReactNode, useEffect } from "react";
import { WebSocketClient } from "@/lib/websocketClient";

export function AppProviders({ children }: { children: ReactNode }) {

    useEffect(() => {
        // This check ensures the WebSocket client only runs in the browser.
        if (typeof window !== 'undefined') {
            const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://placeholder.eduddesk.app/api/ws';
            const client = new WebSocketClient(wsUrl);

            client.onOpen = () => {
                console.log('WebSocket connected. Ready for real-time updates.');
            };

            client.onMessage = (data) => {
                // Here you would handle incoming real-time notifications
                // For now, we'll just log them.
                console.log('Real-time message received:', data);
            };

            // Cleanup on component unmount
            return () => {
                client.close();
            };
        }
    }, []);

    return (
        <AuthProvider>
            <SchoolDataProvider>
                {children}
            </SchoolDataProvider>
        </AuthProvider>
    );
}
