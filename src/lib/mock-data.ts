

import { type Role } from "@/context/auth-context";

// --- CORE DATA STRUCTURES ---

export interface User {
  username: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
}

export interface UserProfile {
    user: User;
    password: string;
}

export interface Subscription {
    status: 'Paid' | 'Overdue';
    amount: number;
    dueDate: string;
}

export interface SchoolProfile {
    id: string;
    name: string;
    head: string;
    address: string;
    phone: string;
    email: string;
    motto: string;
    tier: 'Starter' | 'Pro' | 'Premium';
    logoUrl: string;
    certificateTemplateUrl: string;
    transcriptTemplateUrl: string;
    gradingSystem: '20-Point' | 'Letter' | 'GPA';
    currency: 'USD' | 'ZAR' | 'MZN' | 'BWP' | 'NAD' | 'ZMW' | 'MWK' | 'AOA' | 'TZS' | 'ZWL';
    status: 'Active' | 'Suspended' | 'Inactive';
    schoolLevel: 'Primary' | 'Secondary' | 'Full';
    gradeCapacity: Record<string, number>;
    kioskConfig: {
      showDashboard: boolean;
      showLeaderboard: boolean; // This will now be for students
      showTeacherLeaderboard: boolean;
      showAllSchools: boolean;
      showAttendance: boolean;
      showAcademics: boolean;
      showAwards: boolean;
      showPerformers: boolean;
      showAwardWinner: boolean;
      showShowcase: boolean;
    };
    subscription: Subscription;
    awards?: Array<{
        year: number;
        schoolOfTheYear: string; // schoolId
        teacherOfTheYear: string; // teacherId
        studentOfTheYear: string; // studentId
    }>;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    sex: 'Male' | 'Female';
    dateOfBirth: string;
    grade: string;
    class: string;
    parentName: string;
    parentEmail: string;
    status: 'Active' | 'Inactive' | 'Transferred';
    behavioralAssessments: BehavioralAssessment[];
    schoolId?: string; // Added for transfers
    schoolName?: string; // Added for transfers
}

export interface Teacher {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    sex: 'Male' | 'Female';
    subject: string;
    experience: string;
    qualifications: string;
    status: 'Active' | 'Inactive' | 'Transferred';
}

export interface Class {
    id: string;
    name: string;
    grade: string;
    teacher: string;
    students: number;
    room: string;
    headOfClassId?: string; // Optional ID of the teacher who is head of this class
}

export interface Course {
    id: string;
    subject: string;
    teacherId: string;
    classId: string;
    schedule: Array<{ day: string, startTime: string, endTime: string, room: string }>;
}

export interface SyllabusTopic {
    id: string;
    week: number;
    topic: string;
    subtopics: string[];
}
export interface Syllabus {
    id: string;
    subject: string;
    grade: string;
    topics: SyllabusTopic[];
}

export interface Admission {
    id: string;
    type: 'New' | 'Transfer';
    name: string;
    date: string;
    appliedFor: string;
    parentName: string;
    parentEmail: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    dateOfBirth: string;
    sex: 'Male' | 'Female';
    formerSchool: string;
    grades: string;
    // For new applicants
    idUrl?: string;
    reportUrl?: string;
    photoUrl?: string;
    // For transfers
    studentIdToTransfer?: string;
    fromSchoolId?: string;
    reasonForTransfer?: string;
    transferGrade?: string;
}

export interface FinanceRecord {
    id: string;
    studentId: string;
    studentName: string;
    description: string;
    totalAmount: number;
    amountPaid: number;
    dueDate: string;
    status: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
}

export interface Exam {
    id: string;
    title: string;
    subject: string;
    grade: string;
    board: string;
    date: Date;
    time: string;
    duration: string;
    room: string;
    invigilator: string;
}

export interface Grade {
    id: string;
    studentId: string;
    subject: string;
    grade: string;
    date: Date;
    type: 'Coursework' | 'Test' | 'Exam';
    description: string;
    teacherId: string;
}

export interface Attendance {
    id: string;
    studentId: string;
    date: Date;
    status: 'Present' | 'Late' | 'Absent' | 'Sick';
    courseId: string;
}

export interface Event {
    id: string;
    title: string;
    date: Date;
    location: string;
    organizer: string;
    audience: string;
    type: 'Academic' | 'Sports' | 'Cultural' | 'Meeting' | 'Holiday';
    schoolName: string;
}

export interface Expense {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
    proofUrl: string;
    type: 'Income' | 'Expense';
}

export interface Team {
    id: string;
    name: string;
    icon: string;
    coach: string;
    playerIds: string[];
}

export interface Competition {
    id: string;
    title: string;
    ourTeamId: string;
    opponent: string;
    date: Date;
    time: string;
    location: string;
    result?: {
        ourScore: number;
        opponentScore: number;
        outcome: 'Win' | 'Loss' | 'Draw';
    };
}

export interface BehavioralAssessment {
    id: string;
    teacherId: string;
    studentId: string;
    date: Date;
    respect: number;
    participation: number;
    socialSkills: number;
    conduct: number;
    comment?: string;
}

export interface KioskMedia {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  createdAt: Date;
}

export interface ActivityLog {
    id: string;
    timestamp: Date;
    schoolId: string;
    user: string;
    role: Role;
    action: string;
    details: string;
}

export interface Message {
    id: string;
    senderUsername: string;
    senderName: string;
    senderRole: string;
    recipientUsername: string;
    recipientName: string;
    recipientRole: string;
    subject: string;
    body: string;
    timestamp: Date;
    status: 'Pending' | 'Resolved';
    attachmentUrl?: string;
    attachmentName?: string;
}

export interface SavedReport {
    id: string;
    type: 'School-Wide' | 'Class' | 'Struggling Students' | 'Teacher Performance';
    title: string;
    date: Date;
    generatedBy: string;
    content: any;
}

export interface SavedTest {
    id: string;
    teacherId: string;
    subject: string;
    topic: string;
    grade: string;
    questions: Array<{
        question: string;
        options: string[];
        correctAnswer: string;
    }>;
    createdAt: Date;
}

export interface DeployedTest {
    id: string;
    testId: string;
    classId: string;
    deadline: Date;
    submissions: Array<{
        studentId: string;
        score: number;
        submittedAt: Date;
    }>;
}

export interface SchoolData {
    profile: SchoolProfile;
    students: Student[];
    teachers: Teacher[];
    classes: Class[];
    courses: Course[];
    syllabi: Syllabus[];
    admissions: Admission[];
    finance: FinanceRecord[];
    assets: any[];
    exams: Exam[];
    grades: Grade[];
    attendance: Attendance[];
    events: Event[];
    feeDescriptions: string[];
    audiences: string[];
    expenseCategories: string[];
    expenses: Expense[];
    teams: Team[];
    competitions: Competition[];
    terms: any[];
    holidays: any[];
    kioskMedia: KioskMedia[];
    activityLogs: ActivityLog[];
    messages: Message[];
    savedReports: SavedReport[];
    examBoards: string[];
    deployedTests: DeployedTest[];
    lessonPlans: any[];
    savedTests: SavedTest[];
    schoolGroups: Record<string, string[]>;
}

export interface NewMessageData {
    recipientUsername: string;
    subject: string;
    body: string;
    attachmentUrl?: string;
    attachmentName?: string;
    senderName?: string;
    senderRole?: string;
}

export interface NewAdmissionData {
  type: 'New' | 'Transfer';
  schoolId: string;
  name: string;
  dateOfBirth: string;
  sex: 'Male' | 'Female';
  appliedFor: string;
  formerSchool: string;
  gradesSummary: string;
  // For new applicants
  idUrl?: string;
  reportUrl?: string;
  photoUrl?: string;
  // For transfers
  studentIdToTransfer?: string;
  fromSchoolId?: string;
  reasonForTransfer?: string;
  transferGrade?: string;
}

export interface NewSchoolData {
    name: string;
    head: string;
    address: string;
    phone: string;
    email: string;
    motto?: string;
    tier: 'Starter' | 'Pro' | 'Premium';
}

// --- MOCK USERS ---

export const mockUsers: Record<string, UserProfile> = {
  developer: {
    user: { username: 'developer', name: 'Dev Admin', role: 'GlobalAdmin', email: 'dev@edudmanage.com' },
    password: 'password'
  },
  admin1: {
    user: { username: 'admin1', name: 'Amelia Costa', role: 'Admin', email: 'amelia.costa@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  admin2: {
    user: { username: 'admin2', name: 'Beatriz Silva', role: 'Admin', email: 'beatriz.silva@maplewood.edu', schoolId: 'maplewood' },
    password: 'password'
  },
  admin3: {
    user: { username: 'admin3', name: 'Carlos Pereira', role: 'Admin', email: 'carlos.pereira@miniarte.edu', schoolId: 'miniarte' },
    password: 'password'
  },
  teacher1: {
    user: { username: 'teacher1', name: 'Sérgio Almeida', role: 'Teacher', email: 'sergio.almeida@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  teacher2: {
    user: { username: 'teacher2', name: 'Laura Ferreira', role: 'Teacher', email: 'laura.ferreira@maplewood.edu', schoolId: 'maplewood' },
    password: 'password'
  },
  student1: {
    user: { username: 'student1', name: 'Miguel Santos', role: 'Student', email: 'miguel.santos@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  student2: {
    user: { username: 'student2', name: 'Sofia Oliveira', role: 'Student', email: 'sofia.oliveira@maplewood.edu', schoolId: 'maplewood' },
    password: 'password'
  },
  parent1: {
    user: { username: 'parent1', name: 'Ana Santos', role: 'Parent', email: 'ana.santos@email.com', schoolId: 'northwood' },
    password: 'password'
  },
  parent2: {
    user: { username: 'parent2', name: 'Rui Oliveira', role: 'Parent', email: 'rui.oliveira@email.com', schoolId: 'maplewood' },
    password: 'password'
  },
  // New specialized roles for Northwood High
  acdean1: {
    user: { username: 'acdean1', name: 'Helena Gomes', role: 'AcademicDean', email: 'helena.gomes@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  admissions1: {
    user: { username: 'admissions1', name: 'Marco Abreu', role: 'AdmissionsOfficer', email: 'marco.abreu@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  finance1: {
    user: { username: 'finance1', name: 'Fátima Ribeiro', role: 'FinanceOfficer', email: 'fatima.ribeiro@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  counselor1: {
    user: { username: 'counselor1', name: 'David Melo', role: 'Counselor', email: 'david.melo@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  sports1: {
    user: { username: 'sports1', name: 'Vasco Nunes', role: 'SportsDirector', email: 'vasco.nunes@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  itadmin1: {
    user: { username: 'itadmin1', name: 'Juliana Barros', role: 'ITAdmin', email: 'juliana.barros@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
};


// --- MOCK SCHOOL DATA ---

const defaultKioskConfig = {
    showDashboard: true,
    showLeaderboard: true,
    showTeacherLeaderboard: true,
    showAllSchools: true,
    showAttendance: false,
    showAcademics: false,
    showAwards: false,
    showPerformers: false,
    showAwardWinner: false,
    showShowcase: false,
};

const northwoodData: SchoolData = {
    profile: {
        id: 'northwood',
        name: 'Northwood High',
        head: 'Amelia Costa',
        address: 'Av. Julius Nyerere, Maputo',
        phone: '+258 84 123 4567',
        email: 'amelia.costa@northwood.edu',
        motto: 'Excellence in Education',
        tier: 'Pro',
        logoUrl: 'https://placehold.co/100x100.png',
        certificateTemplateUrl: 'https://placehold.co/800x600.png',
        transcriptTemplateUrl: 'https://placehold.co/600x800.png',
        gradingSystem: '20-Point',
        currency: 'MZN',
        status: 'Active',
        schoolLevel: 'Full',
        gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 },
        kioskConfig: defaultKioskConfig,
        subscription: { status: 'Paid', amount: 300, dueDate: '2025-01-01' },
        awards: [],
    },
    students: [
        { id: 'STU001', name: 'Miguel Santos', email: 'miguel.santos@northwood.edu', phone: '840000001', address: 'Rua de Kassuende', sex: 'Male', dateOfBirth: '2008-05-10', grade: '10', class: 'A', parentName: 'Ana Santos', parentEmail: 'ana.santos@email.com', status: 'Active', behavioralAssessments: [] },
        { id: 'STU002', name: 'Inês Pereira', email: 'ines.pereira@northwood.edu', phone: '840000002', address: 'Av. 24 de Julho', sex: 'Female', dateOfBirth: '2008-08-15', grade: '10', class: 'A', parentName: 'João Pereira', parentEmail: 'joao.pereira@email.com', status: 'Active', behavioralAssessments: [] },
        { id: 'STU003', name: 'Tiago Rodrigues', email: 'tiago.rodrigues@northwood.edu', phone: '840000003', address: 'Av. da Marginal', sex: 'Male', dateOfBirth: '2007-01-20', grade: '11', class: 'B', parentName: 'Carla Rodrigues', parentEmail: 'carla.rodrigues@email.com', status: 'Active', behavioralAssessments: [] },
    ],
    teachers: [
        { id: 'T01', name: 'Sérgio Almeida', email: 'sergio.almeida@northwood.edu', phone: '820000001', address: 'Av. da Guerra Popular', sex: 'Male', subject: 'Mathematics', experience: '10 years', qualifications: 'M.Sc. Mathematics', status: 'Active' },
        { id: 'T02', name: 'Catarina Martins', email: 'catarina.martins@northwood.edu', phone: '820000002', address: 'Rua da Argélia', sex: 'Female', subject: 'History', experience: '8 years', qualifications: 'M.A. History', status: 'Active' },
    ],
    classes: [
        { id: 'C01', name: 'Grade 10-A', grade: '10', teacher: 'Sérgio Almeida', students: 30, room: '101' },
        { id: 'C02', name: 'Grade 11-B', grade: '11', teacher: 'Catarina Martins', students: 28, room: '102' },
        { id: 'C03', name: 'Grade 9-C', grade: '9', teacher: 'Sérgio Almeida', students: 25, room: '103' },
    ],
    courses: [
        { id: 'CRS01', subject: 'Mathematics', teacherId: 'T01', classId: 'C01', schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00', room: '101' }] },
        { id: 'CRS02', subject: 'History', teacherId: 'T02', classId: 'C02', schedule: [{ day: 'Tuesday', startTime: '10:00', endTime: '11:00', room: '102' }] },
        { id: 'CRS03', subject: 'Mathematics', teacherId: 'T01', classId: 'C03', schedule: [{ day: 'Wednesday', startTime: '11:00', endTime: '12:00', room: '103' }] },
    ],
    grades: [
        { id: 'G01', studentId: 'STU001', subject: 'Mathematics', grade: '18', date: new Date('2024-03-15T00:00:00Z'), type: 'Test', description: 'Algebra Test', teacherId: 'T01' },
        { id: 'G02', studentId: 'STU002', subject: 'Mathematics', grade: '14', date: new Date('2024-03-15T00:00:00Z'), type: 'Test', description: 'Algebra Test', teacherId: 'T01' },
        { id: 'G03', studentId: 'STU003', subject: 'History', grade: '16', date: new Date('2024-04-10T00:00:00Z'), type: 'Coursework', description: 'WWII Essay', teacherId: 'T02' },
        { id: 'G14', studentId: 'STU202', subject: 'Science', grade: '16', date: new Date('2024-04-12T00:00:00Z'), type: 'Test', description: 'Biology Mid-Term', teacherId: 'T12' },
    ],
    finance: [
        { id: 'FIN01', studentId: 'STU001', studentName: 'Miguel Santos', description: 'Term 1 Tuition', totalAmount: 50000, amountPaid: 50000, dueDate: '2024-02-01', status: 'Paid' },
        { id: 'FIN02', studentId: 'STU002', studentName: 'Inês Pereira', description: 'Term 1 Tuition', totalAmount: 50000, amountPaid: 25000, dueDate: '2024-02-01', status: 'Partially Paid' },
        { id: 'FIN03', studentId: 'STU003', studentName: 'Tiago Rodrigues', description: 'Term 2 Tuition', totalAmount: 50000, amountPaid: 0, dueDate: '2024-05-01', status: 'Pending' },
    ],
    activityLogs: [
        { id: 'LOG001', timestamp: new Date('2024-05-20T10:00:00Z'), schoolId: 'northwood', user: 'Amelia Costa', role: 'Admin', action: 'Update', details: 'Updated school profile.' },
        { id: 'LOG002', timestamp: new Date('2024-05-19T14:30:00Z'), schoolId: 'northwood', user: 'Sérgio Almeida', role: 'Teacher', action: 'Create', details: 'Added new grade for Miguel Santos.' },
    ],
    savedTests: [
        { id: 'ST01', teacherId: 'T01', subject: 'Mathematics', topic: 'Algebra Basics', grade: '10', createdAt: new Date(), questions: [
            { question: 'What is 2 + 2?', options: ['3', '4', '5'], correctAnswer: '4' },
            { question: 'What is x in x + 5 = 10?', options: ['3', '4', '5'], correctAnswer: '5' },
        ]},
    ],
    deployedTests: [
        { id: 'DT01', testId: 'ST01', classId: 'C01', deadline: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), submissions: [] }
    ],
    syllabi: [], admissions: [], assets: [], exams: [], attendance: [], events: [], feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform'], audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'], expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], messages: [], savedReports: [], examBoards: ['Internal', 'Cambridge', 'IEB'], lessonPlans: [], schoolGroups: {}
};

const maplewoodData: SchoolData = {
    profile: {
        id: 'maplewood',
        name: 'Maplewood Academy',
        head: 'Beatriz Silva',
        address: 'Av. da Paz, Matola',
        phone: '+258 82 987 6543',
        email: 'beatriz.silva@maplewood.edu',
        motto: 'Knowledge and Virtue',
        tier: 'Starter',
        logoUrl: 'https://placehold.co/100x100.png',
        certificateTemplateUrl: 'https://placehold.co/800x600.png',
        transcriptTemplateUrl: 'https://placehold.co/600x800.png',
        gradingSystem: 'Letter',
        currency: 'ZAR',
        status: 'Active',
        schoolLevel: 'Secondary',
        gradeCapacity: { "8": 30, "9": 30, "10": 30, "11": 35, "12": 35 },
        kioskConfig: defaultKioskConfig,
        subscription: { status: 'Overdue', amount: 150, dueDate: '2024-05-01' },
        awards: [],
    },
    students: [
        { id: 'STU101', name: 'Sofia Oliveira', email: 'sofia.oliveira@maplewood.edu', phone: '820000101', address: 'Rua do Comércio', sex: 'Female', dateOfBirth: '2007-11-22', grade: '11', class: 'A', parentName: 'Rui Oliveira', parentEmail: 'rui.oliveira@email.com', status: 'Active', behavioralAssessments: [] },
        { id: 'STU102', name: 'Diogo Costa', email: 'diogo.costa@maplewood.edu', phone: '820000102', address: 'Av. do Trabalho', sex: 'Male', dateOfBirth: '2007-03-30', grade: '11', class: 'A', parentName: 'Mariana Costa', parentEmail: 'mariana.costa@email.com', status: 'Active', behavioralAssessments: [] },
        { id: 'STU201', name: 'Lucia Santos', email: 'lucia.santos@maplewood.edu', phone: '840000201', address: 'Rua de Kassuende', sex: 'Female', dateOfBirth: '2010-02-12', grade: '8', class: 'B', parentName: 'Ana Santos', parentEmail: 'ana.santos@email.com', status: 'Active', behavioralAssessments: [] },
        { id: 'STU202', name: 'Pedro Santos', email: 'pedro.santos@maplewood.edu', phone: '840000202', address: 'Rua de Kassuende', sex: 'Male', dateOfBirth: '2009-07-05', grade: '9', class: 'C', parentName: 'Ana Santos', parentEmail: 'ana.santos@email.com', status: 'Transferred', behavioralAssessments: [] }
    ],
    teachers: [
        { id: 'T11', name: 'Laura Ferreira', email: 'laura.ferreira@maplewood.edu', phone: '840000011', address: 'Bairro do Jardim', sex: 'Female', subject: 'English', experience: '12 years', qualifications: 'Ph.D. English Literature', status: 'Active' },
        { id: 'T12', name: 'André Sousa', email: 'andre.sousa@maplewood.edu', phone: '840000012', address: 'Bairro Central', sex: 'Male', subject: 'Science', experience: '6 years', qualifications: 'B.Sc. Biology', status: 'Active' },
    ],
    classes: [
        { id: 'C11', name: 'Grade 11-A', grade: '11', teacher: 'Laura Ferreira', students: 25, room: 'A1' },
        { id: 'C12', name: 'Grade 8-B', grade: '8', teacher: 'André Sousa', students: 28, room: 'B2' },
        { id: 'C13', name: 'Grade 9-C', grade: '9', teacher: 'André Sousa', students: 22, room: 'B3' },
    ],
    courses: [
        { id: 'CRS11', subject: 'English', teacherId: 'T11', classId: 'C11', schedule: [{ day: 'Monday', startTime: '11:00', endTime: '12:00', room: 'A1' }] },
        { id: 'CRS12', subject: 'Science', teacherId: 'T12', classId: 'C12', schedule: [{ day: 'Thursday', startTime: '09:00', endTime: '10:00', room: 'B2' }] },
        { id: 'CRS13', subject: 'Science', teacherId: 'T12', classId: 'C13', schedule: [{ day: 'Friday', startTime: '10:00', endTime: '11:00', room: 'B3' }] },
    ],
    grades: [
        { id: 'G11', studentId: 'STU101', subject: 'English', grade: '19', date: new Date('2024-04-01T00:00:00Z'), type: 'Coursework', description: 'Shakespeare Essay', teacherId: 'T11' },
        { id: 'G12', studentId: 'STU102', subject: 'English', grade: '15', date: new Date('2024-04-01T00:00:00Z'), type: 'Coursework', description: 'Shakespeare Essay', teacherId: 'T11' },
        { id: 'G13', studentId: 'STU201', subject: 'Science', grade: '11', date: new Date('2024-04-05T00:00:00Z'), type: 'Test', description: 'Lab Safety Quiz', teacherId: 'T12' },
    ],
    finance: [
        { id: 'FIN11', studentId: 'STU101', studentName: 'Sofia Oliveira', description: 'Annual Fees', totalAmount: 85000, amountPaid: 85000, dueDate: '2024-01-30', status: 'Paid' },
        { id: 'FIN12', studentId: 'STU201', studentName: 'Lucia Santos', description: 'Term 1 Tuition', totalAmount: 30000, amountPaid: 30000, dueDate: '2024-02-15', status: 'Paid' },
        { id: 'FIN13', studentId: 'STU202', studentName: 'Pedro Santos', description: 'Term 1 Tuition', totalAmount: 30000, amountPaid: 30000, dueDate: '2024-02-15', status: 'Paid' },
    ],
    activityLogs: [
        { id: 'LOG101', timestamp: new Date('2024-05-18T09:00:00Z'), schoolId: 'maplewood', user: 'Beatriz Silva', role: 'Admin', action: 'Create', details: 'Added new team: Varsity Lions' }
    ],
    syllabi: [], admissions: [], assets: [], exams: [], attendance: [], events: [], feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform'], audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'], expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], messages: [], savedReports: [], examBoards: ['Internal', 'Cambridge', 'IEB'], deployedTests: [], lessonPlans: [], savedTests: [], schoolGroups: {}
};

const miniArteData: SchoolData = {
    profile: {
        id: 'miniarte',
        name: 'MiniArte Creative School',
        head: 'Carlos Pereira',
        address: 'Rua da Cultura, Beira',
        phone: '+258 86 111 2233',
        email: 'carlos.pereira@miniarte.edu',
        motto: 'Creating the Future',
        tier: 'Premium',
        logoUrl: 'https://placehold.co/100x100.png',
        certificateTemplateUrl: 'https://placehold.co/800x600.png',
        transcriptTemplateUrl: 'https://placehold.co/600x800.png',
        gradingSystem: '20-Point',
        currency: 'USD',
        status: 'Active',
        schoolLevel: 'Full',
        gradeCapacity: { "1": 20, "2": 20, "3": 20, "4": 25, "5": 25, "6": 25, "7": 30, "8": 30, "9": 30, "10": 30, "11": 30, "12": 30 },
        kioskConfig: defaultKioskConfig,
        subscription: { status: 'Paid', amount: 500, dueDate: '2025-01-01' },
        awards: [],
    },
    students: [],
    teachers: [],
    classes: [],
    courses: [],
    grades: [],
    finance: [],
    schoolGroups: {
      'miniarte_group': ['miniarte', 'miniarte_matola', 'miniarte_beira'],
    },
    activityLogs: [],
    syllabi: [], admissions: [], assets: [], exams: [], attendance: [], events: [], feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform'], audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'], expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], messages: [], savedReports: [], examBoards: ['Internal', 'Cambridge', 'IEB'], deployedTests: [], lessonPlans: [], savedTests: []
};

const miniArteMatolaData: SchoolData = {
  ...miniArteData,
  profile: {
    ...miniArteData.profile,
    id: 'miniarte_matola',
    name: 'MiniArte Matola Campus',
    head: 'Isabel Rocha',
    address: 'Bairro Tsalala, Matola',
    email: 'isabel.rocha@miniarte.edu',
    kioskConfig: defaultKioskConfig,
    subscription: { status: 'Paid', amount: 250, dueDate: '2025-01-01' },
    awards: [],
  },
  schoolGroups: {},
  activityLogs: [],
};

const miniArteBeiraData: SchoolData = {
  ...miniArteData,
  profile: {
    ...miniArteData.profile,
    id: 'miniarte_beira',
    name: 'MiniArte Beira Campus',
    head: 'Pedro Gonçalves',
    address: 'Bairro da Ponta Gêa, Beira',
    email: 'pedro.goncalves@miniarte.edu',
    kioskConfig: defaultKioskConfig,
    subscription: { status: 'Paid', amount: 250, dueDate: '2025-01-01' },
    awards: [],
  },
  schoolGroups: {},
  activityLogs: [],
};

export const initialSchoolData: Record<string, SchoolData> = {
    'northwood': northwoodData,
    'maplewood': maplewoodData,
    'miniarte': miniArteData,
    'miniarte_matola': miniArteMatolaData,
    'miniarte_beira': miniArteBeiraData,
};
