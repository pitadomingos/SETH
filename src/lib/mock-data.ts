

export interface FinanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  totalAmount: number;
  amountPaid: number;
  dueDate: string;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  proofUrl: string;
}

export interface Team {
  id: string;
  name: string;
  coach: string;
  playerIds: string[];
  icon: string;
}

export interface Competition {
  id: string;
  title: string;
  ourTeamId: string;
  opponent: string;
  date: Date;
  time: string;
  location: string;
}

interface SchoolData {
    profile: SchoolProfile;
    students: Student[];
    teachers: Teacher[];
    classes: Class[];
    admissions: Admission[];
    exams: Exam[];
    finance: FinanceRecord[];
    assets: Asset[];
    assignments: Assignment[];
    grades: Grade[];
    attendance: Attendance[];
    events: SchoolEvent[];
    courses: {
        teacher: Course[];
        student: Course[];
    };
    feeDescriptions: string[];
    expenseCategories: string[];
    expenses: Expense[];
    teams: Team[];
    competitions: Competition[];
}

export interface SchoolProfile {
  id: string;
  name: string;
  head: string;
  address: string;
  phone: string;
  email: string;
  motto: string;
  logoUrl: string;
  tier?: 'Premium' | 'Pro' | 'Starter';
  gradingSystem: '20-Point' | 'GPA' | 'Letter';
}
export interface Student { id: string; name: string; grade: string; class: string; email: string; phone: string; address: string; schoolId?: string; schoolName?: string; parentName: string; parentEmail: string; status: 'Active' | 'Inactive' | 'Transferred'; }
interface Teacher { id: string; name: string; subject: string; email: string; phone: string; address: string; experience: string; qualifications: string; status: 'Active' | 'Inactive' | 'Transferred'; }
interface Class { id: string; name: string; grade: string; teacher: string; students: number; room: string; }
interface Admission { id: string; name: string; appliedFor: string; date: string; status: 'Pending' | 'Approved' | 'Rejected'; formerSchool: string; grades: string; parentName: string; parentEmail: string; }
interface Exam { id: string; title: string; subject: string; grade: string; date: Date; time: string; duration: string; room: string; board: string; }
interface Asset { id: string; name: string; category: string; status: 'In Use' | 'Available' | 'Maintenance'; location: string; assignedTo: string; }
interface Assignment { id: string; title: string; subject: string; grade: string; dueDate: string; status: 'pending' | 'submitted' | 'overdue'; }
export interface Grade { studentId: string; subject: string; grade: string; date: Date; }
interface Attendance { studentId: string; date: string; status: string; }
interface SchoolEvent { date: Date; title: string; type: string; schoolName?: string; }
interface Course { id: string; name: string; schedule?: string; students?: number; teacher?: string; grade?: string; progress?: number; }


// --- Data for School 1: Northwood High ---
const northwoodProfile: SchoolProfile = {
  id: 'northwood',
  name: 'Northwood High School',
  head: 'Dr. Sarah Johnson',
  address: '123 Education Lane, Anytown, USA 12345',
  phone: '+1 (555) 123-4567',
  email: 'contact@northwoodhigh.edu',
  motto: 'Excellence in Education',
  logoUrl: 'https://placehold.co/100x100.png',
  tier: 'Starter',
  gradingSystem: '20-Point',
};

const northwoodStudents: Student[] = [
  { id: 'S001', name: 'Emma Rodriguez', grade: '10', class: 'A', email: 'e.rodriguez@edumanage.com', phone: '+1 (555) 555-1234', address: '123 Main St, Anytown', parentName: 'Maria Rodriguez', parentEmail: 'm.rodriguez@family.com', status: 'Active' },
  { id: 'S002', name: 'James Wilson', grade: '10', class: 'A', email: 'j.wilson@edumanage.com', phone: '+1 (555) 555-5678', address: '456 Oak Ave, Anytown', parentName: 'Robert Wilson', parentEmail: 'r.wilson@family.com', status: 'Active' },
  { id: 'S003', name: 'Sofia Kim', grade: '11', class: 'B', email: 's.kim@edumanage.com', phone: '+1 (555) 555-9012', address: '789 Pine Rd, Anytown', parentName: 'Daniel Kim', parentEmail: 'd.kim@family.com', status: 'Active' },
  { id: 'S004', name: 'Alex Johnson', grade: '9', class: 'C', email: 'a.johnson@edumanage.com', phone: '+1 (555) 555-3456', address: '321 Elm St, Anytown', parentName: 'Jessica Johnson', parentEmail: 'j.johnson@family.com', status: 'Active' },
  { id: 'S005', name: 'Olivia Chen', grade: '12', class: 'A', email: 'o.chen@edumanage.com', phone: '+1 (555) 555-7890', address: '159 Maple Dr, Anytown', parentName: 'Wei Chen', parentEmail: 'w.chen@family.com', status: 'Active' },
  { id: 'S006', name: 'Liam Garcia', grade: '9', class: 'A', email: 'l.garcia@edumanage.com', phone: '+1 (555) 555-1122', address: '753 Birch Ln, Anytown', parentName: 'Isabella Garcia', parentEmail: 'i.garcia@family.com', status: 'Active' },
  { id: 'S007', name: 'Ava Martinez', grade: '11', class: 'A', email: 'a.martinez@edumanage.com', phone: '+1 (555) 555-3344', address: '951 Cedar Ct, Anytown', parentName: 'David Martinez', parentEmail: 'd.martinez@family.com', status: 'Active' },
  { id: 'S008', name: 'Noah Brown', grade: '10', class: 'B', email: 'n.brown@edumanage.com', phone: '+1 (555) 555-5566', address: '852 Spruce Ave, Anytown', parentName: 'Linda Brown', parentEmail: 'l.brown@family.com', status: 'Active' },
  { id: 'S009', name: 'Sophia Davis', grade: '9', class: 'B', email: 's.davis@edumanage.com', phone: '+1 (555) 555-7788', address: '147 Walnut St, Anytown', parentName: 'Paul Davis', parentEmail: 'p.davis@family.com', status: 'Active' },
  { id: 'S010', name: 'William Miller', grade: '12', class: 'C', email: 'w.miller@edumanage.com', phone: '+1 (555) 555-9999', address: '456 Failure Ave, Anytown', parentName: 'George Miller', parentEmail: 'g.miller@family.com', status: 'Active' },
];

const northwoodTeachers: Teacher[] = [
  { id: 'T001', name: 'Prof. Michael Chen', subject: 'Mathematics', email: 'm.chen@edumanage.com', phone: '+1 (555) 111-2222', address: '123 Calculus Rd, Mathville', experience: '8 years', qualifications: 'Ph.D. in Mathematics', status: 'Active' },
  { id: 'T002', name: 'Dr. Lisa Anderson', subject: 'Physics', email: 'l.anderson@edumanage.com', phone: '+1 (555) 222-3333', address: '456 Quantum Way, Physburg', experience: '12 years', qualifications: 'Ph.D. in Physics', status: 'Inactive' },
  { id: 'T003', name: 'Ms. Jennifer Davis', subject: 'English', email: 'j.davis@northwood.edu', phone: '+1 (555) 111-3333', address: '101 Literature Lane', experience: '5 years', qualifications: 'M.A. in English', status: 'Active' },
];

const northwoodClasses: Class[] = [
  { id: 'C001', name: 'Class 9-A', grade: '9', teacher: 'Ms. Jennifer Davis', students: 28, room: '101' },
  { id: 'C002', name: 'Class 9-C', grade: '9', teacher: 'Prof. Michael Chen', students: 22, room: '103' },
  { id: 'C003', name: 'Class 10-A', grade: '10', teacher: 'Prof. Michael Chen', students: 30, room: '201' },
  { id: 'C004', name: 'Class 11-B', grade: '11', teacher: 'Dr. Lisa Anderson', students: 25, room: '301' },
];

const northwoodTeams: Team[] = [
    { id: 'TEAM01', name: 'Basketball Varsity', coach: 'Prof. Michael Chen', playerIds: ['S002', 'S005', 'S008'], icon: '🏀' },
    { id: 'TEAM02', name: 'Football Eagles', coach: 'Ms. Jennifer Davis', playerIds: ['S001', 'S004', 'S006', 'S007'], icon: '🏈' },
    { id: 'TEAM03', name: 'Swim Team Sharks', coach: 'Dr. Lisa Anderson', playerIds: ['S003'], icon: '🏊' },
];

const northwoodCompetitions: Competition[] = [
    { id: 'COMP01', title: 'Championship Game', ourTeamId: 'TEAM01', opponent: 'Southside Serpents', date: new Date(new Date().setDate(new Date().getDate() + 12)), time: '18:00', location: 'Home Gymnasium' },
    { id: 'COMP02', title: 'Away Match', ourTeamId: 'TEAM02', opponent: 'Oakridge Oaks', date: new Date(new Date().setDate(new Date().getDate() + 25)), time: '15:30', location: 'Oakridge Academy Field' },
];

const now = new Date();
const northwoodGrades: Grade[] = [
  { studentId: 'S001', subject: 'Mathematics', grade: '17', date: new Date(now.getFullYear(), now.getMonth() - 2) },
  { studentId: 'S001', subject: 'Physics', grade: '16', date: new Date(now.getFullYear(), now.getMonth() - 2) },
  { studentId: 'S001', subject: 'English', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 2) },
  { studentId: 'S002', subject: 'Mathematics', grade: '14', date: new Date(now.getFullYear(), now.getMonth() - 1) },
  { studentId: 'S002', subject: 'Physics', grade: '14', date: new Date(now.getFullYear(), now.getMonth() - 1) },
  { studentId: 'S003', subject: 'English', grade: '20', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S003', subject: 'Physics', grade: '19', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S004', subject: 'English', grade: '15', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S005', subject: 'Mathematics', grade: '20', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S006', subject: 'English', grade: '12', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S007', subject: 'Physics', grade: '17', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S008', subject: 'Mathematics', grade: '15', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S009', subject: 'English', grade: '18', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S009', subject: 'Mathematics', grade: '18', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S010', subject: 'Mathematics', grade: '5', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S010', subject: 'Physics', grade: '8', date: new Date(now.getFullYear(), now.getMonth()) },
  { studentId: 'S010', subject: 'English', grade: '8', date: new Date(now.getFullYear(), now.getMonth()) },
];

const northwoodAttendance: Attendance[] = northwoodStudents.flatMap(student => {
  return Array.from({length: 30}).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    let rand = Math.random();
    // make the failing student more absent
    if(student.id === 'S010') {
        rand = Math.random() * 0.5; // Skew random number to be lower
    }
    let status = 'present';
    if (rand > 0.95) status = 'absent';
    else if (rand > 0.9) status = 'late';
    return { studentId: student.id, date: date.toISOString().split('T')[0], status };
  });
});

const northwoodFinance: FinanceRecord[] = [
  { id: 'FEE001', studentId: 'S001', studentName: 'Emma Rodriguez', description: 'Term 1 Tuition', totalAmount: 1200, amountPaid: 1200, dueDate: '2024-08-31' },
  { id: 'FEE002', studentId: 'S002', studentName: 'James Wilson', description: 'Term 1 Tuition', totalAmount: 1200, amountPaid: 500, dueDate: '2024-08-31' },
  { id: 'FEE003', studentId: 'S003', studentName: 'Sofia Kim', description: 'Term 1 Tuition', totalAmount: 1500, amountPaid: 0, dueDate: '2024-07-31' }, // Overdue
  { id: 'FEE004', studentId: 'S009', studentName: 'Sophia Davis', description: 'Term 1 Tuition', totalAmount: 1200, amountPaid: 1200, dueDate: '2024-08-31' },
  { id: 'FEE005', studentId: 'S001', studentName: 'Emma Rodriguez', description: 'Lab Fees', totalAmount: 150, amountPaid: 150, dueDate: '2024-09-15' },
  { id: 'FEE006', studentId: 'S010', studentName: 'William Miller', description: 'Term 1 Tuition', totalAmount: 1200, amountPaid: 1200, dueDate: '2024-08-31' },
];

const northwoodExpenses: Expense[] = [
    { id: 'EXP001', description: 'Teacher Salaries - August', category: 'Salaries', amount: 25000, date: '2024-08-31', proofUrl: 'https://placehold.co/400x200.png' },
    { id: 'EXP002', description: 'Electricity Bill', category: 'Utilities', amount: 1500, date: '2024-08-25', proofUrl: 'https://placehold.co/400x200.png' },
    { id: 'EXP003', description: 'New Textbooks', category: 'Supplies', amount: 3200, date: '2024-08-15', proofUrl: 'https://placehold.co/400x200.png' },
    { id: 'EXP004', description: 'Internet Service', category: 'Utilities', amount: 500, date: '2024-08-30', proofUrl: 'https://placehold.co/400x200.png' },
];

// --- Data for School 2: Oakridge Academy ---
const oakridgeProfile: SchoolProfile = {
  id: 'oakridge',
  name: 'Oakridge Academy',
  head: 'Mr. James Maxwell',
  address: '456 Knowledge Ave, Learnington, USA 54321',
  phone: '+1 (555) 987-6543',
  email: 'admin@oakridgeacademy.edu',
  motto: 'Wisdom and Integrity',
  logoUrl: 'https://placehold.co/100x100.png',
  tier: 'Pro',
  gradingSystem: 'GPA',
};

const oakridgeStudents: Student[] = [
  { id: 'S101', name: 'Benjamin Carter', grade: '10', class: 'A', email: 'b.carter@oakridge.com', phone: '+1 (555) 101-1010', address: '1 Apple St', parentName: 'Susan Carter', parentEmail: 's.carter@family.com', status: 'Active' },
  { id: 'S102', name: 'Charlotte Lee', grade: '11', class: 'A', email: 'c.lee@oakridge.com', phone: '+1 (555) 102-1020', address: '2 Pear Ave', parentName: 'John Lee', parentEmail: 'j.lee@family.com', status: 'Active' },
  { id: 'S103', name: 'Daniel Park', grade: '9', class: 'B', email: 'd.park@oakridge.com', phone: '+1 (555) 103-1030', address: '3 Cherry Ln', parentName: 'Grace Park', parentEmail: 'g.park@family.com', status: 'Transferred' },
  { id: 'S104', name: 'Miguel Rodriguez', grade: '9', class: 'B', email: 'm.rodriguez.jr@oakridge.com', phone: '+1 (555) 104-1040', address: '123 Main St, Anytown', parentName: 'Maria Rodriguez', parentEmail: 'm.rodriguez@family.com', status: 'Active' },
];

const oakridgeTeachers: Teacher[] = [
  { id: 'T101', name: 'Ms. Rachel Adams', subject: 'Biology', email: 'r.adams@oakridge.com', phone: '+1 (555) 201-2010', address: '10 Biology Rd', experience: '10 years', qualifications: 'Ph.D. in Biology', status: 'Active' },
  { id: 'T102', name: 'Mr. Steven Shaw', subject: 'Geography', email: 's.shaw@oakridge.com', phone: '+1 (555) 202-2020', address: '20 Map Way', experience: '5 years', qualifications: 'M.A. in Geography', status: 'Active' },
];

const oakridgeClasses: Class[] = [
  { id: 'C101', name: 'Class 9-B', grade: '9', teacher: 'Mr. Steven Shaw', students: 25, room: 'G1' },
  { id: 'C102', name: 'Class 10-A', grade: '10', teacher: 'Ms. Rachel Adams', students: 30, room: 'L1' },
];

const oakridgeGrades: Grade[] = [
    { studentId: 'S101', subject: 'Biology', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S102', subject: 'Geography', grade: '15', date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S104', subject: 'Geography', grade: '14', date: new Date(now.getFullYear(), now.getMonth()) },
    { studentId: 'S104', subject: 'Biology', grade: '12', date: new Date(now.getFullYear(), now.getMonth()) },
];

const oakridgeAttendance: Attendance[] = oakridgeStudents.flatMap(student => {
  return Array.from({length: 30}).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const rand = Math.random();
    let status = 'present';
    if (rand > 0.92) status = 'absent';
    else if (rand > 0.88) status = 'late';
    return { studentId: student.id, date: date.toISOString().split('T')[0], status };
  });
});

const oakridgeFinance: FinanceRecord[] = [
  { id: 'FEE101', studentId: 'S101', studentName: 'Benjamin Carter', description: 'Annual Tuition', totalAmount: 2200, amountPaid: 2200, dueDate: '2024-08-31' },
  { id: 'FEE102', studentId: 'S102', studentName: 'Charlotte Lee', description: 'Annual Tuition', totalAmount: 2200, amountPaid: 0, dueDate: '2024-08-31' },
  { id: 'FEE103', studentId: 'S104', studentName: 'Miguel Rodriguez', description: 'Annual Tuition', totalAmount: 2200, amountPaid: 2200, dueDate: '2024-08-31' },
];

const oakridgeExpenses: Expense[] = [
    { id: 'EXP101', description: 'Staff Salaries - August', category: 'Salaries', amount: 35000, date: '2024-08-31', proofUrl: 'https://placehold.co/400x200.png' },
    { id: 'EXP102', description: 'Building Maintenance', category: 'Maintenance', amount: 2500, date: '2024-08-20', proofUrl: 'https://placehold.co/400x200.png' },
];

// --- Data for School 3: Maplewood International School ---
const maplewoodProfile: SchoolProfile = {
  id: 'maplewood',
  name: 'Maplewood International',
  head: 'Ms. Eleanor Vance',
  address: '789 Global St, Metropolis, USA 67890',
  phone: '+1 (555) 456-7890',
  email: 'info@maplewood.edu',
  motto: 'Globally Minded, Locally Rooted',
  logoUrl: 'https://placehold.co/100x100.png',
  tier: 'Premium',
  gradingSystem: 'Letter',
};

const maplewoodStudents: Student[] = [
  { id: 'S201', name: 'Chloe Dubois', grade: '10', class: 'A', email: 'c.dubois@maplewood.com', phone: '+1 (555) 201-2010', address: '1 Eiffel Tower Rd', parentName: 'Amelie Dubois', parentEmail: 'a.dubois@family.com', status: 'Active' },
  { id: 'S202', name: 'Kenji Tanaka', grade: '11', class: 'B', email: 'k.tanaka@maplewood.com', phone: '+1 (555) 202-2020', address: '2 Tokyo Skytree Ave', parentName: 'Haruto Tanaka', parentEmail: 'h.tanaka@family.com', status: 'Active' },
  { id: 'S203', name: 'Priya Singh', grade: '9', class: 'C', email: 'p.singh@maplewood.com', phone: '+1 (555) 203-2030', address: '3 Taj Mahal Blvd', parentName: 'Aarav Singh', parentEmail: 'a.singh@family.com', status: 'Active' },
  { id: 'S204', name: 'Lucas Martinez', grade: '10', class: 'B', email: 'l.martinez@maplewood.com', phone: '+1 (555) 204-2040', address: '4 Berlin Gate', parentName: 'Sofia Martinez', parentEmail: 's.martinez@family.com', status: 'Active' },
];

const maplewoodTeachers: Teacher[] = [
  { id: 'T201', name: 'Mr. David Lee', subject: 'History', email: 'd.lee@maplewood.com', phone: '+1 (555) 301-3010', address: '10 History Lane', experience: '15 years', qualifications: 'M.Ed. in History', status: 'Active' },
];

const maplewoodClasses: Class[] = [
  { id: 'C201', name: 'Class 9-C', grade: '9', teacher: 'Mr. David Lee', students: 22, room: 'H1' },
];

const maplewoodGrades: Grade[] = [
    { studentId: 'S201', subject: 'History', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S204', subject: 'History', grade: '15', date: new Date(now.getFullYear(), now.getMonth()) },
];

const maplewoodAttendance: Attendance[] = maplewoodStudents.flatMap(student => {
  return Array.from({length: 30}).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const rand = Math.random();
    let status = 'present';
    if (rand > 0.98) status = 'absent';
    else if (rand > 0.95) status = 'late';
    return { studentId: student.id, date: date.toISOString().split('T')[0], status };
  });
});

const maplewoodFinance: FinanceRecord[] = [
  { id: 'FEE201', studentId: 'S201', studentName: 'Chloe Dubois', description: 'Semester 1 Fees', totalAmount: 3500, amountPaid: 1000, dueDate: '2024-09-01' },
  { id: 'FEE202', studentId: 'S204', studentName: 'Lucas Martinez', description: 'Semester 1 Fees', totalAmount: 3500, amountPaid: 3500, dueDate: '2024-07-01' },
];

const maplewoodExpenses: Expense[] = [
    { id: 'EXP201', description: 'IB Program Fees', category: 'Academics', amount: 12000, date: '2024-08-10', proofUrl: 'https://placehold.co/400x200.png' },
    { id: 'EXP202', description: 'Staff Salaries - August', category: 'Salaries', amount: 45000, date: '2024-08-31', proofUrl: 'https://placehold.co/400x200.png' },
];

export const schoolData: Record<string, SchoolData> = {
  northwood: {
    profile: northwoodProfile,
    students: northwoodStudents,
    teachers: northwoodTeachers,
    classes: northwoodClasses,
    teams: northwoodTeams,
    grades: northwoodGrades,
    attendance: northwoodAttendance,
    finance: northwoodFinance,
    feeDescriptions: ['Term 1 Tuition', 'Lab Fees', 'Sports Uniform', 'Library Fine', 'Exam Fee'],
    expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
    expenses: northwoodExpenses,
    competitions: northwoodCompetitions,
    // Using shared data for simplicity in this simulation
    admissions: [
        { id: 'ADM001', name: 'John Smith', appliedFor: 'Grade 9', date: '2024-05-10', status: 'Pending', formerSchool: 'Eastwood Elementary', grades: 'A average in all subjects.', parentName: 'Mary Smith', parentEmail: 'm.smith@family.com' },
        { id: 'ADM002', name: 'Emily White', appliedFor: 'Grade 10', date: '2024-05-09', status: 'Approved', formerSchool: 'Westwood Middle', grades: 'Excellent academic record, especially in sciences.', parentName: 'David White', parentEmail: 'd.white@family.com' },
    ],
    exams: [
        { id: 'EXM001', title: 'Mid-term Mathematics', subject: 'Mathematics', grade: '10', date: new Date(new Date().setDate(new Date().getDate() + 10)), time: '09:00', duration: '2 hours', room: '201', board: 'Internal' },
        { id: 'EXM004', title: 'IGCSE Physics Paper 4', subject: 'Physics', grade: '10', date: new Date(new Date().setDate(new Date().getDate() + 20)), time: '13:00', duration: '75 minutes', room: 'Hall A', board: 'Cambridge' },
    ],
    assets: [
        { id: 'ASSET001', name: 'Dell Latitude Laptop', category: 'IT Equipment', status: 'In Use', location: 'Room 201', assignedTo: 'Prof. Michael Chen' },
        { id: 'ASSET002', name: 'Epson Projector', category: 'AV Equipment', status: 'Available', location: 'Storage', assignedTo: 'N/A' },
    ],
    assignments: [
        { id: 'A001', title: 'Math Problem Set 5', subject: 'Mathematics', grade: '10', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), status: 'pending' },
        { id: 'A002', title: 'Physics Lab Report', subject: 'Physics', grade: '11', dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: 'submitted' },
    ],
    events: [
        { date: new Date(new Date().setDate(new Date().getDate() + 3)), title: 'Science Fair', type: 'Academic' },
        { date: new Date(new Date().setDate(new Date().getDate() + 10)), title: 'Mid-term Exams Start', type: 'Academic' },
    ],
    courses: {
        teacher: [
            { id: 'PHY101', name: 'Introduction to Physics', schedule: 'Mon, Wed 10:00-11:30', students: 45 },
            { id: 'MATH301', name: 'Advanced Calculus', schedule: 'Fri 9:00-11:00', students: 25 },
        ],
        student: [
            { id: 'PHY101', name: 'Physics Intro', teacher: 'Dr. Evelyn Reed', grade: 'A-', progress: 85 },
            { id: 'CS101', name: 'Programming Intro', teacher: 'Mrs. Patricia Wright', grade: 'A', progress: 92 },
        ],
    },
  },
  oakridge: {
    profile: oakridgeProfile,
    students: oakridgeStudents,
    teachers: oakridgeTeachers,
    classes: oakridgeClasses,
    teams: [],
    grades: oakridgeGrades,
    attendance: oakridgeAttendance,
    finance: oakridgeFinance,
    feeDescriptions: ['Annual Tuition', 'Activity Fee', 'Technology Fee'],
    expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
    expenses: oakridgeExpenses,
    competitions: [],
    // Using shared/generic data for simplicity
    admissions: [
        { id: 'OAK-ADM001', name: 'Alice Wonder', appliedFor: 'Grade 9', date: '2024-05-15', status: 'Approved', formerSchool: 'Wonderland Middle', grades: 'Top of class.', parentName: 'Charles Wonder', parentEmail: 'c.wonder@family.com' },
    ],
    exams: [
        { id: 'OAK-EXM001', title: 'Biology Entrance Exam', subject: 'Biology', grade: '9', date: new Date(new Date().setDate(new Date().getDate() + 10)), time: '09:00', duration: '2 hours', room: 'L1', board: 'Internal' },
    ],
    assets: [
        { id: 'OAK-ASSET001', name: 'Microscope Array', category: 'Lab Equipment', status: 'In Use', location: 'Lab 1', assignedTo: 'Ms. Rachel Adams' },
    ],
    assignments: [
        { id: 'OAK-A001', title: 'Geographic Survey Project', subject: 'Geography', grade: '9', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), status: 'pending' },
    ],
    events: [
        { date: new Date(new Date().setDate(new Date().getDate() + 5)), title: 'Welcome Orientation', type: 'Meeting' },
        { date: new Date(new Date().setDate(new Date().getDate() + 18)), title: 'Annual Sports Day', type: 'Sports' },
    ],
    courses: {
        teacher: [
            { id: 'BIO101', name: 'Introductory Biology', schedule: 'Tue, Thu 10:00-11:30', students: 30 },
        ],
        student: [
            { id: 'BIO101', name: 'Biology Basics', teacher: 'Ms. Rachel Adams', grade: 'A', progress: 90 },
        ],
    },
  },
  maplewood: {
    profile: maplewoodProfile,
    students: maplewoodStudents,
    teachers: maplewoodTeachers,
    classes: maplewoodClasses,
    teams: [],
    grades: maplewoodGrades,
    attendance: maplewoodAttendance,
    finance: maplewoodFinance,
    feeDescriptions: ['Semester 1 Fees', 'Capital Levy', 'IB Exam Fee', 'Technology Fee'],
    expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
    expenses: maplewoodExpenses,
    competitions: [],
    admissions: [
        { id: 'MAP-ADM001', name: 'Leo Tolstoy', appliedFor: 'Grade 9', date: '2024-06-01', status: 'Pending', formerSchool: 'Literary Prep', grades: 'Strong in humanities.', parentName: 'Sophia Tolstoy', parentEmail: 's.tolstoy@family.com' },
    ],
    exams: [
        { id: 'MAP-EXM001', title: 'World History Final', subject: 'History', grade: '9', date: new Date(new Date().setDate(new Date().getDate() + 15)), time: '10:00', duration: '90 minutes', room: 'H1', board: 'IB' },
    ],
    assets: [
        { id: 'MAP-ASSET001', name: 'Smart Board', category: 'AV Equipment', status: 'In Use', location: 'H1', assignedTo: 'Mr. David Lee' },
    ],
    assignments: [
        { id: 'MAP-A001', title: 'Essay on Renaissance Art', subject: 'History', grade: '9', dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), status: 'pending' },
    ],
    events: [
        { date: new Date(new Date().setDate(new Date().getDate() + 20)), title: 'International Day', type: 'Cultural' },
    ],
    courses: {
        teacher: [
            { id: 'HIST101', name: 'World History', schedule: 'Mon, Fri 13:00-14:30', students: 22 },
        ],
        student: [
            { id: 'HIST101', name: 'World History', teacher: 'Mr. David Lee', grade: 'A', progress: 95 },
        ],
    },
  },
};
