
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { mockUsers as allMockUsers } from '@/lib/mock-data';
import { getSchoolsFromFirestore } from '@/lib/firebase/firestore-service';


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
    setIsLoading(true);
    
    // Check against predefined mock users first
    const userRecord = Object.values(allMockUsers).find(u => u.user.email.toLowerCase() === email.toLowerCase());

    if (userRecord && userRecord.password === pass) {
        const loggedInUser: User = { ...userRecord.user };
        setUser(loggedInUser);
        setRole(loggedInUser.role);
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));
        sessionStorage.setItem('role', loggedInUser.role);
        setIsLoading(false);
        router.push('/dashboard');
        return { success: true };
    }
    
    // If not a predefined user, check if it's a valid parent email
    const allSchoolData = await getSchoolsFromFirestore(); // Fetch fresh data for parent check
    const allStudents = Object.values(allSchoolData).flatMap(s => s.students);
    const parentStudent = allStudents.find(s => s.parentEmail.toLowerCase() === email.toLowerCase());

    if (parentStudent && pass === 'parent') {
        const parentUser: User = {
          username: parentStudent.parentEmail,
          name: parentStudent.parentName,
          email: parentStudent.parentEmail,
          role: 'Parent',
        };
        setUser(parentUser);
        setRole('Parent');
        sessionStorage.setItem('user', JSON.stringify(parentUser));
        sessionStorage.setItem('role', 'Parent');
        setIsLoading(false);
        router.push('/dashboard');
        return { success: true };
    }
    
    setIsLoading(false);
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
    if (!user || !role) return;

    let targetUser: User | undefined;
    
    const allSchoolData = await getSchoolsFromFirestore();
    const allMockUsersList = Object.values(allMockUsers).map(u => u.user);
    const foundUser = allMockUsersList.find(u => u.email.toLowerCase() === usernameOrEmail.toLowerCase());
    
    if (foundUser) {
        targetUser = foundUser;
    } else {
        const allStudents = Object.values(allSchoolData).flatMap(s => s.students);
        const parentStudent = allStudents.find(s => s.parentEmail.toLowerCase() === usernameOrEmail.toLowerCase());
        if (parentStudent) {
            targetUser = {
                username: parentStudent.parentEmail,
                name: parentStudent.parentName,
                email: parentStudent.parentEmail,
                role: 'Parent',
            };
        }
    }
    
    if (targetUser) {
      setOriginalUser(user);
      setOriginalRole(role);
      sessionStorage.setItem('originalUser', JSON.stringify(user));
      sessionStorage.setItem('originalRole', role);
      
      const impersonatedRole = asRole || targetUser.role;
      const finalUser = { ...targetUser, role: impersonatedRole, username: targetUser.email };
      setUser(finalUser);
      setRole(impersonatedRole);
      sessionStorage.setItem('user', JSON.stringify(finalUser));
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
