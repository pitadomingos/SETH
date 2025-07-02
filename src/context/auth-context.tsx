'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export type Role = 'Admin' | 'Teacher' | 'Student';

interface User {
  name: string;
  email: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  role: Exclude<Role, null>;
}

interface AuthContextType {
  role: Role | null;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<Exclude<Role, null>, User> = {
  Admin: { name: 'Dr. Sarah Johnson', email: 's.johnson@edumanage.com' },
  Teacher: { name: 'Prof. Michael Chen', email: 'm.chen@edumanage.com' },
  Student: { name: 'Emma Rodriguez', email: 'e.rodriguez@edumanage.com' },
};

const credentials: Record<string, string> = {
    admin: 'admin123',
    teacher: 'teacher123',
    student: 'student123',
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
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

  const login = async (creds: LoginCredentials): Promise<boolean> => {
    const expectedPassword = credentials[creds.username.toLowerCase()];
    if (creds.role && creds.username.toLowerCase() === creds.role.toLowerCase() && expectedPassword === creds.password) {
      const newRole = creds.role;
      setRole(newRole);
      setUser(mockUsers[newRole]);
      try {
        localStorage.setItem('userRole', newRole);
      } catch (e) {
        console.error("Local storage is not available.");
      }
      return true;
    }
    return false;
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
