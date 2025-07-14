
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { mockUsers, type SchoolData, schoolData } from '@/lib/mock-data';

export type Role = 'GlobalAdmin' | 'Admin' | 'Teacher' | 'Student' | 'Parent';

export interface User {
  username: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (email: string, pass: string) => Promise<LoginResult>;
  logout: () => void;
  isLoading: boolean;
  impersonateUser: (usernameOrEmail: string, asRole?: Role) => void;
  revertImpersonation: () => void;
  originalUser: User | null;
  originalRole: Role | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [originalRole, setOriginalRole] = useState<Role | null>(null);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = sessionStorage.getItem('user');
      const storedRole = sessionStorage.getItem('role') as Role;
      const storedOriginalUser = sessionStorage.getItem('originalUser');
      const storedOriginalRole = sessionStorage.getItem('originalRole') as Role;

      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
      if (storedOriginalUser && storedOriginalRole) {
        setOriginalUser(JSON.parse(storedOriginalUser));
        setOriginalRole(storedOriginalRole);
      }
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
      sessionStorage.clear();
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  const login = async (email: string, pass: string): Promise<LoginResult> => {
    const userRecord = Object.values(mockUsers).find(u => u.user.email.toLowerCase() === email.toLowerCase());

    if (userRecord && userRecord.password === pass) {
        const loggedInUser: User = { 
            username: userRecord.user.email,
            name: userRecord.user.name,
            email: userRecord.user.email,
            role: userRecord.user.role,
            schoolId: userRecord.user.schoolId,
        };
        setUser(loggedInUser);
        setRole(userRecord.user.role);
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        sessionStorage.setItem('role', userRecord.user.role);
        return { success: true };
    }
    
    return { success: false, message: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setOriginalUser(null);
    setOriginalRole(null);
    sessionStorage.clear();
    router.push('/');
  };

  const impersonateUser = (usernameOrEmail: string, asRole?: Role) => {
    let targetUserRecord = Object.values(mockUsers).find(u => u.user.email === usernameOrEmail);
    
    // Fallback for dynamically created school admins not in mockUsers
    if (!targetUserRecord) {
        const school = Object.values(schoolData).find(s => s.profile.email === usernameOrEmail);
        if (school) {
            targetUserRecord = {
                user: {
                    username: school.profile.email,
                    name: school.profile.head,
                    role: 'Admin',
                    email: school.profile.email,
                    schoolId: school.profile.id,
                },
                password: 'admin', // Dummy password
            };
        }
    }

    if (targetUserRecord) {
        if (!originalUser) {
            setOriginalUser(user);
            setOriginalRole(role);
            sessionStorage.setItem('originalUser', JSON.stringify(user));
            sessionStorage.setItem('originalRole', role!);
        }
        
        const impersonatedUser: User = {
            ...targetUserRecord.user
        };
        setUser(impersonatedUser);
        setRole(impersonatedUser.role);
        sessionStorage.setItem('user', JSON.stringify(impersonatedUser));
        sessionStorage.setItem('role', impersonatedUser.role);
        router.push('/dashboard');
    }
  };

  const revertImpersonation = () => {
    if (originalUser && originalRole) {
        setUser(originalUser);
        setRole(originalRole);
        sessionStorage.setItem('user', JSON.stringify(originalUser));
        sessionStorage.setItem('role', originalRole);
        setOriginalUser(null);
        setOriginalRole(null);
        sessionStorage.removeItem('originalUser');
        sessionStorage.removeItem('originalRole');
        router.push('/dashboard');
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isLoading, impersonateUser, revertImpersonation, originalUser, originalRole }}>
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
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
