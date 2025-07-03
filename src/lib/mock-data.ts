

export const teacherCourses = [
  { id: 'PHY101', name: 'Introduction to Physics', schedule: 'Mon, Wed 10:00-11:30', students: 45 },
  { id: 'CHEM202', name: 'Organic Chemistry', schedule: 'Tue, Thu 13:00-14:30', students: 32 },
  { id: 'BIO101', name: 'Biology Basics', schedule: 'Mon, Wed 13:00-14:30', students: 50 },
  { id: 'MATH301', name: 'Advanced Calculus', schedule: 'Fri 9:00-11:00', students: 25 },
  { id: 'HIST201', name: 'Modern History', schedule: 'Tue, Thu 9:00-10:30', students: 40 },
  { id: 'CS101', name: 'Intro to Programming', schedule: 'Mon, Wed 15:00-16:30', students: 35 },
];

export const studentCourses = [
  { id: 'PHY101', name: 'Physics Intro', teacher: 'Dr. Evelyn Reed', grade: 'A-', progress: 85 },
  { id: 'ENG201', name: 'Modern Literature', teacher: 'Prof. Hemlock', grade: 'B+', progress: 70 },
  { id: 'CS101', name: 'Programming Intro', teacher: 'Mrs. Patricia Wright', grade: 'A', progress: 92 },
  { id: 'HIST105', name: 'World History', teacher: 'Dr. David Lee', grade: 'C+', progress: 65 },
  { id: 'ART210', name: 'Art History', teacher: 'Ms. Emily White', grade: 'B', progress: 80 },
  { id: 'PE100', name: 'Physical Education', teacher: 'Mr. Chris Green', grade: 'A+', progress: 95 },
];

export const events = [
    { date: new Date(new Date().setDate(new Date().getDate() + 3)), title: 'Science Fair', type: 'Academic' },
    { date: new Date(new Date().setDate(new Date().getDate() + 10)), title: 'Mid-term Exams Start', type: 'Academic' },
    { date: new Date(new Date().setDate(new Date().getDate() + 20)), title: 'Parent-Teacher Conference', type: 'Meeting' },
    { date: new Date(new Date().setMonth(new Date().getMonth() + 1)), title: 'Spring Break', type: 'Holiday' },
    { date: new Date(new Date().setDate(new Date().getDate() + 25)), title: 'Basketball Championship', type: 'Sports' },
    { date: new Date(new Date().setDate(new Date().getDate() + 35)), title: 'Annual Sports Day', type: 'Sports' },
    { date: new Date(new Date().setDate(new Date().getDate() + 45)), title: 'School Play', type: 'Cultural' },
    { date: new Date(new Date().setDate(new Date().getDate() + 50)), title: 'Charity Bake Sale', type: 'Community' },
];

export const users = [
  { id: 'usr_001', name: 'Dr. Sarah Johnson', email: 's.johnson@edumanage.com', role: 'Admin', status: 'Active' },
  { id: 'usr_002', name: 'Prof. Michael Chen', email: 'm.chen@edumanage.com', role: 'Teacher', status: 'Active' },
  { id: 'usr_003', name: 'Emma Rodriguez', email: 'e.rodriguez@edumanage.com', role: 'Student', status: 'Active' },
  { id: 'usr_004', name: 'James Wilson', email: 'j.wilson@edumanage.com', role: 'Student', status: 'Active' },
  { id: 'usr_005', name: 'Dr. Lisa Anderson', email: 'l.anderson@edumanage.com', role: 'Teacher', status: 'Inactive' },
  { id: 'usr_006', name: 'Sofia Kim', email: 's.kim@edumanage.com', role: 'Student', status: 'Active' },
  { id: 'usr_007', name: 'Olivia Chen', email: 'o.chen@edumanage.com', role: 'Student', status: 'Active' },
  { id: 'usr_008', name: 'Dr. David Lee', email: 'd.lee@edumanage.com', role: 'Teacher', status: 'Active' },
];

export const studentsData = [
  { id: 'S001', name: 'Emma Rodriguez', grade: '10', class: 'A', email: 'e.rodriguez@edumanage.com', phone: '+1 (555) 555-1234', address: '123 Main St, Anytown', gpa: 3.8 },
  { id: 'S002', name: 'James Wilson', grade: '10', class: 'A', email: 'j.wilson@edumanage.com', phone: '+1 (555) 555-5678', address: '456 Oak Ave, Anytown', gpa: 3.6 },
  { id: 'S003', name: 'Sofia Kim', grade: '11', class: 'B', email: 's.kim@edumanage.com', phone: '+1 (555) 555-9012', address: '789 Pine Rd, Anytown', gpa: 3.9 },
  { id: 'S004', name: 'Alex Johnson', grade: '9', class: 'C', email: 'a.johnson@edumanage.com', phone: '+1 (555) 555-3456', address: '321 Elm St, Anytown', gpa: 3.5 },
  { id: 'S005', name: 'Olivia Chen', grade: '12', class: 'A', email: 'o.chen@edumanage.com', phone: '+1 (555) 555-7890', address: '159 Maple Dr, Anytown', gpa: 4.0 },
  { id: 'S006', name: 'Liam Garcia', grade: '9', class: 'A', email: 'l.garcia@edumanage.com', phone: '+1 (555) 555-1122', address: '753 Birch Ln, Anytown', gpa: 3.2 },
  { id: 'S007', name: 'Ava Martinez', grade: '11', class: 'A', email: 'a.martinez@edumanage.com', phone: '+1 (555) 555-3344', address: '951 Cedar Ct, Anytown', gpa: 3.7 },
  { id: 'S008', name: 'Noah Brown', grade: '10', class: 'B', email: 'n.brown@edumanage.com', phone: '+1 (555) 555-5566', address: '852 Spruce Ave, Anytown', gpa: 3.4 },
  { id: 'S009', name: 'Isabella Davis', grade: '12', class: 'A', email: 'i.davis@edumanage.com', phone: '+1 (555) 555-7788', address: '654 Willow Way, Anytown', gpa: 3.9 },
  { id: 'S010', name: 'Mason Miller', grade: '9', class: 'B', email: 'm.miller@edumanage.com', phone: '+1 (555) 555-9900', address: '486 Aspen Pl, Anytown', gpa: 3.1 },
  { id: 'S011', name: 'Sophia Wilson', grade: '10', class: 'C', email: 's.wilson@edumanage.com', phone: '+1 (555) 666-1212', address: '246 Redwood Rd, Anytown', gpa: 3.85 },
  { id: 'S012', name: 'Ethan Moore', grade: '11', class: 'B', email: 'e.moore@edumanage.com', phone: '+1 (555) 666-3434', address: '135 Juniper St, Anytown', gpa: 3.65 },
  { id: 'S013', name: 'Mia Taylor', grade: '12', class: 'B', email: 'm.taylor@edumanage.com', phone: '+1 (555) 666-5656', address: '798 Poplar Blvd, Anytown', gpa: 3.78 },
  { id: 'S014', name: 'Lucas Anderson', grade: '9', class: 'A', email: 'l.anderson@edumanage.com', phone: '+1 (555) 666-7878', address: '102 Magnolia Ave, Anytown', gpa: 3.95 },
  { id: 'S015', name: 'Harper Thomas', grade: '10', class: 'A', email: 'h.thomas@edumanage.com', phone: '+1 (555) 666-9090', address: '305 Palm St, Anytown', gpa: 3.55 },
];

export const teachersData = [
  { id: 'T001', name: 'Prof. Michael Chen', subject: 'Mathematics', email: 'm.chen@edumanage.com', phone: '+1 (555) 111-2222', address: '123 Calculus Rd, Mathville', experience: '8 years', qualifications: 'Ph.D. in Mathematics' },
  { id: 'T002', name: 'Dr. Lisa Anderson', subject: 'Physics', email: 'l.anderson@edumanage.com', phone: '+1 (555) 222-3333', address: '456 Quantum Way, Physburg', experience: '12 years', qualifications: 'Ph.D. in Physics' },
  { id: 'T003', name: 'Ms. Jennifer Davis', subject: 'English', email: 'j.davis@edumanage.com', phone: '+1 (555) 333-4444', address: '789 Sonnet Lane, Lit Town', experience: '6 years', qualifications: 'M.A. in English Literature' },
  { id: 'T004', name: 'Mr. Robert Smith', subject: 'Chemistry', email: 'r.smith@edumanage.com', phone: '+1 (555) 444-5555', address: '101 Molecule St, Chemtown', experience: '10 years', qualifications: 'M.Sc. in Chemistry' },
  { id: 'T005', name: 'Dr. David Lee', subject: 'History', email: 'd.lee@edumanage.com', phone: '+1 (555) 555-6666', address: '222 Archive Ave, Historiacity', experience: '15 years', qualifications: 'Ph.D. in History' },
  { id: 'T006', name: 'Ms. Emily White', subject: 'Art', email: 'e.white@edumanage.com', phone: '+1 (555) 666-7777', address: '333 Canvas Court, Artville', experience: '5 years', qualifications: 'M.F.A. in Fine Arts' },
  { id: 'T007', name: 'Mr. Chris Green', subject: 'Physical Education', email: 'c.green@edumanage.com', phone: '+1 (555) 777-8888', address: '444 Stadium St, Sportstown', experience: '7 years', qualifications: 'B.Sc. in Kinesiology' },
  { id: 'T008', name: 'Mrs. Patricia Wright', subject: 'Computer Science', email: 'p.wright@edumanage.com', phone: '+1 (555) 888-9999', address: '555 Binary Blvd, Techtown', experience: '9 years', qualifications: 'M.S. in Computer Science' },
];

export const classesData = [
  { id: 'C001', name: 'Class 9-A', grade: '9', teacher: 'Ms. Jennifer Davis', students: 28, room: '101' },
  { id: 'C002', name: 'Class 9-B', grade: '9', teacher: 'Mr. Robert Smith', students: 26, room: '102' },
  { id: 'C003', name: 'Class 10-A', grade: '10', teacher: 'Prof. Michael Chen', students: 30, room: '201' },
  { id: 'C004', name: 'Class 11-B', grade: '11', teacher: 'Dr. Lisa Anderson', students: 25, room: '301' },
  { id: 'C005', name: 'Class 9-C', grade: '9', teacher: 'Dr. David Lee', students: 27, room: '103' },
  { id: 'C006', name: 'Class 10-B', grade: '10', teacher: 'Mrs. Patricia Wright', students: 29, room: '202' },
  { id: 'C007', name: 'Class 11-A', grade: '11', teacher: 'Ms. Emily White', students: 24, room: '302' },
  { id: 'C008', name: 'Class 12-A', grade: '12', teacher: 'Prof. Michael Chen', students: 22, room: '401' },
];

export const assignments = [
    { id: 'A001', title: 'Math Problem Set 5', subject: 'Mathematics', grade: '10', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), status: 'pending' },
    { id: 'A002', title: 'Physics Lab Report', subject: 'Physics', grade: '11', dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: 'submitted' },
    { id: 'A003', title: 'English Essay Draft', subject: 'English', grade: '9', dueDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), status: 'pending' },
    { id: 'A004', name: 'History Reading Questions', subject: 'World History', grade: '10', dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), status: 'overdue' },
    { id: 'A005', title: 'Chemistry Quiz Prep', subject: 'Chemistry', grade: '11', dueDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(), status: 'pending' },
    { id: 'A006', title: 'Final Art Project Proposal', subject: 'Art', grade: '11', dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), status: 'pending' },
    { id: 'A007', title: 'Data Structures Exercise', subject: 'Computer Science', grade: '10', dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: 'submitted' },
];

const now = new Date();
export const grades = [
    { studentId: 'S001', subject: 'Mathematics', grade: 'A-', points: 88, date: new Date(now.getFullYear(), now.getMonth() - 2) },
    { studentId: 'S001', subject: 'Physics', grade: 'B+', points: 85, date: new Date(now.getFullYear(), now.getMonth() - 2) },
    { studentId: 'S001', subject: 'English', grade: 'A', points: 92, date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S002', subject: 'Mathematics', grade: 'B', points: 82, date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S002', subject: 'Chemistry', grade: 'A-', points: 87, date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S003', subject: 'English', grade: 'C+', points: 75, date: new Date(now.getFullYear(), now.getMonth()) },
    { studentId: 'S004', subject: 'Physics', grade: 'B-', points: 80, date: new Date(now.getFullYear(), now.getMonth()) },
    { studentId: 'S003', subject: 'Mathematics', grade: 'A', points: 95, date: new Date(now.getFullYear(), now.getMonth()) },
    { studentId: 'S004', subject: 'English', grade: 'B', points: 83, date: new Date(now.getFullYear(), now.getMonth() - 2) },
    { studentId: 'S005', subject: 'Physics', grade: 'A+', points: 98, date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S006', subject: 'Mathematics', grade: 'C', points: 71, date: new Date(now.getFullYear(), now.getMonth()) },
    { studentId: 'S007', subject: 'Art', grade: 'A', points: 94, date: new Date(now.getFullYear(), now.getMonth() - 1) },
    { studentId: 'S008', subject: 'Computer Science', grade: 'B+', points: 86, date: new Date(now.getFullYear(), now.getMonth()) },
];

const generateAttendance = () => {
  const records = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    studentsData.forEach(student => {
      const rand = Math.random();
      let status = 'present';
      if (rand > 0.95) status = 'absent';
      else if (rand > 0.9) status = 'late';
      records.push({ studentId: student.id, date: date.toISOString().split('T')[0], status });
    });
  }
  return records;
};

export const attendance = generateAttendance();


export const admissionsData = [
  { id: 'ADM001', name: 'John Smith', appliedFor: 'Grade 9', date: '2024-05-10', status: 'Pending', formerSchool: 'Eastwood Elementary', grades: 'A average in all subjects.' },
  { id: 'ADM002', name: 'Emily White', appliedFor: 'Grade 10', date: '2024-05-09', status: 'Approved', formerSchool: 'Westwood Middle', grades: 'Excellent academic record, especially in sciences.' },
  { id: 'ADM003', name: 'David Green', appliedFor: 'Grade 9', date: '2024-05-08', status: 'Rejected', formerSchool: 'Northwood Prep', grades: 'Below average scores in core subjects.' },
  { id: 'ADM004', name: 'Jessica Blue', appliedFor: 'Grade 11', date: '2024-05-11', status: 'Pending', formerSchool: 'Southwood High', grades: 'Strong in STEM subjects, transcript attached.' },
  { id: 'ADM005', name: 'Michael Black', appliedFor: 'Grade 9', date: '2024-05-12', status: 'Pending', formerSchool: 'Central Academy', grades: 'Good overall record.' },
  { id: 'ADM006', name: 'Sarah Grey', appliedFor: 'Grade 10', date: '2024-05-13', status: 'Approved', formerSchool: 'Riverdale High', grades: 'Top 5% of her class.' },
];

export const examsData = [
  { id: 'EXM001', title: 'Mid-term Mathematics', subject: 'Mathematics', grade: '10', date: new Date(new Date().setDate(new Date().getDate() + 10)), time: '09:00', duration: '2 hours', room: '201', board: 'Internal' },
  { id: 'EXM002', title: 'Physics Quiz', subject: 'Physics', grade: '11', date: new Date(new Date().setDate(new Date().getDate() + 12)), time: '10:00', duration: '1 hour', room: '301', board: 'Internal' },
  { id: 'EXM003', title: 'English Essay', subject: 'English', grade: '9', date: new Date(new Date().setDate(new Date().getDate() + 15)), time: '11:00', duration: '90 minutes', room: '101', board: 'Internal' },
  { id: 'EXM004', title: 'IGCSE Physics Paper 4', subject: 'Physics', grade: '10', date: new Date(new Date().setDate(new Date().getDate() + 20)), time: '13:00', duration: '75 minutes', room: 'Hall A', board: 'Cambridge' },
  { id: 'EXM005', title: 'AP Calculus BC', subject: 'Mathematics', grade: '12', date: new Date(new Date().setDate(new Date().getDate() + 22)), time: '08:00', duration: '3 hours 15 mins', room: 'Hall B', board: 'Advanced Placement' },
  { id: 'EXM006', title: 'IB History HL Paper 1', subject: 'History', grade: '12', date: new Date(new Date().setDate(new Date().getDate() + 25)), time: '13:00', duration: '1 hour', room: '401', board: 'IB' },
];

export const financeData = [
  { studentId: 'S001', studentName: 'Emma Rodriguez', amountDue: 1200, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S002', studentName: 'James Wilson', amountDue: 1200, dueDate: '2024-06-30', status: 'Pending' },
  { studentId: 'S003', studentName: 'Sofia Kim', amountDue: 1500, dueDate: '2024-06-30', status: 'Overdue' },
  { studentId: 'S004', studentName: 'Alex Johnson', amountDue: 950, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S005', studentName: 'Olivia Chen', amountDue: 1500, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S006', studentName: 'Liam Garcia', amountDue: 950, dueDate: '2024-06-30', status: 'Pending' },
  { studentId: 'S007', studentName: 'Ava Martinez', amountDue: 1500, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S008', studentName: 'Noah Brown', amountDue: 1200, dueDate: '2024-06-30', status: 'Overdue' },
  { studentId: 'S009', studentName: 'Isabella Davis', amountDue: 1500, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S010', studentName: 'Mason Miller', amountDue: 950, dueDate: '2024-06-30', status: 'Pending' },
  { studentId: 'S011', studentName: 'Sophia Wilson', amountDue: 1200, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S012', studentName: 'Ethan Moore', amountDue: 1500, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S013', studentName: 'Mia Taylor', amountDue: 1500, dueDate: '2024-06-30', status: 'Overdue' },
  { studentId: 'S014', studentName: 'Lucas Anderson', amountDue: 950, dueDate: '2024-06-30', status: 'Paid' },
  { studentId: 'S015', studentName: 'Harper Thomas', amountDue: 1200, dueDate: '2024-06-30', status: 'Pending' },
];

export const assetsData = [
  { id: 'ASSET001', name: 'Dell Latitude Laptop', category: 'IT Equipment', status: 'In Use', location: 'Room 201', assignedTo: 'Prof. Michael Chen' },
  { id: 'ASSET002', name: 'Epson Projector', category: 'AV Equipment', status: 'Available', location: 'Storage', assignedTo: 'N/A' },
  { id: 'ASSET003', name: 'Student Desk', category: 'Furniture', status: 'In Use', location: 'Room 101', assignedTo: 'N/A' },
  { id: 'ASSET004', name: 'Microscope', category: 'Lab Equipment', status: 'In Use', location: 'Science Lab', assignedTo: 'Dr. Lisa Anderson' },
  { id: 'ASSET005', name: 'HP LaserJet Printer', category: 'IT Equipment', status: 'Maintenance', location: 'Admin Office', assignedTo: 'N/A' },
  { id: 'ASSET006', name: 'Basketballs (Set of 10)', category: 'Sports Equipment', status: 'Available', location: 'Gym', assignedTo: 'Mr. Chris Green' },
  { id: 'ASSET007', name: 'MacBook Pro 14"', category: 'IT Equipment', status: 'In Use', location: 'Art Room', assignedTo: 'Ms. Emily White' },
];

export const schoolProfileData = {
  name: 'Northwood High School',
  head: 'Dr. Sarah Johnson',
  address: '123 Education Lane, Anytown, USA 12345',
  phone: '+1 (555) 123-4567',
  email: 'contact@northwoodhigh.edu',
  motto: 'Excellence in Education',
};
