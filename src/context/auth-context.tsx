'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export type Role = 'Admin' | 'Teacher' | 'Student';

interface User {
  username: string;
  name: string;
  email: string;
  schoolId: string;
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

const mockUsers: Record<string, { user: User, role: Role }> = {
  admin1: { user: { username: 'admin1', name: 'Dr. Sarah Johnson', email: 's.johnson@northwood.edu', schoolId: 'northwood' }, role: 'Admin' },
  teacher1: { user: { username: 'teacher1', name: 'Prof. Michael Chen', email: 'm.chen@northwood.edu', schoolId: 'northwood' }, role: 'Teacher' },
  student1: { user: { username: 'student1', name: 'Emma Rodriguez', email: 'e.rodriguez@northwood.edu', schoolId: 'northwood' }, role: 'Student' },
  admin2: { user: { username: 'admin2', name: 'Mr. James Maxwell', email: 'j.maxwell@oakridge.edu', schoolId: 'oakridge' }, role: 'Admin' },
  teacher2: { user: { username: 'teacher2', name: 'Ms. Rachel Adams', email: 'r.adams@oakridge.edu', schoolId: 'oakridge' }, role: 'Teacher' },
  student2: { user: { username: 'student2', name: 'Benjamin Carter', email: 'b.carter@oakridge.edu', schoolId: 'oakridge' }, role: 'Student' },
  admin3: { user: { username: 'admin3', name: 'Ms. Eleanor Vance', email: 'e.vance@maplewood.edu', schoolId: 'maplewood' }, role: 'Admin' },
  teacher3: { user: { username: 'teacher3', name: 'Mr. David Lee', email: 'd.lee@maplewood.edu', schoolId: 'maplewood' }, role: 'Teacher' },
  student3: { user: { username: 'student3', name: 'Chloe Dubois', email: 'c.dubois@maplewood.edu', schoolId: 'maplewood' }, role: 'Student' },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('userRole') as Role;
      if (savedUser && savedRole) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(savedRole);
      }
    } catch (e) {
      console.error("Local storage is not available or data is corrupted.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (creds: LoginCredentials): Promise<boolean> => {
    // Find user record by username first. The keys of mockUsers are the usernames.
    const userRecord = mockUsers[creds.username.toLowerCase()];
    
    // Check if user exists AND if the role from the form matches the user's actual role.
    if (!userRecord || userRecord.role !== creds.role) {
      return false;
    }

    // Now check password based on role.
    let correctPassword = '';
    switch (creds.role) {
      case 'Admin': correctPassword = 'admin123'; break;
      case 'Teacher': correctPassword = 'teacher123'; break;
      case 'Student': correctPassword = 'student123'; break;
    }

    if (creds.password === correctPassword) {
      const { user, role } = userRecord;
      setUser(user);
      setRole(role);
      try {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userRole', role);
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
      localStorage.removeItem('user');
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

    