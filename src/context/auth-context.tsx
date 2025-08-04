
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { mockUsers, UserProfile } from '@/lib/mock-data';
import { getUsersFromFirestore } from '@/lib/firebase/firestore-service';

export type Role = 'GlobalAdmin' | 'Admin' | 'Teacher' | 'Student' | 'Parent';

export interface User {
  username: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
  profilePictureUrl?: string;
  phone?: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  schoolId: string | null;
  originalUser: User | null;
  login: (username: string, pass: string) => Promise<LoginResult>;
  logout: () => void;
  isLoading: boolean;
  impersonateUser: (email: string, role: Role) => void;
  addUser: (username: string, profile: UserProfile) => void;
  setUserProfilePicture: (url: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<Record<string, UserProfile>>({});
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = sessionStorage.getItem('user');
      const storedRole = sessionStorage.getItem('role') as Role;
      const storedSchoolId = sessionStorage.getItem('schoolId');
      const storedOriginalUser = sessionStorage.getItem('originalUser');
      
      if (storedUser && storedRole) {
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
        setSchoolId(storedSchoolId);
      }
      if(storedOriginalUser) {
        setOriginalUser(JSON.parse(storedOriginalUser));
      }
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
      sessionStorage.clear();
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pass: string): Promise<LoginResult> => {
    // On login, always fetch the freshest user list from the database
    const firestoreUsers = await getUsersFromFirestore();
    const userSource = Object.keys(firestoreUsers).length > 0 ? firestoreUsers : mockUsers;

    const userRecord = userSource[username];
    if (userRecord && userRecord.password === pass) {
      const loggedInUser: User = {
          ...userRecord.user,
          profilePictureUrl: `https://placehold.co/200x200.png?text=${userRecord.user.name.split(' ').map(n=>n[0]).join('')}`
      };
      setUser(loggedInUser);
      setRole(loggedInUser.role);
      setSchoolId(loggedInUser.schoolId || null);
      sessionStorage.setItem('user', JSON.stringify(loggedInUser));
      sessionStorage.setItem('role', loggedInUser.role);
      if (loggedInUser.schoolId) {
          sessionStorage.setItem('schoolId', loggedInUser.schoolId);
      }
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const setUserProfilePicture = (url: string) => {
      if(user) {
          const updatedUser = { ...user, profilePictureUrl: url };
          setUser(updatedUser);
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }
  };
  
  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // This function is now mostly for client-side state updates after the DB has been written to.
  const addUser = (username: string, profile: UserProfile) => {
    setUsers(prev => ({...prev, [username]: profile }));
  }
  
  const impersonateUser = async (email: string, targetRole: Role) => {
    if (!user) return;

    if (!sessionStorage.getItem('originalUser')) {
        setOriginalUser(user);
        sessionStorage.setItem('originalUser', JSON.stringify(user));
    }

    // Always fetch the freshest user list from the database before impersonating
    let allUsers = await getUsersFromFirestore();
    if (Object.keys(allUsers).length === 0) {
      allUsers = mockUsers;
    }

    const userRecord = Object.values(allUsers).find(u => u.user.email === email && u.user.role === targetRole);
    
    if (userRecord) {
        const targetUser: User = {
          ...userRecord.user,
          profilePictureUrl: `https://placehold.co/200x200.png?text=${userRecord.user.name.split(' ').map(n=>n[0]).join('')}`
        };
        setUser(targetUser);
        setRole(targetUser.role);
        setSchoolId(targetUser.schoolId || null);
        sessionStorage.setItem('user', JSON.stringify(targetUser));
        sessionStorage.setItem('role', targetUser.role);
        if (targetUser.schoolId) {
            sessionStorage.setItem('schoolId', targetUser.schoolId);
        } else {
            sessionStorage.removeItem('schoolId');
        }
        router.push('/dashboard');
    } else {
        console.error(`Impersonation failed: Could not find user with email ${email} and role ${targetRole}`);
    }
  };

  const logout = () => {
    const originalUserString = sessionStorage.getItem('originalUser');
    if(originalUserString) {
        const parsedOriginalUser = JSON.parse(originalUserString);
        setUser(parsedOriginalUser);
        setRole(parsedOriginalUser.role);
        setSchoolId(parsedOriginalUser.schoolId || null);
        setOriginalUser(null);
        
        sessionStorage.setItem('user', originalUserString);
        sessionStorage.setItem('role', parsedOriginalUser.role);
        if (parsedOriginalUser.schoolId) {
          sessionStorage.setItem('schoolId', parsedOriginalUser.schoolId);
        } else {
          sessionStorage.removeItem('schoolId');
        }

        sessionStorage.removeItem('originalUser');
        router.push('/dashboard/global-admin/all-schools');
    } else {
        setUser(null);
        setRole(null);
        setSchoolId(null);
        setOriginalUser(null);
        sessionStorage.clear();
        router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, schoolId, originalUser, login, logout, isLoading, impersonateUser, addUser, setUserProfilePicture, updateUserProfile }}>
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
