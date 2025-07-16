

import { type CreateLessonPlanOutput } from "@/ai/flows/create-lesson-plan";
import { type GenerateTestOutput } from "@/ai/flows/generate-test";
import { type Role } from "@/context/auth-context";

export interface FinanceRecord { id: string; studentId: string; studentName: string; description: string; totalAmount: number; amountPaid: number; dueDate: string; }
export interface Expense { id: string; description: string; category: string; amount: number; date: string; proofUrl: string; }
export interface Team { id: string; name: string; coach: string; playerIds: string[]; icon: string; }
export interface Competition {
  id: string;
  title: string;
  ourTeamId: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  result?: {
    ourScore: number;
    opponentScore: number;
    outcome: 'Win' | 'Loss' | 'Draw';
  };
}
export interface AcademicTerm { id: string; name: string; startDate: string; endDate: string; }
export interface Holiday { id: string; name: string; date: string; }
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
  createdAt: string;
  weeklySyllabus: string;
}

export interface SyllabusTopic {
  id: string;
  topic: string;
  subtopics: string[];
  week: number;
}

export interface Syllabus {
  subject: string;
  grade: string;
  topics: SyllabusTopic[];
}


export interface SavedTest extends GenerateTestOutput {
    id: string;
    subject: string;
    topic: string;
    gradeLevel: string;
    createdAt: string;
}

export interface DeployedTest {
  id: string;
  testId: string; // Corresponds to SavedTest id
  classId: string;
  deadline: string;
  createdAt: string;
  submissions: Array<{
    studentId: string;
    answers: Record<number, string>; // question index -> selected option
    score: number; // Score out of 20
    submittedAt: string;
  }>;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  schoolId: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface Message {
  id: string;
  timestamp: string;
  schoolId: string;
  senderUsername: string; // email
  senderName: string;
  senderRole: Role;
  recipientUsername: string; // email
  recipientName: string;
  recipientRole: Role;
  subject: string;
  body: string;
  status: 'Pending' | 'Resolved';
  isRead: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface SavedReport {
  id: string;
  type: 'ClassPerformance' | 'TeacherPerformance' | 'SchoolPerformance' | 'StrugglingStudents';
  targetId: string; // e.g., classId, teacherId, schoolId
  targetName: string; // e.g., "Class 10-A", "Prof. Michael Chen"
  generatedAt: string;
  result: any; // This will hold the output from the specific flow
}

export interface AwardPrize {
  description: string;
  hasCertificate: boolean;
}

export interface AwardConfig {
  topSchool: AwardPrize[];
  topStudent: AwardPrize[];
  topTeacher: AwardPrize[];
}

export interface KioskMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface SchoolData {
    profile: SchoolProfile;
    students: Student[];
    teachers: Teacher[];
    classes: Class[];
    courses: Course[];
    lessonPlans: LessonPlan[];
    syllabi: Syllabus[];
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
    savedReports: SavedReport[];
    kioskMedia: KioskMedia[];
}

export interface KioskConfig {
    showDashboard: boolean;
    showLeaderboard: boolean;
    showAttendance: boolean;
    showAcademics: boolean;
    showAwards: boolean;
    showPerformers: boolean;
    showAwardWinner: boolean;
    showShowcase: boolean;
}

export interface BehavioralAssessment {
    id: string;
    studentId: string;
    date: string;
    teacherId: string;
    respect: 1 | 2 | 3 | 4 | 5;
    participation: 1 | 2 | 3 | 4 | 5;
    socialSkills: 1 | 2 | 3 | 4 | 5;
    conduct: 1 | 2 | 3 | 4 | 5;
    comment: string;
}

export interface SchoolProfile { id: string; name: string; head: string; address: string; phone: string; email: string; motto: string; logoUrl: string; certificateTemplateUrl?: string; transcriptTemplateUrl?: string; tier?: 'Premium' | 'Pro' | 'Starter'; gradingSystem: '20-Point' | 'GPA' | 'Letter'; currency: 'USD' | 'ZAR' | 'MZN' | 'BWP' | 'NAD' | 'ZMW' | 'MWK' | 'AOA' | 'TZS' | 'ZWL'; status: 'Active' | 'Suspended' | 'Inactive'; gradeCapacity: Record<string, number>; kioskConfig: KioskConfig; schoolLevel: 'Primary' | 'Secondary' | 'Full'; }
export interface Student { id: string; name: string; grade: string; class: string; email: string; phone: string; address: string; schoolId?: string; schoolName?: string; parentName: string; parentEmail: string; dateOfBirth: string; status: 'Active' | 'Inactive' | 'Transferred'; sex: 'Male' | 'Female'; behavioralAssessments: BehavioralAssessment[]; }
export interface Teacher { id: string; name: string; subject: string; email: string; phone: string; address: string; experience: string; qualifications: string; status: 'Active' | 'Inactive' | 'Transferred'; sex: 'Male' | 'Female'; }
export interface Class { id: string; name: string; grade: string; teacher: string; students: number; room: string; }
export interface Admission { id: string; name: string; appliedFor: string; date: string; status: 'Pending' | 'Approved' | 'Rejected'; formerSchool: string; grades: string; parentName: string; parentEmail: string; dateOfBirth: string; sex: 'Male' | 'Female'; }
interface Exam { id: string; title: string; subject: string; grade: string; date: string; time: string; duration: string; room: string; board: string; invigilator: string; }
interface Asset { id: string; name: string; category: string; status: 'In Use' | 'Available' | 'Maintenance'; location: string; assignedTo: string; }
interface Assignment { id: string; title: string; subject: string; grade: string; dueDate: string; status: 'pending' | 'submitted' | 'overdue'; }
export interface Grade { studentId: string; subject: string; grade: string; date: string; }
export interface Attendance { id: string; studentId: string; date: string; courseId: string; status: 'Present' | 'Late' | 'Absent' | 'Sick'; }
export interface SchoolEvent { id: string; date: string; title: string; type: string; location: string; organizer: string; audience: string; schoolName?: string; }

const now = new Date();
const currentYear = now.getFullYear();

const defaultGradeCapacity = { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 };

const defaultKioskConfig: KioskConfig = {
    showDashboard: true,
    showLeaderboard: true,
    showAttendance: false,
    showAcademics: false,
    showAwards: false,
    showPerformers: true,
    showAwardWinner: true,
    showShowcase: false,
};

const teteSyllabi: Syllabus[] = [
  {
    subject: 'Matemática',
    grade: '10',
    topics: [
      { id: 'M10-1', topic: 'Álgebra Linear', subtopics: ['Sistemas de Equações', 'Matrizes', 'Determinantes'], week: 35 },
      { id: 'M10-2', topic: 'Funções Quadráticas', subtopics: ['Gráficos de Parábolas', 'Vértice e Eixo de Simetria', 'Aplicações'], week: 36 },
      { id: 'M10-3', topic: 'Trigonometria', subtopics: ['Seno, Cosseno, Tangente', 'Círculo Trigonométrico', 'Equações Trigonométricas'], week: 37 },
    ],
  },
  {
    subject: 'Português',
    grade: '9',
    topics: [
      { id: 'P9-1', topic: 'Análise Sintática', subtopics: ['Sujeito e Predicado', 'Tipos de Sujeito', 'Complementos Verbais'], week: 35 },
      { id: 'P9-2', topic: 'Figuras de Linguagem', subtopics: ['Metáfora', 'Metonímia', 'Hipérbole'], week: 36 },
    ],
  },
];

// --- Data for School 1: Tete Junior Primary School ---
const teteProfile: SchoolProfile = { id: 'northwood', name: 'Tete Junior Primary School', head: 'Dra. Sara João', address: 'Av. da Independência, Tete, Mozambique', phone: '+258 84 123 4567', email: 's.joao@tetejunior.edu.mz', motto: 'Educação de Excelência', logoUrl: 'https://placehold.co/100x100.png', certificateTemplateUrl: 'https://placehold.co/800x600.png', transcriptTemplateUrl: 'https://placehold.co/600x800.png', tier: 'Starter', gradingSystem: '20-Point', currency: 'MZN', status: 'Active', gradeCapacity: defaultGradeCapacity, kioskConfig: defaultKioskConfig, schoolLevel: 'Primary' };
const teteStudents: Student[] = [ { id: 'S001', name: 'Joana Silva', grade: '10', class: 'A', email: 'j.silva@edumanage.com', phone: '+258 84 555 1234', address: 'Rua das Acácias 123, Tete', parentName: 'Maria Silva', parentEmail: 'm.silva@family.com', dateOfBirth: '2008-05-21', status: 'Active', sex: 'Female', behavioralAssessments: [] }, { id: 'S002', name: 'Pedro Santos', grade: '10', class: 'A', email: 'p.santos@edumanage.com', phone: '+258 84 555 5678', address: 'Av. 25 de Setembro 456, Tete', parentName: 'Roberto Santos', parentEmail: 'r.santos@family.com', dateOfBirth: '2008-03-15', status: 'Active', sex: 'Male', behavioralAssessments: [] }, { id: 'S003', name: 'Sofia Costa', grade: '11', class: 'B', email: 's.costa@edumanage.com', phone: '+258 84 555 9012', address: 'Bairro da Matema 789, Tete', parentName: 'Daniel Costa', parentEmail: 'd.costa@family.com', dateOfBirth: '2007-11-30', status: 'Active', sex: 'Female', behavioralAssessments: [] }, { id: 'S004', name: 'Miguel Pereira', grade: '9', class: 'C', email: 'm.pereira@edumanage.com', phone: '+258 84 555 3456', address: 'Av. Julius Nyerere 321, Tete', parentName: 'Jéssica Pereira', parentEmail: 'j.pereira@family.com', dateOfBirth: '2009-08-10', status: 'Active', sex: 'Male', behavioralAssessments: [] }, { id: 'S005', name: 'Beatriz Fernandes', grade: '12', class: 'A', email: 'b.fernandes@edumanage.com', phone: '+258 84 555 7890', address: 'Rua do Comércio 159, Tete', parentName: 'Carlos Fernandes', parentEmail: 'c.fernandes@family.com', dateOfBirth: '2006-01-25', status: 'Active', sex: 'Female', behavioralAssessments: [] }, { id: 'S006', name: 'Tiago Gonçalves', grade: '9', class: 'A', email: 't.goncalves@edumanage.com', phone: '+258 84 555 1122', address: 'Rua da Mesquita 753, Tete', parentName: 'Isabela Gonçalves', parentEmail: 'i.goncalves@family.com', dateOfBirth: '2009-06-12', status: 'Active', sex: 'Male', behavioralAssessments: [] }, { id: 'S007', name: 'Leonor Rodrigues', grade: '11', class: 'A', email: 'l.rodrigues@edumanage.com', phone: '+258 84 555 3344', address: 'Av. da Liberdade 951, Tete', parentName: 'David Rodrigues', parentEmail: 'd.rodrigues@family.com', dateOfBirth: '2007-09-05', status: 'Active', sex: 'Female', behavioralAssessments: [] }, { id: 'S008', name: 'Francisco Alves', grade: '10', class: 'B', email: 'f.alves@edumanage.com', phone: '+258 84 555 5566', address: 'Rua dos Desportistas 852, Tete', parentName: 'Linda Alves', parentEmail: 'l.alves@family.com', dateOfBirth: '2008-07-22', status: 'Active', sex: 'Male', behavioralAssessments: [] }, { id: 'S009', name: 'Mariana Almeida', grade: '9', class: 'B', email: 'm.almeida@edumanage.com', phone: '+258 84 555 7788', address: 'Rua do Rio 147, Tete', parentName: 'Paulo Almeida', parentEmail: 'p.almeida@family.com', dateOfBirth: '2009-02-18', status: 'Active', sex: 'Female', behavioralAssessments: [] }, { id: 'S010', name: 'Diogo Ribeiro', grade: '12', class: 'C', email: 'd.ribeiro@edumanage.com', phone: '+258 84 555 9999', address: 'Av. Marginal 456, Tete', parentName: 'Jorge Ribeiro', parentEmail: 'j.ribeiro@family.com', dateOfBirth: '2006-04-01', status: 'Active', sex: 'Male', behavioralAssessments: [] }, ];
const teteTeachers: Teacher[] = [ { id: 'T001', name: 'Prof. Miguel Carvalho', subject: 'Matemática', email: 'm.carvalho@edumanage.com', phone: '+258 82 111 2222', address: 'Rua da Matemática 123, Tete', experience: '8 years', qualifications: 'Doutoramento em Matemática', status: 'Active', sex: 'Male' }, { id: 'T002', name: 'Dra. Lúcia Andrade', subject: 'Física', email: 'l.andrade@edumanage.com', phone: '+258 82 222 3333', address: 'Av. da Ciência 456, Tete', experience: '12 years', qualifications: 'Doutoramento em Física', status: 'Inactive', sex: 'Female' }, { id: 'T003', name: 'Sra. Joana Mendes', subject: 'Português', email: 'j.mendes@tetejunior.edu.mz', phone: '+258 82 111 3333', address: 'Rua da Literatura 101, Tete', experience: '5 years', qualifications: 'Mestrado em Letras', status: 'Active', sex: 'Female' }, ];
const teteClasses: Class[] = [ { id: 'C001', name: 'Turma 9-A', grade: '9', teacher: 'Sra. Joana Mendes', students: 28, room: '101' }, { id: 'C002', name: 'Turma 9-C', grade: '9', teacher: 'Prof. Miguel Carvalho', students: 22, room: '103' }, { id: 'C003', name: 'Turma 10-A', grade: '10', teacher: 'Prof. Miguel Carvalho', students: 30, room: '201' }, { id: 'C004', name: 'Turma 11-B', grade: '11', teacher: 'Dra. Lúcia Andrade', students: 25, room: '301' }, ];
const teteTeams: Team[] = [ { id: 'TEAM01', name: 'Basquete Águias', coach: 'Prof. Miguel Carvalho', playerIds: ['S002', 'S005', 'S008'], icon: '🏀' }, { id: 'TEAM02', name: 'Futebol Leões', coach: 'Sra. Joana Mendes', playerIds: ['S001', 'S004', 'S006', 'S007'], icon: '⚽' }, { id: 'TEAM03', name: 'Natação Tubarões', coach: 'Dra. Lúcia Andrade', playerIds: ['S003'], icon: '🏊' }, ];
const teteCompetitions: Competition[] = [ { id: 'COMP01', title: 'Jogo do Campeonato', ourTeamId: 'TEAM01', opponent: 'Serpentes do Sul', date: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(), time: '18:00', location: 'Ginásio Principal' }, { id: 'COMP02', title: 'Jogo Fora', ourTeamId: 'TEAM02', opponent: 'Carvalhos de Oakridge', date: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(), time: '15:30', location: 'Campo da Academia Oakridge' }, { id: 'COMP03', title: 'Jogo Amigável', ourTeamId: 'TEAM03', opponent: 'Escola Secundária do Rio', date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), time: '16:00', location: 'Piscina Visitante', result: { ourScore: 120, opponentScore: 98, outcome: 'Win' } }, { id: 'COMP04', title: 'Abertura da Temporada', ourTeamId: 'TEAM01', opponent: 'Leões de Maplewood', date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(), time: '19:00', location: 'Ginásio Principal' }, ];
const teteGrades: Grade[] = [ { studentId: 'S001', subject: 'Matemática', grade: '17', date: new Date(now.getFullYear(), now.getMonth() - 2).toISOString() }, { studentId: 'S001', subject: 'Física', grade: '16', date: new Date(now.getFullYear(), now.getMonth() - 2).toISOString() }, { studentId: 'S001', subject: 'Português', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 2).toISOString() }, { studentId: 'S002', subject: 'Matemática', grade: '14', date: new Date(now.getFullYear(), now.getMonth() - 1).toISOString() }, { studentId: 'S002', subject: 'Física', grade: '14', date: new Date(now.getFullYear(), now.getMonth() - 1).toISOString() }, { studentId: 'S003', subject: 'Português', grade: '20', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S003', subject: 'Física', grade: '19', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S004', subject: 'Português', grade: '15', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S005', subject: 'Matemática', grade: '20', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S006', subject: 'Português', grade: '12', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S007', subject: 'Física', grade: '17', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S008', subject: 'Matemática', grade: '15', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S009', subject: 'Português', grade: '18', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S009', subject: 'Matemática', grade: '18', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S010', subject: 'Matemática', grade: '5', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S010', subject: 'Física', grade: '8', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S010', subject: 'Português', grade: '8', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, ];
const teteAttendance: Attendance[] = [
    { id: 'ATT001', studentId: 'S001', date: now.toISOString().split('T')[0], courseId: 'CRS001', status: 'Present' },
    { id: 'ATT002', studentId: 'S002', date: now.toISOString().split('T')[0], courseId: 'CRS001', status: 'Present' },
    { id: 'ATT003', studentId: 'S008', date: now.toISOString().split('T')[0], courseId: 'CRS001', status: 'Late' },
    { id: 'ATT004', studentId: 'S001', date: new Date(new Date().setDate(now.getDate() - 1)).toISOString().split('T')[0], courseId: 'CRS002', status: 'Sick' },
];
const teteFinance: FinanceRecord[] = [ { id: 'FEE001', studentId: 'S001', studentName: 'Joana Silva', description: 'Propina do 1º Trimestre', totalAmount: 75000, amountPaid: 75000, dueDate: '2024-08-31' }, { id: 'FEE002', studentId: 'S002', studentName: 'Pedro Santos', description: 'Propina do 1º Trimestre', totalAmount: 75000, amountPaid: 30000, dueDate: '2024-08-31' }, { id: 'FEE003', studentId: 'S003', studentName: 'Sofia Costa', description: 'Propina do 1º Trimestre', totalAmount: 90000, amountPaid: 0, dueDate: '2024-07-31' }, { id: 'FEE004', studentId: 'S009', studentName: 'Mariana Almeida', description: 'Propina do 1º Trimestre', totalAmount: 75000, amountPaid: 75000, dueDate: '2024-08-31' }, { id: 'FEE005', studentId: 'S001', studentName: 'Joana Silva', description: 'Taxas de Laboratório', totalAmount: 9500, amountPaid: 9500, dueDate: '2024-09-15' }, { id: 'FEE006', studentId: 'S010', studentName: 'Diogo Ribeiro', description: 'Propina do 1º Trimestre', totalAmount: 75000, amountPaid: 75000, dueDate: '2024-08-31' }, ];
const teteExpenses: Expense[] = [ { id: 'EXP001', description: 'Salários dos Professores - Agosto', category: 'Salários', amount: 1500000, date: '2024-08-31', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP002', description: 'Conta de Eletricidade', category: 'Utilities', amount: 95000, date: '2024-08-25', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP003', description: 'Novos Livros Escolares', category: 'Supplies', amount: 200000, date: '2024-08-15', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP004', description: 'Serviço de Internet', category: 'Utilities', amount: 30000, date: '2024-08-30', proofUrl: 'https://placehold.co/400x200.png' }, ];
const teteEvents: SchoolEvent[] = [ { id: 'EVT001', date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), title: 'Feira de Ciências', type: 'Academic', location: 'Salão Principal', organizer: 'Dept. de Ciências', audience: 'Todos os Alunos e Pais' }, { id: 'EVT002', date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), title: 'Início dos Exames Intercalares', type: 'Academic', location: 'Várias Salas', organizer: 'Gabinete de Exames', audience: 'Classes 9-12' }, ];
const teteTerms: AcademicTerm[] = [ { id: 'TERM01', name: '1º Trimestre', startDate: new Date(currentYear, 8, 1).toISOString(), endDate: new Date(currentYear, 11, 20).toISOString() }, { id: 'TERM02', name: '2º Trimestre', startDate: new Date(currentYear + 1, 0, 10).toISOString(), endDate: new Date(currentYear + 1, 5, 30).toISOString() }, ];
const teteHolidays: Holiday[] = [ { id: 'HOL01', name: 'Férias de Inverno', date: new Date(currentYear, 11, 21).toISOString() }, { id: 'HOL02', name: 'Férias da Páscoa', date: new Date(currentYear + 1, 2, 25).toISOString() }, ];
const teteCourses: Course[] = [
    { id: 'CRS001', subject: 'Matemática', teacherId: 'T001', classId: 'C003', schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00', room: '201' }, { day: 'Wednesday', startTime: '09:00', endTime: '10:00', room: '201' }, { day: 'Friday', startTime: '09:00', endTime: '10:00', room: '201' }] },
    { id: 'CRS002', subject: 'Português', teacherId: 'T003', classId: 'C001', schedule: [{ day: 'Tuesday', startTime: '10:00', endTime: '11:00', room: '101' }, { day: 'Thursday', startTime: '10:00', endTime: '11:00', room: '101' }] },
    { id: 'CRS003', subject: 'Física', teacherId: 'T002', classId: 'C004', schedule: [{ day: 'Monday', startTime: '11:00', endTime: '12:00', room: '301' }, { day: 'Wednesday', startTime: '11:00', endTime: '12:00', room: '301' }] },
];
const teteActivityLogs: ActivityLog[] = [
    { id: 'LOGN001', timestamp: new Date(new Date().setHours(new Date().getHours() - 20)).toISOString(), schoolId: 'northwood', user: 'Dra. Sara João', role: 'Admin', action: 'Login', details: 'Utilizador autenticado com sucesso.' },
    { id: 'LOGN002', timestamp: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(), schoolId: 'northwood', user: 'Dra. Sara João', role: 'Admin', action: 'Create', details: 'Criou disciplina: Matemática para a Turma 10-A.' },
    { id: 'LOGN003', timestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(), schoolId: 'northwood', user: 'Prof. Miguel Carvalho', role: 'Teacher', action: 'Update', details: 'Lançou 5 novas notas de Matemática.' },
    { id: 'LOGN004', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(), schoolId: 'northwood', user: 'Dra. Sara João', role: 'Admin', action: 'Analysis', details: 'Gerou um relatório de desempenho da escola.' },
];
const teteMessages: Message[] = [];

// --- Data for School 2: Champion College ---
const championProfile: SchoolProfile = { id: 'oakridge', name: 'Champion College', head: 'Sr. Jaime Maxwell', address: 'Rua dos Campeões 456, Tete, Mozambique', phone: '+258 84 987 6543', email: 'j.maxwell@champion.edu.mz', motto: 'Sabedoria e Integridade', logoUrl: 'https://placehold.co/100x100.png', transcriptTemplateUrl: 'https://placehold.co/600x800.png', tier: 'Pro', gradingSystem: 'GPA', currency: 'USD', status: 'Active', gradeCapacity: defaultGradeCapacity, kioskConfig: { ...defaultKioskConfig, showAcademics: true, showShowcase: true }, schoolLevel: 'Secondary' };
const championStudents: Student[] = [ { id: 'S101', name: 'André Sousa', grade: '10', class: 'A', email: 'a.sousa@champion.com', phone: '+258 84 101 1010', address: 'Bairro Josina Machel', parentName: 'Susana Sousa', parentEmail: 's.sousa@family.com', dateOfBirth: '2008-10-10', status: 'Active', sex: 'Male', behavioralAssessments: [] }, { id: 'S102', name: 'Lara Mendes', grade: '11', class: 'A', email: 'l.mendes@champion.com', phone: '+258 84 102 1020', address: 'Bairro Chaimite', parentName: 'João Mendes', parentEmail: 'j.mendes@family.com', dateOfBirth: '2007-04-14', status: 'Active', sex: 'Female', behavioralAssessments: [] }, { id: 'S103', name: 'Guilherme Ramos', grade: '9', class: 'B', email: 'g.ramos@champion.com', phone: '+258 84 103 1030', address: 'Bairro do Aeroporto', parentName: 'Graça Ramos', parentEmail: 'g.ramos@family.com', dateOfBirth: '2009-12-01', status: 'Transferred', sex: 'Male', behavioralAssessments: [] }, { id: 'S104', name: 'Inês Jesus', grade: '9', class: 'B', email: 'i.jesus@champion.com', phone: '+258 84 104 1040', address: 'Av. Eduardo Mondlane', parentName: 'Maria Silva', parentEmail: 'm.silva@family.com', dateOfBirth: '2009-09-09', status: 'Active', sex: 'Female', behavioralAssessments: [] }, ];
const championTeachers: Teacher[] = [ { id: 'T101', name: 'Sra. Raquel Antunes', subject: 'Biologia', email: 'r.antunes@champion.com', phone: '+258 82 201 2010', address: 'Rua da Biologia 10', experience: '10 years', qualifications: 'Doutoramento em Biologia', status: 'Active', sex: 'Female' }, { id: 'T102', name: 'Sr. Estevão Rocha', subject: 'Geografia', email: 's.rocha@champion.com', phone: '+258 82 202 2020', address: 'Av. do Mapa 20', experience: '5 years', qualifications: 'Mestrado em Geografia', status: 'Active', sex: 'Male' }, ];
const championClasses: Class[] = [ { id: 'C101', name: 'Turma 9-B', grade: '9', teacher: 'Sr. Estevão Rocha', students: 25, room: 'G1' }, { id: 'C102', name: 'Turma 10-A', grade: '10', teacher: 'Sra. Raquel Antunes', students: 30, room: 'L1' }, ];
const championCourses: Course[] = [
    { id: 'CRS101', subject: 'Biologia', teacherId: 'T101', classId: 'C102', schedule: [{ day: 'Tuesday', startTime: '09:00', endTime: '11:00', room: 'L1' }] },
    { id: 'CRS102', subject: 'Geografia', teacherId: 'T102', classId: 'C101', schedule: [{ day: 'Monday', startTime: '13:00', endTime: '14:30', room: 'G1' }] },
];
const championGrades: Grade[] = [ { studentId: 'S101', subject: 'Biologia', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 1).toISOString() }, { studentId: 'S102', subject: 'Geografia', grade: '15', date: new Date(now.getFullYear(), now.getMonth() - 1).toISOString() }, { studentId: 'S104', subject: 'Geografia', grade: '14', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, { studentId: 'S104', subject: 'Biologia', grade: '12', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, ];
const championAttendance: Attendance[] = [];
const championFinance: FinanceRecord[] = [ { id: 'FEE101', studentId: 'S101', studentName: 'André Sousa', description: 'Propina Anual', totalAmount: 140000, amountPaid: 140000, dueDate: '2024-08-31' }, { id: 'FEE102', studentId: 'S102', studentName: 'Lara Mendes', description: 'Propina Anual', totalAmount: 140000, amountPaid: 0, dueDate: '2024-08-31' }, { id: 'FEE103', studentId: 'S104', studentName: 'Inês Jesus', description: 'Propina Anual', totalAmount: 140000, amountPaid: 140000, dueDate: '2024-08-31' }, ];
const championExpenses: Expense[] = [ { id: 'EXP101', description: 'Salários dos Funcionários - Agosto', category: 'Salários', amount: 2200000, date: '2024-08-31', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP102', description: 'Manutenção do Edifício', category: 'Manutenção', amount: 150000, date: '2024-08-20', proofUrl: 'https://placehold.co/400x200.png' }, ];
const championEvents: SchoolEvent[] = [ { id: 'EVT101', date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), title: 'Sessão de Boas-Vindas', type: 'Meeting', location: 'Auditório', organizer: 'Secretaria', audience: 'Novos Alunos e Pais' }, { id: 'EVT102', date: new Date(new Date().setDate(new Date().getDate() + 18)).toISOString(), title: 'Dia Desportivo Anual', type: 'Sports', location: 'Campo Desportivo', organizer: 'Dept. de Desporto', audience: 'Toda a Escola' }, ];
const championTerms: AcademicTerm[] = [];
const championHolidays: Holiday[] = [ { id: 'HOL101', name: 'Dia da Família', date: new Date(currentYear, 10, 28).toISOString() }];
const championActivityLogs: ActivityLog[] = [
    { id: 'LOGO001', timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), schoolId: 'oakridge', user: 'Sr. Jaime Maxwell', role: 'Admin', action: 'Login', details: 'Utilizador autenticado com sucesso.' },
    { id: 'LOGO002', timestamp: new Date(new Date().setHours(new Date().getHours() - 8)).toISOString(), schoolId: 'oakridge', user: 'Sr. Jaime Maxwell', role: 'Admin', action: 'Create', details: 'Aprovou a inscrição de Alice Maravilha.' },
];
const championMessages: Message[] = [];

// --- Data for School 3: MiniArte Group of Schools ---
const miniarteProfile: SchoolProfile = { id: 'maplewood', name: 'MiniArte Group of Schools', head: 'Sra. Eleonor Dias', address: 'Av. 24 de Julho 789, Maputo, Mozambique', phone: '+258 82 456 7890', email: 'e.dias@miniarte.edu.mz', motto: 'Mentes Globais, Raízes Locais', logoUrl: 'https://placehold.co/100x100.png', transcriptTemplateUrl: 'https://placehold.co/600x800.png', tier: 'Premium', gradingSystem: 'Letter', currency: 'MZN', status: 'Active', gradeCapacity: { ...defaultGradeCapacity, "10": 0 }, kioskConfig: { ...defaultKioskConfig, showAwards: true, showAttendance: true, showShowcase: true }, schoolLevel: 'Full' };
const miniarteStudents: Student[] = [ { id: 'S201', name: 'Gabriel Martins', grade: '10', class: 'A', email: 'g.martins@miniarte.com', phone: '+258 82 201 2010', address: 'Rua da Torre Eiffel', parentName: 'Amélia Martins', parentEmail: 'a.martins@family.com', dateOfBirth: '2008-02-02', status: 'Active', sex: 'Male', behavioralAssessments: [] }, { id: 'S202', name: 'Matilde Correia', grade: '11', class: 'B', email: 'm.correia@miniarte.com', phone: '+258 82 202 2020', address: 'Av. Tokyo Skytree', parentName: 'Heitor Correia', parentEmail: 'h.correia@family.com', dateOfBirth: '2007-06-19', status: 'Active', sex: 'Female', behavioralAssessments: [] }, { id: 'S203', name: 'Rodrigo Ferreira', grade: '9', class: 'C', email: 'r.ferreira@miniarte.com', phone: '+258 82 203 2030', address: 'Blvd. Taj Mahal', parentName: 'Aarav Ferreira', parentEmail: 'a.ferreira@family.com', dateOfBirth: '2009-04-29', status: 'Active', sex: 'Male', behavioralAssessments: [] }, { id: 'S205', name: 'Afonso Pinto', grade: '12', class: 'A', email: 'a.pinto@miniarte.com', phone: '+258 82 205 2050', address: 'Vista das Pirâmides', parentName: 'Fátima Pinto', parentEmail: 'f.pinto@family.com', dateOfBirth: '2006-03-03', status: 'Active', sex: 'Male', behavioralAssessments: [] }, { id: 'S204', name: 'Maria Carvalho', grade: '10', class: 'B', email: 'm.carvalho@miniarte.com', phone: '+258 82 204 2040', address: 'Portão de Berlim', parentName: 'Sofia Carvalho', parentEmail: 's.carvalho@family.com', dateOfBirth: '2008-11-11', status: 'Active', sex: 'Female', behavioralAssessments: [] }, ];
const miniarteTeachers: Teacher[] = [ { id: 'T201', name: 'Sr. David Lopes', subject: 'História', email: 'd.lopes@miniarte.com', phone: '+258 82 301 3010', address: 'Rua da História 10', experience: '15 years', qualifications: 'Mestrado em História', status: 'Active', sex: 'Male' }, { id: 'T202', name: 'Dr. Ivan Ramos', subject: 'Química', email: 'i.ramos@miniarte.com', phone: '+258 82 302 3020', address: 'Fila da Química 20', experience: '18 years', qualifications: 'Doutoramento em Química', status: 'Active', sex: 'Male' }, ];
const miniarteClasses: Class[] = [ { id: 'C201', name: 'Turma 9-C', grade: '9', teacher: 'Sr. David Lopes', students: 22, room: 'H1' }, ];
const miniarteCourses: Course[] = [];
const miniarteGrades: Grade[] = [ { studentId: 'S201', subject: 'História', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 1).toISOString() }, { studentId: 'S204', subject: 'História', grade: '15', date: new Date(now.getFullYear(), now.getMonth()).toISOString() }, ];
const miniarteAttendance: Attendance[] = [];
const miniarteFinance: FinanceRecord[] = [ { id: 'FEE201', studentId: 'S201', studentName: 'Gabriel Martins', description: 'Propinas do 1º Semestre', totalAmount: 75213622, amountPaid: 23931607, dueDate: '2024-09-01' }, { id: 'FEE202', studentId: 'S204', studentName: 'Maria Carvalho', description: 'Propinas do 1º Semestre', totalAmount: 75213622, amountPaid: 75213622, dueDate: '2024-07-01' }, ];
const miniarteExpenses: Expense[] = [ { id: 'EXP201', description: 'Taxas do Programa IB', category: 'Académicos', amount: 256367075, date: '2024-08-10', proofUrl: 'https://placehold.co/400x200.png' }, { id: 'EXP202', description: 'Salários dos Funcionários - Agosto', category: 'Salários', amount: 957266000, date: '2024-08-31', proofUrl: 'https://placehold.co/400x200.png' }, ];
const miniarteEvents: SchoolEvent[] = [ { id: 'EVT201', date: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(), title: 'Dia Internacional', type: 'Cultural', location: 'Recinto Escolar', organizer: 'Comité Cultural', audience: 'Toda a Comunidade Escolar' }, ];
const miniarteTerms: AcademicTerm[] = [];
const miniarteHolidays: Holiday[] = [ { id: 'HOL201', name: 'Dia da Herança', date: new Date(currentYear, 8, 24).toISOString() }];
const miniarteActivityLogs: ActivityLog[] = [
    { id: 'LOGM001', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), schoolId: 'maplewood', user: 'Sra. Eleonor Dias', role: 'Admin', action: 'Login', details: 'Utilizador autenticado com sucesso.' },
];
const miniarteMessages: Message[] = [];

// --- Data for School 4: MiniArte Beira Campus ---
const beiraProfile: SchoolProfile = { id: 'miniarte-beira', name: 'MiniArte - Beira Campus', head: 'Sra. Carolina Varela', address: 'Rua da Manga 123, Beira, Mozambique', phone: '+258 84 111 2233', email: 'c.varela@miniarte.edu.mz', motto: 'Criatividade sem Fronteiras', logoUrl: 'https://placehold.co/100x100.png', tier: 'Premium', gradingSystem: 'Letter', currency: 'MZN', status: 'Active', gradeCapacity: defaultGradeCapacity, kioskConfig: defaultKioskConfig, schoolLevel: 'Primary' };
const beiraStudents: Student[] = [
    { id: 'S301', name: 'Lucas Mendes', grade: '8', class: 'A', email: 'l.mendes@miniarte.com', phone: '+258 84 301 3010', address: 'Bairro do Estoril', parentName: 'Fernanda Mendes', parentEmail: 'f.mendes@family.com', dateOfBirth: '2010-01-15', status: 'Active', sex: 'Male', behavioralAssessments: [] },
    { id: 'S302', name: 'Beatriz Lima', grade: '7', class: 'B', email: 'b.lima@miniarte.com', phone: '+258 84 302 3020', address: 'Ponta Gea', parentName: 'Ricardo Lima', parentEmail: 'r.lima@family.com', dateOfBirth: '2011-03-22', status: 'Active', sex: 'Female', behavioralAssessments: [] },
];
const beiraTeachers: Teacher[] = [
    { id: 'T301', name: 'Sr. Bruno Reis', subject: 'Artes', email: 'b.reis@miniarte.com', phone: '+258 82 401 4010', address: 'Rua das Artes 10', experience: '7 years', qualifications: 'Licenciatura em Belas Artes', status: 'Active', sex: 'Male' },
    { id: 'T302', name: 'Sra. Diana Magalhães', subject: 'Música', email: 'd.magalhaes@miniarte.com', phone: '+258 82 402 4020', address: 'Av. da Harmonia 20', experience: '9 years', qualifications: 'Mestrado em Música', status: 'Active', sex: 'Female' },
];
const beiraGrades: Grade[] = [
    { studentId: 'S301', subject: 'Artes', grade: '19', date: new Date(now.getFullYear(), now.getMonth() - 1).toISOString() },
    { studentId: 'S302', subject: 'Música', grade: '17', date: new Date(now.getFullYear(), now.getMonth() - 1).toISOString() },
];

// --- Data for School 5: MiniArte Nampula Campus ---
const nampulaProfile: SchoolProfile = { id: 'miniarte-nampula', name: 'MiniArte - Nampula Campus', head: 'Sr. Vicente Pinto', address: 'Av. do Trabalho 456, Nampula, Mozambique', phone: '+258 84 444 5566', email: 'v.pinto@miniarte.edu.mz', motto: 'Inovação e Expressão', logoUrl: 'https://placehold.co/100x100.png', tier: 'Premium', gradingSystem: 'Letter', currency: 'MZN', status: 'Active', gradeCapacity: defaultGradeCapacity, kioskConfig: defaultKioskConfig, schoolLevel: 'Primary' };
const nampulaStudents: Student[] = [
    { id: 'S401', name: 'Rafael Costa', grade: '9', class: 'A', email: 'r.costa@miniarte.com', phone: '+258 84 401 4010', address: 'Bairro de Muatala', parentName: 'Júlia Costa', parentEmail: 'j.costa@family.com', dateOfBirth: '2009-05-30', status: 'Active', sex: 'Male', behavioralAssessments: [] },
    { id: 'S402', name: 'Laura Azevedo', grade: '8', class: 'C', email: 'l.azevedo@miniarte.com', phone: '+258 84 402 4020', address: 'Rua dos Continuadores', parentName: 'Sérgio Azevedo', parentEmail: 's.azevedo@family.com', dateOfBirth: '2010-07-11', status: 'Active', sex: 'Female', behavioralAssessments: [] },
];
const nampulaTeachers: Teacher[] = [
    { id: 'T401', name: 'Sra. Clara Furtado', subject: 'Dança', email: 'c.furtado@miniarte.com', phone: '+258 82 501 5010', address: 'Rua do Ritmo 30', experience: '12 years', qualifications: 'Licenciatura em Dança', status: 'Active', sex: 'Female' },
    { id: 'T402', name: 'Sr. Matias Neves', subject: 'Teatro', email: 'm.neves@miniarte.com', phone: '+258 82 502 5020', address: 'Av. do Palco 40', experience: '10 years', qualifications: 'Mestrado em Artes Cénicas', status: 'Active', sex: 'Male' },
];
const nampulaGrades: Grade[] = [
    { studentId: 'S401', subject: 'Teatro', grade: '16', date: new Date(now.getFullYear(), now.getMonth() - 1).toISOString() },
    { studentId: 'S402', subject: 'Dança', grade: '18', date: new Date(now.getFullYear(), now.getMonth() - 1).toISOString() },
];


export const schoolData: Record<string, SchoolData> = {
  northwood: {
    profile: teteProfile,
    students: teteStudents,
    teachers: teteTeachers,
    classes: teteClasses,
    courses: teteCourses,
    syllabi: teteSyllabi,
    lessonPlans: [],
    savedTests: [],
    deployedTests: [],
    teams: teteTeams,
    grades: teteGrades,
    attendance: teteAttendance,
    finance: teteFinance,
    feeDescriptions: ['Propina Trimestral', 'Taxas de Laboratório', 'Uniforme Desportivo', 'Multa da Biblioteca', 'Taxa de Exame'],
    audiences: ['Todos os Alunos', 'Pais', 'Professores', 'Classes 9-12', 'Toda a Comunidade Escolar', 'Todos os Funcionários'],
    expenseCategories: ['Salários', 'Serviços Públicos', 'Material', 'Manutenção', 'Académicos'],
    expenses: teteExpenses,
    competitions: teteCompetitions,
    events: teteEvents,
    terms: teteTerms,
    holidays: teteHolidays,
    activityLogs: teteActivityLogs,
    messages: teteMessages,
    savedReports: [],
    kioskMedia: [],
    admissions: [ { id: 'ADM001', name: 'João da Silva', appliedFor: 'Grade 9', date: '2024-05-10', status: 'Pending', formerSchool: 'Escola Primária de Eastwood', grades: 'Média de A em todas as disciplinas.', parentName: 'Maria da Silva', parentEmail: 'm.silva@family.com', dateOfBirth: '2009-03-12', sex: 'Male' }, { id: 'ADM002', name: 'Emília Branca', appliedFor: 'Grade 10', date: '2024-05-09', status: 'Approved', formerSchool: 'Escola Média de Westwood', grades: 'Excelente histórico académico, especialmente em ciências.', parentName: 'David Branco', parentEmail: 'd.branco@family.com', dateOfBirth: '2008-11-23', sex: 'Female' }, ],
    exams: [ { id: 'EXM001', title: 'Exame Intercalar de Matemática', subject: 'Matemática', grade: '10', date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), time: '09:00', duration: '2 hours', room: '201', board: 'Internal', invigilator: 'Prof. Miguel Carvalho' }, { id: 'EXM004', title: 'IGCSE Física Paper 4', subject: 'Física', grade: '10', date: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(), time: '13:00', duration: '75 minutes', room: 'Sala A', board: 'Cambridge', invigilator: 'Dra. Lúcia Andrade' }, ],
    assets: [ { id: 'ASSET001', name: 'Portátil Dell Latitude', category: 'Equipamento de TI', status: 'In Use', location: 'Sala 201', assignedTo: 'Prof. Miguel Carvalho' }, { id: 'ASSET002', name: 'Projetor Epson', category: 'Equipamento AV', status: 'Available', location: 'Armazém', assignedTo: 'N/A' }, ],
    assignments: [ { id: 'A001', title: 'Ficha de Problemas de Matemática 5', subject: 'Matemática', grade: '10', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), status: 'pending' }, { id: 'A002', title: 'Relatório de Laboratório de Física', subject: 'Física', grade: '11', dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: 'submitted' }, ],
  },
  oakridge: {
    profile: championProfile,
    students: championStudents,
    teachers: championTeachers,
    classes: championClasses,
    courses: championCourses,
    syllabi: [],
    lessonPlans: [],
    savedTests: [],
    deployedTests: [],
    teams: [],
    grades: championGrades,
    attendance: championAttendance,
    finance: championFinance,
    feeDescriptions: ['Propina Anual', 'Taxa de Atividade', 'Taxa de Tecnologia'],
    audiences: ['Todos os Alunos', 'Pais', 'Professores', 'Novos Alunos e Pais'],
    expenseCategories: ['Salários', 'Serviços Públicos', 'Material', 'Manutenção', 'Académicos'],
    expenses: championExpenses,
    competitions: [],
    events: championEvents,
    terms: championTerms,
    holidays: championHolidays,
    activityLogs: championActivityLogs,
    messages: championMessages,
    savedReports: [],
    kioskMedia: [],
    admissions: [ { id: 'OAK-ADM001', name: 'Alice Maravilha', appliedFor: 'Grade 9', date: '2024-05-15', status: 'Approved', formerSchool: 'Escola Média do País das Maravilhas', grades: 'Melhor da turma.', parentName: 'Carlos Maravilha', parentEmail: 'c.maravilha@family.com', dateOfBirth: '2009-07-07', sex: 'Female' }, ],
    exams: [ { id: 'OAK-EXM001', title: 'Exame de Admissão de Biologia', subject: 'Biologia', grade: '9', date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), time: '09:00', duration: '2 hours', room: 'L1', board: 'Internal', invigilator: 'Sra. Raquel Antunes' }, ],
    assets: [ { id: 'OAK-ASSET001', name: 'Conjunto de Microscópios', category: 'Equipamento de Laboratório', status: 'In Use', location: 'Laboratório 1', assignedTo: 'Sra. Raquel Antunes' }, ],
    assignments: [ { id: 'OAK-A001', title: 'Projeto de Pesquisa Geográfica', subject: 'Geografia', grade: '9', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), status: 'pending' }, ],
  },
  maplewood: {
    profile: miniarteProfile,
    students: miniarteStudents,
    teachers: miniarteTeachers,
    classes: miniarteClasses,
    courses: miniarteCourses,
    syllabi: [],
    lessonPlans: [],
    savedTests: [],
    deployedTests: [],
    teams: [],
    grades: miniarteGrades,
    attendance: miniarteAttendance,
    finance: miniarteFinance,
    feeDescriptions: ['Propinas do 1º Semestre', 'Taxa de Capital', 'Taxa de Exame IB', 'Taxa de Tecnologia'],
    audiences: ['Todos os Alunos', 'Pais', 'Professores', 'Toda a Comunidade Escolar'],
    expenseCategories: ['Salários', 'Serviços Públicos', 'Material', 'Manutenção', 'Académicos'],
    expenses: miniarteExpenses,
    competitions: [],
    events: miniarteEvents,
    terms: miniarteTerms,
    holidays: miniarteHolidays,
    activityLogs: miniarteActivityLogs,
    messages: miniarteMessages,
    savedReports: [],
    kioskMedia: [],
    admissions: [ { id: 'MAP-ADM001', name: 'Leonardo da Vinci', appliedFor: 'Grade 9', date: '2024-06-01', status: 'Pending', formerSchool: 'Preparatória Literária', grades: 'Forte em humanidades.', parentName: 'Sofia da Vinci', parentEmail: 's.vinci@family.com', dateOfBirth: '2009-01-01', sex: 'Male' }, ],
    exams: [ { id: 'MAP-EXM001', title: 'Final de História Mundial', subject: 'História', grade: '9', date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), time: '10:00', duration: '90 minutes', room: 'H1', board: 'IB', invigilator: 'Sr. David Lopes' }, ],
    assets: [ { id: 'MAP-ASSET001', name: 'Quadro Inteligente', category: 'Equipamento AV', status: 'In Use', location: 'H1', assignedTo: 'Sr. David Lopes' }, ],
    assignments: [ { id: 'MAP-A001', title: 'Ensaio sobre Arte Renascentista', subject: 'História', grade: '9', dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), status: 'pending' }, ],
  },
  'miniarte-beira': {
    profile: beiraProfile,
    students: beiraStudents,
    teachers: beiraTeachers,
    classes: [], courses: [], lessonPlans: [], syllabi: [], savedTests: [], deployedTests: [], teams: [],
    grades: beiraGrades, attendance: [], finance: [], admissions: [], exams: [], assets: [],
    assignments: [], events: [], terms: [], holidays: [], activityLogs: [], messages: [],
    savedReports: [], kioskMedia: [],
    feeDescriptions: ['Taxa de Inscrição', 'Mensalidade'],
    audiences: ['Todos os Alunos', 'Pais', 'Professores'],
    expenseCategories: ['Material de Arte', 'Salários', 'Serviços Públicos'],
    expenses: [], competitions: [],
  },
  'miniarte-nampula': {
    profile: nampulaProfile,
    students: nampulaStudents,
    teachers: nampulaTeachers,
    classes: [], courses: [], lessonPlans: [], syllabi: [], savedTests: [], deployedTests: [], teams: [],
    grades: nampulaGrades, attendance: [], finance: [], admissions: [], exams: [], assets: [],
    assignments: [], events: [], terms: [], holidays: [], activityLogs: [], messages: [],
    savedReports: [], kioskMedia: [],
    feeDescriptions: ['Taxa de Inscrição', 'Mensalidade'],
    audiences: ['Todos os Alunos', 'Pais', 'Professores'],
    expenseCategories: ['Figurinos', 'Salários', 'Serviços Públicos'],
    expenses: [], competitions: [],
  },
};

export const schoolGroups = {
  educorp: ['maplewood', 'miniarte-beira', 'miniarte-nampula']
};


export const mockUsers = {
  developer: {
    user: { username: 'developer', name: 'Developer', role: 'GlobalAdmin' as Role, email: 'developer@edumanage.com' },
    password: 'dev123'
  },
  admin1: {
    user: { username: 'admin1', name: 'Dra. Sara João', role: 'Admin' as Role, email: 's.joao@tetejunior.edu.mz', schoolId: 'northwood' },
    password: 'admin'
  },
  admin2: {
    user: { username: 'admin2', name: 'Sr. Jaime Maxwell', role: 'Admin' as Role, email: 'j.maxwell@champion.edu.mz', schoolId: 'oakridge' },
    password: 'admin'
  },
  admin3: {
    user: { username: 'admin3', name: 'Sra. Eleonor Dias', role: 'Admin' as Role, email: 'e.dias@miniarte.edu.mz', schoolId: 'maplewood' },
    password: 'admin'
  },
  admin4: {
    user: { username: 'admin4', name: 'Sra. Carolina Varela', role: 'Admin' as Role, email: 'c.varela@miniarte.edu.mz', schoolId: 'miniarte-beira' },
    password: 'admin'
  },
  admin5: {
    user: { username: 'admin5', name: 'Sr. Vicente Pinto', role: 'Admin' as Role, email: 'v.pinto@miniarte.edu.mz', schoolId: 'miniarte-nampula' },
    password: 'admin'
  },
  teacher1: {
    user: { username: 'teacher1', name: 'Prof. Miguel Carvalho', role: 'Teacher' as Role, email: 'm.carvalho@edumanage.com', schoolId: 'northwood' },
    password: 'teacher'
  },
  teacher2: {
    user: { username: 'teacher2', name: 'Sra. Raquel Antunes', role: 'Teacher' as Role, email: 'r.antunes@champion.com', schoolId: 'oakridge' },
    password: 'teacher'
  },
  teacher3: {
    user: { username: 'teacher3', name: 'Dr. Ivan Ramos', role: 'Teacher' as Role, email: 'i.ramos@miniarte.com', schoolId: 'maplewood' },
    password: 'teacher'
  },
  student1: {
    user: { username: 'student1', name: 'Joana Silva', role: 'Student' as Role, email: 'j.silva@edumanage.com', schoolId: 'northwood' },
    password: 'student'
  },
  student2: {
    user: { username: 'student2', name: 'André Sousa', role: 'Student' as Role, email: 'a.sousa@champion.com', schoolId: 'oakridge' },
    password: 'student'
  },
  student3: {
    user: { username: 'student3', name: 'Diogo Ribeiro', role: 'Student' as Role, email: 'd.ribeiro@edumanage.com', schoolId: 'northwood' },
    password: 'student'
  },
  parent1: {
    user: { username: 'parent1', name: 'Maria Silva', role: 'Parent' as Role, email: 'm.silva@family.com' },
    password: 'parent',
  },
  parent2: {
    user: { username: 'parent2', name: 'Amélia Martins', role: 'Parent' as Role, email: 'a.martins@family.com' },
    password: 'parent',
  }
};
