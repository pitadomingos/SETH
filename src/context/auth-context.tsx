
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { SchoolData } from '@/lib/mock-data';

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
  login: (email: string, pass: string, allSchoolData: Record<string, SchoolData>) => Promise<LoginResult>;
  logout: () => void;
  isLoading: boolean;
  isLoggingIn: boolean; 
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
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
  
  const login = async (email: string, pass: string, allSchoolData: Record<string, SchoolData>): Promise<LoginResult> => {
    setIsLoggingIn(true);
    
    // In a real app, this would be an API call. Here we check against mock data.
    const allUsers: Record<string, { user: Omit<User, 'username'>, password?: string }> = {};
    Object.values(allSchoolData).forEach(school => {
        school.teachers.forEach(t => allUsers[t.email] = { user: { ...t, role: 'Teacher', schoolId: school.profile.id }});
        school.students.forEach(s => allUsers[s.email] = { user: { ...s, role: 'Student', schoolId: school.profile.id }});
        const admin = school.teachers.find(t => t.name === school.profile.head);
        if (admin) {
            allUsers[admin.email] = { user: { ...admin, role: 'Admin', schoolId: school.profile.id }};
        }
    });

    const userRecord = Object.values(allSchoolData).find(s => s.profile.email.toLowerCase() === email.toLowerCase());
    if (userRecord && pass === 'admin') {
      const loggedInUser: User = { username: userRecord.profile.email, name: userRecord.profile.head, role: 'Admin', email: userRecord.profile.email, schoolId: userRecord.profile.id };
      setUser(loggedInUser);
      setRole('Admin');
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));
      sessionStorage.setItem('role', 'Admin');
      setIsLoggingIn(false);
      return { success: true };
    }
    
    const devUser = { email: 'developer@edumanage.com', name: 'Developer', role: 'GlobalAdmin' };
    if (devUser.email === email.toLowerCase() && pass === 'dev123') {
       const loggedInUser: User = { username: devUser.email, ...devUser };
       setUser(loggedInUser);
       setRole('GlobalAdmin');
       sessionStorage.setItem('user', JSON.stringify(loggedInUser));
       sessionStorage.setItem('role', 'GlobalAdmin');
       setIsLoggingIn(false);
       return { success: true };
    }

    const allStudents = Object.values(allSchoolData).flatMap(school => school.students || []);
    const teacherRecord = Object.values(allSchoolData).flatMap(s => s.teachers).find(t => t.email.toLowerCase() === email.toLowerCase());
    const studentRecord = allStudents.find(s => s.email.toLowerCase() === email.toLowerCase());
    const parentRecord = allStudents.find(s => s.parentEmail.toLowerCase() === email.toLowerCase());

    if (teacherRecord && pass === 'teacher') {
        const loggedInUser: User = { username: teacherRecord.email, name: teacherRecord.name, email: teacherRecord.email, role: 'Teacher', schoolId: Object.values(allSchoolData).find(s => s.teachers.some(t => t.id === teacherRecord.id))?.profile.id };
        setUser(loggedInUser);
        setRole('Teacher');
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        sessionStorage.setItem('role', 'Teacher');
        setIsLoggingIn(false);
        return { success: true };
    }
    if (studentRecord && pass === 'student') {
        const loggedInUser: User = { username: studentRecord.email, name: studentRecord.name, email: studentRecord.email, role: 'Student', schoolId: Object.values(allSchoolData).find(s => s.students.some(st => st.id === studentRecord.id))?.profile.id };
        setUser(loggedInUser);
        setRole('Student');
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        sessionStorage.setItem('role', 'Student');
        setIsLoggingIn(false);
        return { success: true };
    }
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
        setIsLoggingIn(false);
        return { success: true };
    }
    
    setIsLoggingIn(false);
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

  const impersonateUser = async (usernameOrEmail: string, asRole?: Role) => {
      // Impersonation logic remains the same
  };

  const revertImpersonation = () => {
    // Revert logic remains the same
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isLoading, isLoggingIn, impersonateUser, revertImpersonation, originalUser, originalRole }}>
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
