

interface SchoolData {
    profile: SchoolProfile;
    students: Student[];
    teachers: Teacher[];
    classes: Class[];
    admissions: Admission[];
    exams: Exam[];
    finance: Finance[];
    assets: Asset[];
    assignments: Assignment[];
    grades: Grade[];
    attendance: Attendance[];
    events: SchoolEvent[];
    courses: {
        teacher: Course[];
        student: Course[];
    };
}

interface SchoolProfile {
  id: string;
  name: string;
  head: string;
  address: string;
  phone: string;
  email: string;
  motto: string;
}
interface Student { id: string; name: string; grade: string; class: string; email: string; phone: string; address: string; gpa: number; }
interface Teacher { id: string; name: string; subject: string; email: string; phone: string; address: string; experience: string; qualifications: string; }
interface Class { id: string; name: string; grade: string; teacher: string; students: number; room: string; }
interface Admission { id: string; name: string; appliedFor: string; date: string; status: 'Pending' | 'Approved' | 'Rejected'; formerSchool: string; grades: string; }
interface Exam { id: string; title: string; subject: string; grade: string; date: Date; time: string; duration: string; room: string; board: string; }
interface Finance { studentId: string; studentName: string; amountDue: number; dueDate: string; status: 'Paid' | 'Pending' | 'Overdue'; }
interface Asset { id: string; name: string; category: string; status: 'In Use' | 'Available' | 'Maintenance'; location: string; assignedTo: string; }
interface Assignment { id: string; title: string; subject: string; grade: string; dueDate: string; status: 'pending' | 'submitted' | 'overdue'; }
interface Grade { studentId: string; subject: string; grade: string; points: number; date: Date; }
interface Attendance { studentId: string; date: string; status: string; }
interface SchoolEvent { date: Date; title: string; type: string; }
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
};

const northwoodStudents: Student[] = [
  { id: 'S001', name: 'Emma Rodriguez', grade: '10', class: 'A', email: 'e.rodriguez@edumanage.com', phone: '+1 (555) 555-1234', address: '123 Main St, Anytown', gpa: 3.8 },
  { id: 'S002', name: 'James Wilson', grade: '10', class: 'A', email: 'j.wilson@edumanage.com', phone: '+1 (555) 555-5678', address: '456 Oak Ave, Anytown', gpa: 3.6 },
  { id: 'S003', name: 'Sofia Kim', grade: '11', class: 'B', email: 's.kim@edumanage.com', phone: '+1 (555) 555-9012', address: '789 Pine Rd, Anytown', gpa: 3.9 },
  { id: 'S004', name: 'Alex Johnson', grade: '9', class: 'C', email: 'a.johnson@edumanage.com', phone: '+1 (555) 555-3456', address: '321 Elm St, Anytown', gpa: 3.5 },
  { id: 'S005', name: 'Olivia Chen', grade: '12', class: 'A', email: 'o.chen@edumanage.com', phone: '+1 (555) 555-7890', address: '159 Maple Dr, Anytown', gpa: 4.0 },
  { id: 'S006', name: 'Liam Garcia', grade: '9', class: 'A', email: 'l.garcia@edumanage.com', phone: '+1 (555) 555-1122', address: '753 Birch Ln, Anytown', gpa: 3.2 },
  { id: 'S007', name: 'Ava Martinez', grade: '11', class: 'A', email: 'a.martinez@edumanage.com', phone: '+1 (555) 555-3344', address: '951 Cedar Ct, Anytown', gpa: 3.7 },
  { id: 'S008', name: 'Noah Brown', grade: '10', class: 'B', email: 'n.brown@edumanage.com', phone: '+1 (555) 555-5566', address: '852 Spruce Ave, Anytown', gpa: 3.4 },
];

const northwoodTeachers: Teacher[] = [
  { id: 'T001', name: 'Prof. Michael Chen', subject: 'Mathematics', email: 'm.chen@edumanage.com', phone: '+1 (555) 111-2222', address: '123 Calculus Rd, Mathville', experience: '8 years', qualifications: 'Ph.D. in Mathematics' },
  { id: 'T002', name: 'Dr. Lisa Anderson', subject: 'Physics', email: 'l.anderson@edumanage.com', phone: '+1 (555) 222-3333', address: '456 Quantum Way, Physburg', experience: '12 years', qualifications: 'Ph.D. in Physics' },
];

const northwoodClasses: Class[] = [
  { id: 'C001', name: 'Class 9-A', grade: '9', teacher: 'Ms. Jennifer Davis', students: 28, room: '101' },
  { id: 'C003', name: 'Class 10-A', grade: '10', teacher: 'Prof. Michael Chen', students: 30, room: '201' },
  { id: 'C004', name: 'Class 11-B', grade: '11', teacher: 'Dr. Lisa Anderson', students: 25, room: '301' },
];

const now = new Date();
const northwoodGrades: Grade[] = [
    { studentId: 'S001', subject: 'Mathematics', grade: 'A-', points: 88, date: new Date(now.getFullYear(), now.getMonth() - 2) },
    { studentId: 'S001', subject: 'Physics', grade: 'B+', points: 85, date: new Date(now.getFullYear(), now.getMonth() - 2) },
    { studentId: 'S002', subject: 'Mathematics', grade: 'B', points: 82, date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S003', subject: 'English', grade: 'C+', points: 75, date: new Date(now.getFullYear(), now.getMonth()) },
];

const northwoodAttendance: Attendance[] = northwoodStudents.flatMap(student => {
  return Array.from({length: 30}).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const rand = Math.random();
    let status = 'present';
    if (rand > 0.95) status = 'absent';
    else if (rand > 0.9) status = 'late';
    return { studentId: student.id, date: date.toISOString().split('T')[0], status };
  });
});

const northwoodFinance: Finance[] = [
  { studentId: 'S001', studentName: 'Emma Rodriguez', amountDue: 1200, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S002', studentName: 'James Wilson', amountDue: 1200, dueDate: '2024-06-30', status: 'Pending' },
  { studentId: 'S003', studentName: 'Sofia Kim', amountDue: 1500, dueDate: '2024-06-30', status: 'Overdue' },
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
};

const oakridgeStudents: Student[] = [
  { id: 'S101', name: 'Benjamin Carter', grade: '10', class: 'A', email: 'b.carter@oakridge.com', phone: '+1 (555) 101-1010', address: '1 Apple St', gpa: 3.9 },
  { id: 'S102', name: 'Charlotte Lee', grade: '11', class: 'A', email: 'c.lee@oakridge.com', phone: '+1 (555) 102-1020', address: '2 Pear Ave', gpa: 3.7 },
  { id: 'S103', name: 'Daniel Park', grade: '9', class: 'B', email: 'd.park@oakridge.com', phone: '+1 (555) 103-1030', address: '3 Cherry Ln', gpa: 3.5 },
];

const oakridgeTeachers: Teacher[] = [
  { id: 'T101', name: 'Ms. Rachel Adams', subject: 'Biology', email: 'r.adams@oakridge.com', phone: '+1 (555) 201-2010', address: '10 Biology Rd', experience: '10 years', qualifications: 'Ph.D. in Biology' },
  { id: 'T102', name: 'Mr. Steven Shaw', subject: 'Geography', email: 's.shaw@oakridge.com', phone: '+1 (555) 202-2020', address: '20 Map Way', experience: '5 years', qualifications: 'M.A. in Geography' },
];

const oakridgeClasses: Class[] = [
  { id: 'C101', name: 'Grade 9 Geo', grade: '9', teacher: 'Mr. Steven Shaw', students: 25, room: 'G1' },
  { id: 'C102', name: 'Grade 10 Bio', grade: '10', teacher: 'Ms. Rachel Adams', students: 30, room: 'L1' },
];

const oakridgeGrades: Grade[] = [
    { studentId: 'S101', subject: 'Biology', grade: 'A', points: 91, date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S102', subject: 'Geography', grade: 'B+', points: 86, date: new Date(now.getFullYear(), now.getMonth() - 1) },
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

const oakridgeFinance: Finance[] = [
  { studentId: 'S101', studentName: 'Benjamin Carter', amountDue: 2200, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S102', studentName: 'Charlotte Lee', amountDue: 2200, dueDate: '2024-06-30', status: 'Pending' },
];


export const schoolData: Record<string, SchoolData> = {
  northwood: {
    profile: northwoodProfile,
    students: northwoodStudents,
    teachers: northwoodTeachers,
    classes: northwoodClasses,
    grades: northwoodGrades,
    attendance: northwoodAttendance,
    finance: northwoodFinance,
    // Using shared data for simplicity in this simulation
    admissions: [
        { id: 'ADM001', name: 'John Smith', appliedFor: 'Grade 9', date: '2024-05-10', status: 'Pending', formerSchool: 'Eastwood Elementary', grades: 'A average in all subjects.' },
        { id: 'ADM002', name: 'Emily White', appliedFor: 'Grade 10', date: '2024-05-09', status: 'Approved', formerSchool: 'Westwood Middle', grades: 'Excellent academic record, especially in sciences.' },
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
    grades: oakridgeGrades,
    attendance: oakridgeAttendance,
    finance: oakridgeFinance,
    // Using shared/generic data for simplicity
    admissions: [
        { id: 'OAK-ADM001', name: 'Alice Wonder', appliedFor: 'Grade 9', date: '2024-05-15', status: 'Approved', formerSchool: 'Wonderland Middle', grades: 'Top of class.' },
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
};
