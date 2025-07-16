
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
  mockUsers: typeof mockUsers;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use a state that can be updated when new schools are created
  const [dynamicMockUsers, setDynamicMockUsers] = useState(() => JSON.parse(JSON.stringify(mockUsers)));

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
      
      // Load dynamic users from session storage to persist across refreshes
      const storedDynamicUsers = sessionStorage.getItem('dynamicMockUsers');

      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
      if (storedOriginalUser && storedOriginalRole) {
        setOriginalUser(JSON.parse(storedOriginalUser));
        setOriginalRole(storedOriginalRole);
      }
      if (storedDynamicUsers) {
        setDynamicMockUsers(JSON.parse(storedDynamicUsers));
      } else {
        // If not in session storage, initialize it
        sessionStorage.setItem('dynamicMockUsers', JSON.stringify(dynamicMockUsers));
      }
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
      sessionStorage.clear();
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  const login = async (email: string, pass: string): Promise<LoginResult> => {
    // Use the dynamic state for login checks
    const userRecord = Object.values(dynamicMockUsers).find(u => u.user.email.toLowerCase() === email.toLowerCase());

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
        sessionStorage.setItem('dynamicMockUsers', JSON.stringify(dynamicMockUsers));
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
    // This now correctly checks the dynamically updated mockUsers object
    let targetUserRecord = Object.values(dynamicMockUsers).find(u => u.user.email === usernameOrEmail);
    
    // Fallback for parent users who are not in mockUsers
    if (!targetUserRecord && asRole === 'Parent') {
        const parentStudent = Object.values(schoolData)
            .flatMap(s => s.students)
            .find(s => s.parentEmail === usernameOrEmail);
        
        if (parentStudent) {
             targetUserRecord = {
                user: {
                    username: parentStudent.parentEmail,
                    name: parentStudent.parentName,
                    role: 'Parent',
                    email: parentStudent.parentEmail,
                    schoolId: undefined, // Parents are not tied to a single school
                },
                password: 'parent', // Dummy password
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
    <AuthContext.Provider value={{ user, role, login, logout, isLoading, impersonateUser, revertImpersonation, originalUser, originalRole, mockUsers: dynamicMockUsers }}>
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
