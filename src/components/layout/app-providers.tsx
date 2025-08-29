'use client';

import { SchoolDataProvider } from "@/context/school-data-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import React, { ReactNode, useEffect, createContext, useContext, useMemo } from "react";
import RoleBasedWebSocketClient from "@/lib/websocketClient";

// --- WebSocket Context ---
interface WebSocketContextType {
    wsClient: RoleBasedWebSocketClient | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const { role } = useAuth();

    const wsClient = useMemo(() => {
        if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_WEBSOCKET_URL && role) {
            return new RoleBasedWebSocketClient(role, process.env.NEXT_PUBLIC_WEBSOCKET_URL);
        }
        return null;
    }, [role]);

    return (
        <WebSocketContext.Provider value={{ wsClient }}>
            {children}
        </WebSocketContext.Provider>
    );
};


// --- App Providers ---
export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <SchoolDataProvider>
                <WebSocketProvider>
                    {children}
                </WebSocketProvider>
            </SchoolDataProvider>
        </AuthProvider>
    );
}
