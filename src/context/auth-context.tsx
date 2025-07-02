'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export type Role = 'Admin' | 'Teacher' | 'Student' | null;

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  role: Role;
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<Exclude<Role, null>, User> = {
  Admin: { name: 'Alex Doe', email: 'admin@edudesk.com' },
  Teacher: { name: 'Dr. Evelyn Reed', email: 'e.reed@edudesk.com' },
  Student: { name: 'Sam Wilson', email: 's.wilson@edudesk.com' },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('userRole') as Role;
      if (savedRole && ['Admin', 'Teacher', 'Student'].includes(savedRole)) {
        setRole(savedRole);
        setUser(mockUsers[savedRole]);
      }
    } catch (e) {
      console.error("Local storage is not available.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newRole: Role) => {
    if (newRole) {
      setRole(newRole);
      setUser(mockUsers[newRole]);
      try {
        localStorage.setItem('userRole', newRole);
      } catch (e) {
        console.error("Local storage is not available.");
      }
    }
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    try {
      localStorage.removeItem('userRole');
      window.location.href = '/';
    } catch (e) {
      console.error("Local storage is not available.");
    }
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !role) {
      router.push('/');
    }
  }, [role, isLoading, router]);

  if (isLoading || !role) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
