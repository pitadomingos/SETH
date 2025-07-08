
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { schoolData } from '@/lib/mock-data';

export type Role = 'GlobalAdmin' | 'PremiumAdmin' | 'Admin' | 'Teacher' | 'Student' | 'Parent';

interface User {
  username: string;
  name: string;
  email: string;
  schoolId?: string;
  groupId?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  role: Exclude<Role, null>;
}

interface LoginResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  role: Role | null;
  user: User | null;
  originalUser: User | null;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: () => void;
  isLoading: boolean;
  impersonateUser: (username: string) => Promise<LoginResult>;
  revertToGlobalAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const mockUsers: Record<string, { user: User, role: Role }> = {
  developer: { user: { username: 'developer', name: 'App Developer', email: 'dev@edumanage.app' }, role: 'GlobalAdmin' },
  admin1: { user: { username: 'admin1', name: 'Dr. Sarah Johnson', email: 's.johnson@northwood.edu', schoolId: 'northwood' }, role: 'Admin' },
  teacher1: { user: { username: 'teacher1', name: 'Prof. Michael Chen', email: 'm.chen@edumanage.com', schoolId: 'northwood' }, role: 'Teacher' },
  student1: { user: { username: 'student1', name: 'Emma Rodriguez', email: 'e.rodriguez@edumanage.com', schoolId: 'northwood' }, role: 'Student' },
  parent1: { user: { username: 'parent1', name: 'Maria Rodriguez', email: 'm.rodriguez@family.com' }, role: 'Parent' },
  admin2: { user: { username: 'admin2', name: 'Mr. James Maxwell', email: 'j.maxwell@oakridge.edu', schoolId: 'oakridge' }, role: 'Admin' },
  teacher2: { user: { username: 'teacher2', name: 'Ms. Rachel Adams', email: 'r.adams@oakridge.edu', schoolId: 'oakridge' }, role: 'Teacher' },
  student2: { user: { username: 'student2', name: 'Benjamin Carter', email: 'b.carter@oakridge.com', schoolId: 'oakridge' }, role: 'Student' },
  admin3: { user: { username: 'admin3', name: 'Ms. Eleanor Vance', email: 'e.vance@maplewood.edu', schoolId: 'maplewood' }, role: 'Admin' },
  teacher3: { user: { username: 'teacher3', name: 'Mr. David Lee', email: 'd.lee@maplewood.edu', schoolId: 'maplewood' }, role: 'Teacher' },
  student3: { user: { username: 'student3', name: 'Chloe Dubois', email: 'c.dubois@maplewood.edu', schoolId: 'maplewood' }, role: 'Student' },
  student4: { user: { username: 'student4', name: 'William Miller', email: 'w.miller@edumanage.com', schoolId: 'northwood' }, role: 'Student' },
  admin4: { user: { username: 'admin4', name: 'Richard Branson', email: 'r.branson@educorp.com', groupId: 'educorp' }, role: 'PremiumAdmin' },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [originalRole, setOriginalRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('userRole') as Role;
      const savedOriginalUser = localStorage.getItem('originalUser');
      const savedOriginalRole = localStorage.getItem('originalRole') as Role;

      if (savedUser && savedRole) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(savedRole);
      }
       if (savedOriginalUser && savedOriginalRole) {
        setOriginalUser(JSON.parse(savedOriginalUser));
        setOriginalRole(savedOriginalRole);
      }
    } catch (e) {
      console.error("Local storage is not available or data is corrupted.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (creds: LoginCredentials): Promise<LoginResult> => {
    const userRecord = mockUsers[creds.username.toLowerCase()];
    
    if (!userRecord || userRecord.role !== creds.role) {
      return { success: false, message: 'Invalid credentials. Please check the demo credentials and try again.' };
    }
    
    const schoolId = userRecord.user.schoolId;
    if (schoolId && schoolData[schoolId]) {
        const schoolStatus = schoolData[schoolId].profile.status;
        if ((schoolStatus === 'Suspended' || schoolStatus === 'Inactive') && creds.role !== 'Admin' && creds.role !== 'GlobalAdmin') {
            return { success: false, message: `Your school's account is ${schoolStatus}. Please contact your school administrator.` };
        }
    }


    let correctPassword = '';
    switch (creds.role) {
      case 'GlobalAdmin': correctPassword = 'dev123'; break;
      case 'PremiumAdmin': correctPassword = 'admin123'; break;
      case 'Admin': correctPassword = 'admin123'; break;
      case 'Teacher': correctPassword = 'teacher123'; break;
      case 'Student': correctPassword = 'student123'; break;
      case 'Parent': correctPassword = 'parent123'; break;
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
      return { success: true };
    }
    
    return { success: false, message: 'Invalid credentials. Please check the demo credentials and try again.' };
  };

  const logout = () => {
    setRole(null);
    setUser(null);
    setOriginalUser(null);
    setOriginalRole(null);
    try {
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      localStorage.removeItem('originalUser');
      localStorage.removeItem('originalRole');
      window.location.href = '/';
    } catch (e) {
      console.error("Local storage is not available.");
    }
  };

  const impersonateUser = async (username: string): Promise<LoginResult> => {
    const effectiveRole = originalRole || role;
    if (effectiveRole !== 'GlobalAdmin' && effectiveRole !== 'PremiumAdmin') {
        return { success: false, message: 'Only administrators can impersonate users.' };
    }

    const userRecord = mockUsers[username.toLowerCase()];
    if (!userRecord) {
        return { success: false, message: 'User not found.' };
    }

    if (!originalUser && user) {
        setOriginalUser(user);
        setOriginalRole(role);
        try {
            localStorage.setItem('originalUser', JSON.stringify(user));
            localStorage.setItem('originalRole', role || '');
        } catch (e) { console.error("Local storage is not available."); }
    }

    const { user: targetUser, role: targetRole } = userRecord;
    setUser(targetUser);
    setRole(targetRole);
    try {
        localStorage.setItem('user', JSON.stringify(targetUser));
        localStorage.setItem('userRole', targetRole);
        router.push('/dashboard');
    } catch (e) { console.error("Local storage is not available."); }

    return { success: true };
  };


  const revertToGlobalAdmin = () => {
    if (originalUser && originalRole) {
      setUser(originalUser);
      setRole(originalRole);
      try {
        localStorage.setItem('user', JSON.stringify(originalUser));
        localStorage.setItem('userRole', originalRole);
        localStorage.removeItem('originalUser');
        localStorage.removeItem('originalRole');
      } catch (e) {
        console.error("Local storage is not available.");
      }

      setOriginalUser(null);
      setOriginalRole(null);
      
      const dashboardPath = originalRole === 'PremiumAdmin' ? '/dashboard/premium-admin' : '/dashboard/global-admin';
      router.push(dashboardPath);
    }
  };

  return (
    <AuthContext.Provider value={{ role, user, originalUser, login, logout, isLoading, impersonateUser, revertToGlobalAdmin }}>
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
