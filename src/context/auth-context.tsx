
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { schoolData, schoolGroups } from '@/lib/mock-data';

export type Role = 'GlobalAdmin' | 'Admin' | 'Teacher' | 'Student' | 'Parent';

interface User {
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
  impersonateUser: (username: string, asRole?: Role) => void;
  revertImpersonation: () => void;
  originalUser: User | null;
  originalRole: Role | null;
}

// Mock user data
export const mockUsers: Record<string, { user: User; password?: string }> = {
  // Global Admins
  'developer': { user: { username: 'developer', name: 'Developer', email: 'developer@edumanage.com', role: 'GlobalAdmin' }, password: 'dev123' },
  // School Admins
  'admin1': { user: { username: 'admin1', name: 'Dr. Sarah Johnson', email: 's.johnson@northwood.edu', role: 'Admin', schoolId: 'northwood' }, password: 'admin' },
  'admin2': { user: { username: 'admin2', name: 'Mr. James Maxwell', email: 'j.maxwell@oakridge.edu', role: 'Admin', schoolId: 'oakridge' }, password: 'admin' },
  'admin3': { user: { username: 'admin3', name: 'Ms. Eleanor Vance', email: 'e.vance@maplewood.edu', role: 'Admin', schoolId: 'maplewood' }, password: 'admin' },
  
  // Teachers
  'teacher1': { user: { username: 'teacher1', name: 'Prof. Michael Chen', email: 'm.chen@edumanage.com', role: 'Teacher', schoolId: 'northwood' }, password: 'teacher' },
  'teacher2': { user: { username: 'teacher2', name: 'Ms. Rachel Adams', email: 'r.adams@oakridge.com', role: 'Teacher', schoolId: 'oakridge' }, password: 'teacher' },

  // Students
  'student1': { user: { username: 'student1', name: 'Emma Rodriguez', email: 'e.rodriguez@edumanage.com', role: 'Student', schoolId: 'northwood' }, password: 'student' },
  'student2': { user: { username: 'student2', name: 'Benjamin Carter', email: 'b.carter@oakridge.com', role: 'Student', schoolId: 'oakridge' }, password: 'student' },
  'student3': { user: { username: 'student3', name: 'William Miller', email: 'w.miller@edumanage.com', role: 'Student', schoolId: 'northwood' }, password: 'student' },

  // Parents
  'parent1': { user: { username: 'parent1', name: 'Maria Rodriguez', email: 'm.rodriguez@family.com', role: 'Parent' }, password: 'parent' },
  'parent2': { user: { username: 'parent2', name: 'Daniel Kim', email: 'd.kim@family.com', role: 'Parent' }, password: 'parent' },
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Impersonation state
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [originalRole, setOriginalRole] = useState<Role | null>(null);

  const router = useRouter();

  useEffect(() => {
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
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    const userRecord = Object.values(mockUsers).find(
      (record) => record.user.email.toLowerCase() === email.toLowerCase() && record.password === pass
    );

    if (userRecord) {
      const loggedInUser = userRecord.user;
      setUser(loggedInUser);
      setRole(loggedInUser.role);
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));
      sessionStorage.setItem('role', loggedInUser.role);
      return { success: true };
    }
    
    // Check if it's a valid parent email
    const parentRecord = Object.values(schoolData)
      .flatMap(s => s.students)
      .find(s => s.parentEmail.toLowerCase() === email.toLowerCase());

    if (parentRecord && pass === 'parent') {
        const parentUser: User = {
          username: parentRecord.parentEmail,
          name: parentRecord.parentName,
          email: parentRecord.parentEmail,
          role: 'Parent',
        };
        setUser(parentUser);
        setRole('Parent');
        sessionStorage.setItem('user', JSON.stringify(parentUser));
        sessionStorage.setItem('role', 'Parent');
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
    if (!user || !role) return;

    // Find the target user in mockUsers by username or email
    let targetRecord = Object.values(mockUsers).find(
      (record) => record.user.username === usernameOrEmail || record.user.email === usernameOrEmail
    );

    // If not found, check if it's a parent email
    if (!targetRecord) {
        const parentStudent = Object.values(schoolData).flatMap(s => s.students).find(s => s.parentEmail === usernameOrEmail);
        if (parentStudent) {
            targetRecord = {
                user: {
                    username: parentStudent.parentEmail,
                    name: parentStudent.parentName,
                    email: parentStudent.parentEmail,
                    role: 'Parent'
                }
            };
        }
    }

    if (targetRecord) {
      const targetUser = targetRecord.user;
      
      // Save current user state as original
      setOriginalUser(user);
      setOriginalRole(role);
      sessionStorage.setItem('originalUser', JSON.stringify(user));
      sessionStorage.setItem('originalRole', role);
      
      // Set new impersonated user state
      const impersonatedRole = asRole || targetUser.role;
      setUser({ ...targetUser, role: impersonatedRole });
      setRole(impersonatedRole);
      sessionStorage.setItem('user', JSON.stringify({ ...targetUser, role: impersonatedRole }));
      sessionStorage.setItem('role', impersonatedRole);
      
      router.push('/dashboard');
    }
  };

  const revertImpersonation = () => {
    if (originalUser && originalRole) {
      setUser(originalUser);
      setRole(originalRole);
      sessionStorage.setItem('user', JSON.stringify(originalUser));
      sessionStorage.setItem('role', originalRole);
      
      // Clear original user state
      setOriginalUser(null);
      setOriginalRole(null);
      sessionStorage.removeItem('originalUser');
      sessionStorage.removeItem('originalRole');
      
      router.push('/dashboard/global-admin');
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
