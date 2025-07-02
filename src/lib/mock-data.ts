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
