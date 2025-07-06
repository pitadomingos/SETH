

import { type CreateLessonPlanOutput } from "@/ai/flows/create-lesson-plan";
import { type GenerateTestOutput } from "@/ai/flows/generate-test";
import { type Role } from "@/context/auth-context";

export interface FinanceRecord { id: string; studentId: string; studentName: string; description: string; totalAmount: number; amountPaid: number; dueDate: string; }
export interface Expense { id: string; description: string; category: string; amount: number; date: string; proofUrl: string; }
export interface Team { id: string; name: string; coach: string; playerIds: string[]; icon: string; }
export interface Competition { id: string; title: string; ourTeamId: string; opponent: string; date: Date; time: string; location: string; }
export interface AcademicTerm { id: string; name: string; startDate: Date; endDate: Date; }
export interface Holiday { id: string; name: string; date: Date; }
export interface Course {
  id: string;
  subject: string;
  teacherId: string;
  classId: string;
  schedule: Array<{ day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'; startTime: string; endTime: string; room: string; }>;
}
export interface LessonPlan extends CreateLessonPlanOutput {
  id: string;
  className: string;
  subject: string;
  createdAt: Date;
  weeklySyllabus: string;
}

export interface SavedTest extends GenerateTestOutput {
    id: string;
    subject: string;
    topic: string;
    gradeLevel: string;
    createdAt: Date;
}

export interface DeployedTest {
  id: string;
  testId: string; // Corresponds to SavedTest id
  classId: string;
  deadline: Date;
  createdAt: Date;
  submissions: Array<{
    studentId: string;
    answers: Record<number, string>; // question index -> selected option
    score: number; // Score out of 20
    submittedAt: Date;
  }>;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  schoolId: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface Message {
  id: string;
  timestamp: Date;
  schoolId: string;
  fromUserName: string;
  fromUserRole: Role;
  to: 'Admin' | 'Developer' | string; // Role name or specific user ID
  subject: string;
  body: string;
  status: 'Pending' | 'Resolved';
  attachmentUrl?: string;
  attachmentName?: string;
}

interface SchoolData {
    profile: SchoolProfile;
    students: Student[];
    teachers: Teacher[];
    classes: Class[];
    courses: Course[];
    lessonPlans: LessonPlan[];
    savedTests: SavedTest[];
    deployedTests: DeployedTest[];
    admissions: Admission[];
    exams: Exam[];
    finance: FinanceRecord[];
    assets: Asset[];
    assignments: Assignment[];
    grades: Grade[];
    attendance: Attendance[];
    events: SchoolEvent[];
    feeDescriptions: string[];
    audiences: string[];
    expenseCategories: string[];
    expenses: Expense[];
    teams: Team[];
    competitions: Competition[];
    terms: AcademicTerm[];
    holidays: Holiday[];
    activityLogs: ActivityLog[];
    messages: Message[];
}

export interface SchoolProfile { id: string; name: string; head: string; address: string; phone: string; email: string; motto: string; logoUrl: string; tier?: 'Premium' | 'Pro' | 'Starter'; gradingSystem: '20-Point' | 'GPA' | 'Letter'; currency: 'USD' | 'ZAR' | 'MZN'; status: 'Active' | 'Suspended' | 'Inactive'; gradeCapacity: Record<string, number>; }
export interface Student { id: string; name: string; grade: string; class: string; email: string; phone: string; address: string; schoolId?: string; schoolName?: string; parentName: string; parentEmail: string; dateOfBirth: string; status: 'Active' | 'Inactive' | 'Transferred'; sex: 'Male' | 'Female'; }
export interface Teacher { id: string; name: string; subject: string; email: string; phone: string; address: string; experience: string; qualifications: string; status: 'Active' | 'Inactive' | 'Transferred'; sex: 'Male' | 'Female'; }
export interface Class { id: string; name: string; grade: string; teacher: string; students: number; room: string; }
export interface Admission { id: string; name: string; appliedFor: string; date: string; status: 'Pending' | 'Approved' | 'Rejected'; formerSchool: string; grades: string; parentName: string; parentEmail: string; dateOfBirth: string; sex: 'Male' | 'Female'; }
interface Exam { id: string; title: string; subject: string; grade: string; date: Date; time: string; duration: string; room: string; board: string; }
interface Asset { id: string; name: string; category: string; status: 'In Use' | 'Available' | 'Maintenance'; location: string; assignedTo: string; }
interface Assignment { id: string; title: string; subject: string; grade: string; dueDate: string; status: 'pending' | 'submitted' | 'overdue'; }
export interface Grade { studentId: string; subject: string; grade: string; date: Date; }
interface Attendance { studentId: string; date: string; status: string; }
export interface SchoolEvent { id: string; date: Date; title: string; type: string; location: string; organizer: string; audience: string; schoolName?: string; }

const now = new Date();
const currentYear = now.getFullYear();

const defaultGradeCapacity = { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 };

// --- Data for School 1: Northwood High ---
const northwoodProfile: SchoolProfile = { id: 'northwood', name: 'Northwood High School', head: 'Dr. Sarah Johnson', address: '123 Education Lane, Anytown, USA 12345', phone: '+1 (555) 123-4567', email: 'contact@northwoodhigh.edu', motto: 'Excellence in Education', logoUrl: 'https://placehold.co/100x100.png', tier: 'Starter', gradingSystem: '20-Point', currency: 'USD', status: 'Active', gradeCapacity: defaultGradeCapacity };
const northwoodStudents: Student[] = [ { id: 'S001', name: 'Emma Rodriguez', grade: '10', class: 'A', email: 'e.rodriguez@edumanage.com', phone: '+1 (555) 555-1234', address: '123 Main St, Anytown', parentName: 'Maria Rodriguez', parentEmail: 'm.rodriguez@family.com', dateOfBirth: '2008-05-21', status: 'Active', sex: 'Female' }, { id: 'S002', name: 'James Wilson', grade: '10', class: 'A', email: 'j.wilson@edumanage.com', phone: '+1 (555) 555-5678', address: '456 Oak Ave, Anytown', parentName: 'Robert Wilson', parentEmail: 'r.wilson@family.com', dateOfBirth: '2008-03-15', status: 'Active', sex: 'Male' }, { id: 'S003', name: 'Sofia Kim', grade: '11', class: 'B', email: 's.kim@edumanage.com', phone: '+1 (555) 555-9012', address: '789 Pine Rd, Anytown', parentName: 'Daniel Kim', parentEmail: 'd.kim@family.com', dateOfBirth: '2007-11-30', status: 'Active', sex: 'Female' }, { id: 'S004', name: 'Alex Johnson', grade: '9', class: 'C', email: 'a.johnson@edumanage.com', phone: '+1 (555) 555-3456', address: '321 Elm St, Anytown', parentName: 'Jessica Johnson', parentEmail: 'j.johnson@family.com', dateOfBirth: '2009-08-10', status: 'Active', sex: 'Male' }, { id: 'S005', name: 'Olivia Chen', grade: '12', class: 'A', email: 'o.chen@edumanage.com', phone: '+1 (555) 555-7890', address: '159 Maple Dr, Anytown', parentName: 'Wei Chen', parentEmail: 'w.chen@family.com', dateOfBirth: '2006-01-25', status: 'Active', sex: 'Female' }, { id: 'S006', name: 'Liam Garcia', grade: '9', class: 'A', email: 'l.garcia@edumanage.com', phone: '+1 (555) 555-1122', address: '753 Birch Ln, Anytown', parentName: 'Isabella Garcia', parentEmail: 'i.garcia@family.com', dateOfBirth: '2009-06-12', status: 'Active', sex: 'Male' }, { id: 'S007', name: 'Ava Martinez', grade: '11', class: 'A', email: 'a.martinez@edumanage.com', phone: '+1 (555) 555-3344', address: '951 Cedar Ct, Anytown', parentName: 'David Martinez', parentEmail: 'd.martinez@family.com', dateOfBirth: '2007-09-05', status: 'Active', sex: 'Female' }, { id: 'S008', name: 'Noah Brown', grade: '10', class: 'B', email: 'n.brown@edumanage.com', phone: '+1 (555) 555-5566', address: '852 Spruce Ave, Anytown', parentName: 'Linda Brown', parentEmail: 'l.brown@family.com', dateOfBirth: '2008-07-22', status: 'Active', sex: 'Male' }, { id: 'S009', name: 'Sophia Davis', grade: '9', class: 'B', email: 's.davis@edumanage.com', phone: '+1 (555) 555-7788', address: '147 Walnut St, Anytown', parentName: 'Paul Davis', parentEmail: 'p.davis@family.com', dateOfBirth: '2009-02-18', status: 'Active', sex: 'Female' }, { id: 'S010', name: 'William Miller', grade: '12', class: 'C', email: 'w.miller@edumanage.com', phone: '+1 (555) 555-9999', address: '456 Failure Ave, Anytown', parentName: 'George Miller', parentEmail: 'g.miller@family.com', dateOfBirth: '2006-04-01', status: 'Active', sex: 'Male' }, ];
const northwoodTeachers: Teacher[] = [ { id: 'T001', name: 'Prof. Michael Chen', subject: 'Mathematics', email: 'm.chen@edumanage.com', phone: '+1 (555) 111-2222', address: '123 Calculus Rd, Mathville', experience: '8 years', qualifications: 'Ph.D. in Mathematics', status: 'Active', sex: 'Male' }, { id: 'T002', name: 'Dr. Lisa Anderson', subject: 'Physics', email: 'l.anderson@edumanage.com', phone: '+1 (555) 222-3333', address: '456 Quantum Way, Physburg', experience: '12 years', qualifications: 'Ph.D. in Physics', status: 'Inactive', sex: 'Female' }, { id: 'T003', name: 'Ms. Jennifer Davis', subject: 'English', email: 'j.davis@northwood.edu', phone: '+1 (555) 111-3333', address: '101 Literature Lane', experience: '5 years', qualifications: 'M.A. in English', status: 'Active', sex: 'Female' }, ];
const northwoodClasses: Class[] = [ { id: 'C001', name: 'Class 9-A', grade: '9', teacher: 'Ms. Jennifer Davis', students: 28, room: '101' }, { id: 'C002', name: 'Class 9-C', grade: '9', teacher: 'Prof. Michael Chen', students: 22, room: '103' }, { id: 'C003', name: 'Class 10-A', grade: '10', teacher: 'Prof. Michael Chen', students: 30, room: '201' }, { id: 'C004', name: 'Class 11-B', grade: '11', teacher: 'Dr. Lisa Anderson', students: 25, room: '301' }, ];
const northwoodTeams: Team[] = [ { id: 'TEAM01', name: 'Basketball Varsity', coach: 'Prof. Michael Chen', playerIds: ['S002', 'S005', 'S008'], icon: '🏀' }, { id: 'TEAM02', name: 'Football Eagles', coach: 'Ms. Jennifer Davis', playerIds: ['S001', 'S004', 'S006', 'S007'], icon: '🏈' }, { id: 'TEAM03', name: 'Swim Team Sharks', coach: 'Dr. Lisa Anderson', playerIds: ['S003'], icon: '🏊' }, ];
const northwoodCompetitions: Competition[] = [ { id: 'COMP01', title: 'Championship Game', ourTeamId: 'TEAM01', opponent: 'Southside Serpents', date: new Date(new Date().setDate(new Date().getDate() + 12)), time: '18:00', location: 'Home Gymnasium' }, { id: 'COMP02', title: 'Away Match', ourTeamId: 'TEAM02', opponent: 'Oakridge Oaks', date: new Date(new Date().setDate(new Date().getDate() + 25)), time: '15:30', location: 'Oakridge Academy Field' }, ];
const northwoodGrades: Grade[] = [ { studentId: 'S001', subject: 'Mathematics', grade: '17', date: new Date(now.getFullYear(), now.getMonth() - 2) }, { studentId: 'S001', subject: 'Physics', grade: '16', date: new Date(now.getFullYear(), now.getMonth() - 2) }, { studentId: 'S001', subject: 'English', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 2) }, { studentId: 'S002', subject: 'Mathematics', grade: '14', date: new Date(now.getFullYear(), now.getMonth() - 1) }, { studentId: 'S002', subject: 'Physics', grade: '14', date: new Date(now.getFullYear(), now.getMonth() - 1) }, { studentId: 'S003', subject: 'English', grade: '20', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S003', subject: 'Physics', grade: '19', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S004', subject: 'English', grade: '15', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S005', subject: 'Mathematics', grade: '20', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S006', subject: 'English', grade: '12', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S007', subject: 'Physics', grade: '17', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S008', subject: 'Mathematics', grade: '15', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S009', subject: 'English', grade: '18', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S009', subject: 'Mathematics', grade: '18', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S010', subject: 'Mathematics', grade: '5', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S010', subject: 'Physics', grade: '8', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S010', subject: 'English', grade: '8', date: new Date(now.getFullYear(), now.getMonth()) }, ];
const northwoodAttendance: Attendance[] = northwoodStudents.flatMap(student => { return Array.from({length: 30}).map((_, i) => { const date = new Date(); date.setDate(date.getDate() - i); let rand = Math.random(); if(student.id === 'S010') { rand = Math.random() * 0.5; } let status = 'present'; if (rand > 0.95) status = 'absent'; else if (rand > 0.9) status = 'late'; return { studentId: student.id, date: date.toISOString().split('T')[0], status }; }); });
const northwoodFinance: FinanceRecord[] = [ { id: 'FEE001', studentId: 'S001', studentName: 'Emma Rodriguez', description: 'Term 1 Tuition', totalAmount: 1200, amountPaid: 1200, dueDate: '2024-08-31' }, { id: 'FEE002', studentId: 'S002', studentName: 'James Wilson', description: 'Term 1 Tuition', totalAmount: 1200, amountPaid: 500, dueDate: '2024-08-31' }, { id: 'FEE003', studentId: 'S003', studentName: 'Sofia Kim', description: 'Term 1 Tuition', totalAmount: 1500, amountPaid: 0, dueDate: '2024-07-31' }, { id: 'FEE004', studentId: 'S009', studentName: 'Sophia Davis', description: 'Term 1 Tuition', totalAmount: 1200, amountPaid: 1200, dueDate: '2024-08-31' }, { id: 'FEE005', studentId: 'S001', studentName: 'Emma Rodriguez', description: 'Lab Fees', totalAmount: 150, amountPaid: 150, dueDate: '2024-09-15' }, { id: 'FEE006', studentId: 'S010', studentName: 'William Miller', description: 'Term 1 Tuition', totalAmount: 1200, amountPaid: 1200, dueDate: '2024-08-31' }, ];
const northwoodExpenses: Expense[] = [ { id: 'EXP001', description: 'Teacher Salaries - August', category: 'Salaries', amount: 25000, date: '2024-08-31', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP002', description: 'Electricity Bill', category: 'Utilities', amount: 1500, date: '2024-08-25', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP003', description: 'New Textbooks', category: 'Supplies', amount: 3200, date: '2024-08-15', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP004', description: 'Internet Service', category: 'Utilities', amount: 500, date: '2024-08-30', proofUrl: 'https://placehold.co/400x200.png' }, ];
const northwoodEvents: SchoolEvent[] = [ { id: 'EVT001', date: new Date(new Date().setDate(new Date().getDate() + 3)), title: 'Science Fair', type: 'Academic', location: 'Main Hall', organizer: 'Science Dept.', audience: 'All Students & Parents' }, { id: 'EVT002', date: new Date(new Date().setDate(new Date().getDate() + 10)), title: 'Mid-term Exams Start', type: 'Academic', location: 'Various Classrooms', organizer: 'Examinations Office', audience: 'Grades 9-12' }, ];
const northwoodTerms: AcademicTerm[] = [ { id: 'TERM01', name: 'Term 1', startDate: new Date(currentYear, 8, 1), endDate: new Date(currentYear, 11, 20) }, { id: 'TERM02', name: 'Term 2', startDate: new Date(currentYear + 1, 0, 10), endDate: new Date(currentYear + 1, 5, 30) }, ];
const northwoodHolidays: Holiday[] = [ { id: 'HOL01', name: 'Winter Break', date: new Date(currentYear, 11, 21) }, { id: 'HOL02', name: 'Spring Break', date: new Date(currentYear + 1, 2, 25) }, ];
const northwoodCourses: Course[] = [
    { id: 'CRS001', subject: 'Mathematics', teacherId: 'T001', classId: 'C003', schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00', room: '201' }, { day: 'Wednesday', startTime: '09:00', endTime: '10:00', room: '201' }, { day: 'Friday', startTime: '09:00', endTime: '10:00', room: '201' }] },
    { id: 'CRS002', subject: 'English', teacherId: 'T003', classId: 'C001', schedule: [{ day: 'Tuesday', startTime: '10:00', endTime: '11:00', room: '101' }, { day: 'Thursday', startTime: '10:00', endTime: '11:00', room: '101' }] },
    { id: 'CRS003', subject: 'Physics', teacherId: 'T002', classId: 'C004', schedule: [{ day: 'Monday', startTime: '11:00', endTime: '12:00', room: '301' }, { day: 'Wednesday', startTime: '11:00', endTime: '12:00', room: '301' }] },
];
const northwoodActivityLogs: ActivityLog[] = [
    { id: 'LOGN001', timestamp: new Date(new Date().setHours(new Date().getHours() - 20)), schoolId: 'northwood', user: 'Dr. Sarah Johnson', role: 'Admin', action: 'Login', details: 'User logged in successfully.' },
    { id: 'LOGN002', timestamp: new Date(new Date().setHours(new Date().getHours() - 5)), schoolId: 'northwood', user: 'Dr. Sarah Johnson', role: 'Admin', action: 'Create', details: 'Created course: Mathematics for Class 10-A.' },
    { id: 'LOGN003', timestamp: new Date(new Date().setHours(new Date().getHours() - 2)), schoolId: 'northwood', user: 'Prof. Michael Chen', role: 'Teacher', action: 'Update', details: 'Entered 5 new grades for Mathematics.' },
    { id: 'LOGN004', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)), schoolId: 'northwood', user: 'Dr. Sarah Johnson', role: 'Admin', action: 'Analysis', details: 'Generated a school-wide performance report.' },
];

// --- Data for School 2: Oakridge Academy ---
const oakridgeProfile: SchoolProfile = { id: 'oakridge', name: 'Oakridge Academy', head: 'Mr. James Maxwell', address: '456 Knowledge Ave, Learnington, USA 54321', phone: '+1 (555) 987-6543', email: 'admin@oakridgeacademy.edu', motto: 'Wisdom and Integrity', logoUrl: 'https://placehold.co/100x100.png', tier: 'Pro', gradingSystem: 'GPA', currency: 'USD', status: 'Active', gradeCapacity: defaultGradeCapacity };
const oakridgeStudents: Student[] = [ { id: 'S101', name: 'Benjamin Carter', grade: '10', class: 'A', email: 'b.carter@oakridge.com', phone: '+1 (555) 101-1010', address: '1 Apple St', parentName: 'Susan Carter', parentEmail: 's.carter@family.com', dateOfBirth: '2008-10-10', status: 'Active', sex: 'Male' }, { id: 'S102', name: 'Charlotte Lee', grade: '11', class: 'A', email: 'c.lee@oakridge.com', phone: '+1 (555) 102-1020', address: '2 Pear Ave', parentName: 'John Lee', parentEmail: 'j.lee@family.com', dateOfBirth: '2007-04-14', status: 'Active', sex: 'Female' }, { id: 'S103', name: 'Daniel Park', grade: '9', class: 'B', email: 'd.park@oakridge.com', phone: '+1 (555) 103-1030', address: '3 Cherry Ln', parentName: 'Grace Park', parentEmail: 'g.park@family.com', dateOfBirth: '2009-12-01', status: 'Transferred', sex: 'Male' }, { id: 'S104', name: 'Miguel Rodriguez', grade: '9', class: 'B', email: 'm.rodriguez.jr@oakridge.com', phone: '+1 (555) 104-1040', address: '123 Main St, Anytown', parentName: 'Maria Rodriguez', parentEmail: 'm.rodriguez@family.com', dateOfBirth: '2009-09-09', status: 'Active', sex: 'Male' }, ];
const oakridgeTeachers: Teacher[] = [ { id: 'T101', name: 'Ms. Rachel Adams', subject: 'Biology', email: 'r.adams@oakridge.com', phone: '+1 (555) 201-2010', address: '10 Biology Rd', experience: '10 years', qualifications: 'Ph.D. in Biology', status: 'Active', sex: 'Female' }, { id: 'T102', name: 'Mr. Steven Shaw', subject: 'Geography', email: 's.shaw@oakridge.com', phone: '+1 (555) 202-2020', address: '20 Map Way', experience: '5 years', qualifications: 'M.A. in Geography', status: 'Active', sex: 'Male' }, ];
const oakridgeClasses: Class[] = [ { id: 'C101', name: 'Class 9-B', grade: '9', teacher: 'Mr. Steven Shaw', students: 25, room: 'G1' }, { id: 'C102', name: 'Class 10-A', grade: '10', teacher: 'Ms. Rachel Adams', students: 30, room: 'L1' }, ];
const oakridgeCourses: Course[] = [
    { id: 'CRS101', subject: 'Biology', teacherId: 'T101', classId: 'C102', schedule: [{ day: 'Tuesday', startTime: '09:00', endTime: '11:00', room: 'L1' }] },
    { id: 'CRS102', subject: 'Geography', teacherId: 'T102', classId: 'C101', schedule: [{ day: 'Monday', startTime: '13:00', endTime: '14:30', room: 'G1' }] },
];
const oakridgeGrades: Grade[] = [ { studentId: 'S101', subject: 'Biology', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 1) }, { studentId: 'S102', subject: 'Geography', grade: '15', date: new Date(now.getFullYear(), now.getMonth() - 1) }, { studentId: 'S104', subject: 'Geography', grade: '14', date: new Date(now.getFullYear(), now.getMonth()) }, { studentId: 'S104', subject: 'Biology', grade: '12', date: new Date(now.getFullYear(), now.getMonth()) }, ];
const oakridgeAttendance: Attendance[] = oakridgeStudents.flatMap(student => { return Array.from({length: 30}).map((_, i) => { const date = new Date(); date.setDate(date.getDate() - i); const rand = Math.random(); let status = 'present'; if (rand > 0.92) status = 'absent'; else if (rand > 0.88) status = 'late'; return { studentId: student.id, date: date.toISOString().split('T')[0], status }; }); });
const oakridgeFinance: FinanceRecord[] = [ { id: 'FEE101', studentId: 'S101', studentName: 'Benjamin Carter', description: 'Annual Tuition', totalAmount: 2200, amountPaid: 2200, dueDate: '2024-08-31' }, { id: 'FEE102', studentId: 'S102', studentName: 'Charlotte Lee', description: 'Annual Tuition', totalAmount: 2200, amountPaid: 0, dueDate: '2024-08-31' }, { id: 'FEE103', studentId: 'S104', studentName: 'Miguel Rodriguez', description: 'Annual Tuition', totalAmount: 2200, amountPaid: 2200, dueDate: '2024-08-31' }, ];
const oakridgeExpenses: Expense[] = [ { id: 'EXP101', description: 'Staff Salaries - August', category: 'Salaries', amount: 35000, date: '2024-08-31', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP102', description: 'Building Maintenance', category: 'Maintenance', amount: 2500, date: '2024-08-20', proofUrl: 'https://placehold.co/400x200.png' }, ];
const oakridgeEvents: SchoolEvent[] = [ { id: 'EVT101', date: new Date(new Date().setDate(new Date().getDate() + 5)), title: 'Welcome Orientation', type: 'Meeting', location: 'Auditorium', organizer: 'Admin Office', audience: 'New Students & Parents' }, { id: 'EVT102', date: new Date(new Date().setDate(new Date().getDate() + 18)), title: 'Annual Sports Day', type: 'Sports', location: 'Sports Field', organizer: 'Sports Dept.', audience: 'Whole School' }, ];
const oakridgeTerms: AcademicTerm[] = [];
const oakridgeHolidays: Holiday[] = [];
const oakridgeActivityLogs: ActivityLog[] = [
    { id: 'LOGO001', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), schoolId: 'oakridge', user: 'Mr. James Maxwell', role: 'Admin', action: 'Login', details: 'User logged in successfully.' },
    { id: 'LOGO002', timestamp: new Date(new Date().setHours(new Date().getHours() - 8)), schoolId: 'oakridge', user: 'Mr. James Maxwell', role: 'Admin', action: 'Create', details: 'Approved application for Alice Wonder.' },
];


// --- Data for School 3: Maplewood International School ---
const maplewoodProfile: SchoolProfile = { id: 'maplewood', name: 'Maplewood International', head: 'Ms. Eleanor Vance', address: '789 Global St, Metropolis, USA 67890', phone: '+1 (555) 456-7890', email: 'info@maplewood.edu', motto: 'Globally Minded, Locally Rooted', logoUrl: 'https://placehold.co/100x100.png', tier: 'Premium', gradingSystem: 'Letter', currency: 'ZAR', status: 'Active', gradeCapacity: { ...defaultGradeCapacity, "10": 0 } };
const maplewoodStudents: Student[] = [ { id: 'S201', name: 'Chloe Dubois', grade: '10', class: 'A', email: 'c.dubois@maplewood.com', phone: '+1 (555) 201-2010', address: '1 Eiffel Tower Rd', parentName: 'Amelie Dubois', parentEmail: 'a.dubois@family.com', dateOfBirth: '2008-02-02', status: 'Active', sex: 'Female' }, { id: 'S202', name: 'Kenji Tanaka', grade: '11', class: 'B', email: 'k.tanaka@maplewood.com', phone: '+1 (555) 202-2020', address: '2 Tokyo Skytree Ave', parentName: 'Haruto Tanaka', parentEmail: 'h.tanaka@family.com', dateOfBirth: '2007-06-19', status: 'Active', sex: 'Male' }, { id: 'S203', name: 'Priya Singh', grade: '9', class: 'C', email: 'p.singh@maplewood.com', phone: '+1 (555) 203-2030', address: '3 Taj Mahal Blvd', parentName: 'Aarav Singh', parentEmail: 'a.singh@family.com', dateOfBirth: '2009-04-29', status: 'Active', sex: 'Female' }, { id: 'S204', name: 'Lucas Martinez', grade: '10', class: 'B', email: 'l.martinez@maplewood.com', phone: '+1 (555) 204-2040', address: '4 Berlin Gate', parentName: 'Sofia Martinez', parentEmail: 's.martinez@family.com', dateOfBirth: '2008-11-11', status: 'Active', sex: 'Male' }, ];
const maplewoodTeachers: Teacher[] = [ { id: 'T201', name: 'Mr. David Lee', subject: 'History', email: 'd.lee@maplewood.com', phone: '+1 (555) 301-3010', address: '10 History Lane', experience: '15 years', qualifications: 'M.Ed. in History', status: 'Active', sex: 'Male' }, ];
const maplewoodClasses: Class[] = [ { id: 'C201', name: 'Class 9-C', grade: '9', teacher: 'Mr. David Lee', students: 22, room: 'H1' }, ];
const maplewoodCourses: Course[] = [];
const maplewoodGrades: Grade[] = [ { studentId: 'S201', subject: 'History', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 1) }, { studentId: 'S204', subject: 'History', grade: '15', date: new Date(now.getFullYear(), now.getMonth()) }, ];
const maplewoodAttendance: Attendance[] = maplewoodStudents.flatMap(student => { return Array.from({length: 30}).map((_, i) => { const date = new Date(); date.setDate(date.getDate() - i); const rand = Math.random(); let status = 'present'; if (rand > 0.98) status = 'absent'; else if (rand > 0.95) status = 'late'; return { studentId: student.id, date: date.toISOString().split('T')[0], status }; }); });
const maplewoodFinance: FinanceRecord[] = [ { id: 'FEE201', studentId: 'S201', studentName: 'Chloe Dubois', description: 'Semester 1 Fees', totalAmount: 3500, amountPaid: 1000, dueDate: '2024-09-01' }, { id: 'FEE202', studentId: 'S204', studentName: 'Lucas Martinez', description: 'Semester 1 Fees', totalAmount: 3500, amountPaid: 3500, dueDate: '2024-07-01' }, ];
const maplewoodExpenses: Expense[] = [ { id: 'EXP201', description: 'IB Program Fees', category: 'Academics', amount: 12000, date: '2024-08-10', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP202', description: 'Staff Salaries - August', category: 'Salaries', amount: 45000, date: '2024-08-31', proofUrl: 'https://placehold.co/400x200.png' }, ];
const maplewoodEvents: SchoolEvent[] = [ { id: 'EVT201', date: new Date(new Date().setDate(new Date().getDate() + 20)), title: 'International Day', type: 'Cultural', location: 'School Grounds', organizer: 'Cultural Committee', audience: 'Whole School Community' }, ];
const maplewoodTerms: AcademicTerm[] = [];
const maplewoodHolidays: Holiday[] = [];
const maplewoodActivityLogs: ActivityLog[] = [
    { id: 'LOGM001', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), schoolId: 'maplewood', user: 'Ms. Eleanor Vance', role: 'Admin', action: 'Login', details: 'User logged in successfully.' },
];


export const schoolData: Record<string, SchoolData> = {
  northwood: {
    profile: northwoodProfile,
    students: northwoodStudents,
    teachers: northwoodTeachers,
    classes: northwoodClasses,
    courses: northwoodCourses,
    lessonPlans: [],
    savedTests: [],
    deployedTests: [],
    teams: northwoodTeams,
    grades: northwoodGrades,
    attendance: northwoodAttendance,
    finance: northwoodFinance,
    feeDescriptions: ['Term 1 Tuition', 'Lab Fees', 'Sports Uniform', 'Library Fine', 'Exam Fee'],
    audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'],
    expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
    expenses: northwoodExpenses,
    competitions: northwoodCompetitions,
    events: northwoodEvents,
    terms: northwoodTerms,
    holidays: northwoodHolidays,
    activityLogs: northwoodActivityLogs,
    messages: [],
    admissions: [ { id: 'ADM001', name: 'John Smith', appliedFor: 'Grade 9', date: '2024-05-10', status: 'Pending', formerSchool: 'Eastwood Elementary', grades: 'A average in all subjects.', parentName: 'Mary Smith', parentEmail: 'm.smith@family.com', dateOfBirth: '2009-03-12', sex: 'Male' }, { id: 'ADM002', name: 'Emily White', appliedFor: 'Grade 10', date: '2024-05-09', status: 'Approved', formerSchool: 'Westwood Middle', grades: 'Excellent academic record, especially in sciences.', parentName: 'David White', parentEmail: 'd.white@family.com', dateOfBirth: '2008-11-23', sex: 'Female' }, ],
    exams: [ { id: 'EXM001', title: 'Mid-term Mathematics', subject: 'Mathematics', grade: '10', date: new Date(new Date().setDate(new Date().getDate() + 10)), time: '09:00', duration: '2 hours', room: '201', board: 'Internal' }, { id: 'EXM004', title: 'IGCSE Physics Paper 4', subject: 'Physics', grade: '10', date: new Date(new Date().setDate(new Date().getDate() + 20)), time: '13:00', duration: '75 minutes', room: 'Hall A', board: 'Cambridge' }, ],
    assets: [ { id: 'ASSET001', name: 'Dell Latitude Laptop', category: 'IT Equipment', status: 'In Use', location: 'Room 201', assignedTo: 'Prof. Michael Chen' }, { id: 'ASSET002', name: 'Epson Projector', category: 'AV Equipment', status: 'Available', location: 'Storage', assignedTo: 'N/A' }, ],
    assignments: [ { id: 'A001', title: 'Math Problem Set 5', subject: 'Mathematics', grade: '10', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), status: 'pending' }, { id: 'A002', title: 'Physics Lab Report', subject: 'Physics', grade: '11', dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: 'submitted' }, ],
  },
  oakridge: {
    profile: oakridgeProfile,
    students: oakridgeStudents,
    teachers: oakridgeTeachers,
    classes: oakridgeClasses,
    courses: oakridgeCourses,
    lessonPlans: [],
    savedTests: [],
    deployedTests: [],
    teams: [],
    grades: oakridgeGrades,
    attendance: oakridgeAttendance,
    finance: oakridgeFinance,
    feeDescriptions: ['Annual Tuition', 'Activity Fee', 'Technology Fee'],
    audiences: ['All Students', 'Parents', 'Teachers', 'New Students & Parents'],
    expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
    expenses: oakridgeExpenses,
    competitions: [],
    events: oakridgeEvents,
    terms: oakridgeTerms,
    holidays: oakridgeHolidays,
    activityLogs: oakridgeActivityLogs,
    messages: [],
    admissions: [ { id: 'OAK-ADM001', name: 'Alice Wonder', appliedFor: 'Grade 9', date: '2024-05-15', status: 'Approved', formerSchool: 'Wonderland Middle', grades: 'Top of class.', parentName: 'Charles Wonder', parentEmail: 'c.wonder@family.com', dateOfBirth: '2009-07-07', sex: 'Female' }, ],
    exams: [ { id: 'OAK-EXM001', title: 'Biology Entrance Exam', subject: 'Biology', grade: '9', date: new Date(new Date().setDate(new Date().getDate() + 10)), time: '09:00', duration: '2 hours', room: 'L1', board: 'Internal' }, ],
    assets: [ { id: 'OAK-ASSET001', name: 'Microscope Array', category: 'Lab Equipment', status: 'In Use', location: 'Lab 1', assignedTo: 'Ms. Rachel Adams' }, ],
    assignments: [ { id: 'OAK-A001', title: 'Geographic Survey Project', subject: 'Geography', grade: '9', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), status: 'pending' }, ],
  },
  maplewood: {
    profile: maplewoodProfile,
    students: maplewoodStudents,
    teachers: maplewoodTeachers,
    classes: maplewoodClasses,
    courses: maplewoodCourses,
    lessonPlans: [],
    savedTests: [],
    deployedTests: [],
    teams: [],
    grades: maplewoodGrades,
    attendance: maplewoodAttendance,
    finance: maplewoodFinance,
    feeDescriptions: ['Semester 1 Fees', 'Capital Levy', 'IB Exam Fee', 'Technology Fee'],
    audiences: ['All Students', 'Parents', 'Teachers', 'Whole School Community'],
    expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
    expenses: maplewoodExpenses,
    competitions: [],
    events: maplewoodEvents,
    terms: maplewoodTerms,
    holidays: maplewoodHolidays,
    activityLogs: maplewoodActivityLogs,
    messages: [],
    admissions: [ { id: 'MAP-ADM001', name: 'Leo Tolstoy', appliedFor: 'Grade 9', date: '2024-06-01', status: 'Pending', formerSchool: 'Literary Prep', grades: 'Strong in humanities.', parentName: 'Sophia Tolstoy', parentEmail: 's.tolstoy@family.com', dateOfBirth: '2009-01-01', sex: 'Male' }, ],
    exams: [ { id: 'MAP-EXM001', title: 'World History Final', subject: 'History', grade: '9', date: new Date(new Date().setDate(new Date().getDate() + 15)), time: '10:00', duration: '90 minutes', room: 'H1', board: 'IB' }, ],
    assets: [ { id: 'MAP-ASSET001', name: 'Smart Board', category: 'AV Equipment', status: 'In Use', location: 'H1', assignedTo: 'Mr. David Lee' }, ],
    assignments: [ { id: 'MAP-A001', title: 'Essay on Renaissance Art', subject: 'History', grade: '9', dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), status: 'pending' }, ],
  },
};
