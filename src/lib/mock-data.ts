
import { type Role } from "@/context/auth-context";

export interface User {
  username: string;
  name: string;
  email: string;
  role: Role;
}

export const mockUsers: Record<string, { user: User, password: string }> = {
  developer: {
    user: { username: 'developer', name: 'Developer User', role: 'GlobalAdmin', email: 'dev@edudesk.com' },
    password: 'password'
  },
  admin: {
    user: { username: 'admin', name: 'Admin User', role: 'Admin', email: 'admin@edudesk.com' },
    password: 'password'
  },
  teacher: {
    user: { username: 'teacher', name: 'Teacher User', role: 'Teacher', email: 'teacher@edudesk.com' },
    password: 'password'
  },
  student: {
    user: { username: 'student', name: 'Student User', role: 'Student', email: 'student@edudesk.com' },
    password: 'password'
  },
  parent: {
    user: { username: 'parent', name: 'Parent User', role: 'Parent', email: 'parent@edudesk.com' },
    password: 'password'
  },
};

// This can be expanded later
export const initialSchoolData = {};
