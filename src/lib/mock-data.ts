
export const teacherCourses = [
  { id: 'PHY101', name: 'Introduction to Physics', schedule: 'Mon, Wed 10:00-11:30', students: 45 },
  { id: 'CHEM202', name: 'Organic Chemistry', schedule: 'Tue, Thu 13:00-14:30', students: 32 },
  { id: 'BIO101', name: 'Biology Basics', schedule: 'Mon, Wed 13:00-14:30', students: 50 },
  { id: 'MATH301', name: 'Advanced Calculus', schedule: 'Fri 9:00-11:00', students: 25 },
];

export const studentCourses = [
  { id: 'PHY101', name: 'Introduction to Physics', teacher: 'Dr. Evelyn Reed', grade: 'A-', progress: 85 },
  { id: 'ENG201', name: 'Modern Literature', teacher: 'Prof. Hemlock', grade: 'B+', progress: 70 },
  { id: 'CS101', name: 'Introduction to Programming', teacher: 'Dr. Turing', grade: 'A', progress: 92 },
  { id: 'HIST105', name: 'World History', teacher: 'Prof. Jones', grade: 'C+', progress: 65 },
  { id: 'ART210', name: 'Art History', teacher: 'Ms. Kahlo', grade: 'B', progress: 80 },
  { id: 'PE100', name: 'Physical Education', teacher: 'Coach Armstrong', grade: 'A+', progress: 95 },
];

export const events = [
    { date: new Date(new Date().setDate(new Date().getDate() + 3)), title: 'Science Fair' },
    { date: new Date(new Date().setDate(new Date().getDate() + 10)), title: 'Mid-term Exams Start' },
    { date: new Date(new Date().setDate(new Date().getDate() + 20)), title: 'Parent-Teacher Conference' },
    { date: new Date(new Date().setMonth(new Date().getMonth() + 1)), title: 'Spring Break' },
];

export const users = [
  { id: 'usr_001', name: 'Dr. Sarah Johnson', email: 's.johnson@edumanage.com', role: 'Admin', status: 'Active' },
  { id: 'usr_002', name: 'Prof. Michael Chen', email: 'm.chen@edumanage.com', role: 'Teacher', status: 'Active' },
  { id: 'usr_003', name: 'Emma Rodriguez', email: 'e.rodriguez@edumanage.com', role: 'Student', status: 'Active' },
  { id: 'usr_004', name: 'James Wilson', email: 'j.wilson@edumanage.com', role: 'Student', status: 'Active' },
  { id: 'usr_005', name: 'Dr. Lisa Anderson', email: 'l.anderson@edumanage.com', role: 'Teacher', status: 'Inactive' },
  { id: 'usr_006', name: 'Sofia Kim', email: 's.kim@edumanage.com', role: 'Student', status: 'Active' },
];

export const studentsData = [
  { id: 'S001', name: 'Emma Rodriguez', grade: '10', class: '10-A', email: 'e.rodriguez@edumanage.com', gpa: 3.8 },
  { id: 'S002', name: 'James Wilson', grade: '10', class: '10-A', email: 'j.wilson@edumanage.com', gpa: 3.6 },
  { id: 'S003', name: 'Sofia Kim', grade: '11', class: '11-B', email: 's.kim@edumanage.com', gpa: 3.9 },
  { id: 'S004', name: 'Alex Johnson', grade: '9', class: '9-C', email: 'a.johnson@edumanage.com', gpa: 3.5 }
];

export const teachersData = [
  { id: 'T001', name: 'Prof. Michael Chen', subject: 'Mathematics', email: 'm.chen@edumanage.com', experience: '8 years', qualifications: 'Ph.D. in Mathematics' },
  { id: 'T002', name: 'Dr. Lisa Anderson', subject: 'Physics', email: 'l.anderson@edumanage.com', experience: '12 years', qualifications: 'Ph.D. in Physics' },
  { id: 'T003', name: 'Ms. Jennifer Davis', subject: 'English', email: 'j.davis@edumanage.com', experience: '6 years', qualifications: 'M.A. in English Literature' },
  { id: 'T004', name: 'Mr. Robert Smith', subject: 'Chemistry', email: 'r.smith@edumanage.com', experience: '10 years', qualifications: 'M.Sc. in Chemistry' }
];

export const classesData = [
  { id: 'C001', name: 'Class 9-A', grade: '9', teacher: 'Ms. Jennifer Davis', students: 28, room: '101' },
  { id: 'C002', name: 'Class 9-B', grade: '9', teacher: 'Mr. Robert Smith', students: 26, room: '102' },
  { id: 'C003', name: 'Class 10-A', grade: '10', teacher: 'Prof. Michael Chen', students: 30, room: '201' },
  { id: 'C004', name: 'Class 11-B', grade: '11', teacher: 'Dr. Lisa Anderson', students: 25, room: '301' }
];
