
'use client';
import { doc, updateDoc, collection, getDocs, writeBatch, serverTimestamp, Timestamp, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';
import type { SchoolData, NewSchoolData, SchoolProfile, UserProfile, Teacher, Class, Syllabus, SyllabusTopic, Course, FinanceRecord, Expense, Team, Competition, Admission, Student, Message, NewMessageData, KioskMedia, BehavioralAssessment, Grade, DeployedTest, SavedTest, Role } from '@/context/school-data-context';


// --- Email Simulation ---
// Note: This is now handled in the server action to avoid circular dependencies.

const mockUsers: Record<string, UserProfile> = {
  developer: {
    user: { username: 'developer', name: 'Dev Admin', role: 'GlobalAdmin', email: 'dev@edudmanage.com' },
    password: 'password'
  },
  admin1: {
    user: { username: 'admin1', name: 'Amelia Costa', role: 'Admin', email: 'amelia.costa@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  admin3: {
    user: { username: 'admin3', name: 'Carlos Pereira', role: 'Admin', email: 'carlos.pereira@miniarte.edu', schoolId: 'miniarte' },
    password: 'password'
  },
  admin_miniarte_matola: {
    user: { username: 'admin_miniarte_matola', name: 'Isabel Rocha', role: 'Admin', email: 'isabel.rocha@miniarte.edu', schoolId: 'miniarte_matola' },
    password: 'password'
  },
  admin_miniarte_beira: {
    user: { username: 'admin_miniarte_beira', name: 'Pedro Gonçalves', role: 'Admin', email: 'pedro.goncalves@miniarte.edu', schoolId: 'miniarte_beira' },
    password: 'password'
  },
  admin_logix: {
    user: { username: 'admin_logix', name: 'Ricardo Jorge', role: 'Admin', email: 'ricardo.jorge@logix.edu', schoolId: 'logixsystems' },
    password: 'password'
  },
  admin_plc: {
    user: { username: 'admin_plc', name: 'Beatriz Lima', role: 'Admin', email: 'beatriz.lima@plc.edu', schoolId: 'plc' },
    password: 'password'
  },
  admin_trial: {
    user: { username: 'admin_trial', name: 'Sofia Mendes', role: 'Admin', email: 'sofia.mendes@trialschool.edu', schoolId: 'trialschool' },
    password: 'password'
  },
  teacher1: {
    user: { username: 'teacher1', name: 'Sérgio Almeida', role: 'Teacher', email: 'sergio.almeida@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
   teacher_logix: {
    user: { username: 'teacher_logix', name: 'Jorge Dias', role: 'Teacher', email: 'jorge.dias@logix.edu', schoolId: 'logixsystems' },
    password: 'password'
  },
  student1: {
    user: { username: 'student1', name: 'Miguel Santos', role: 'Student', email: 'miguel.santos@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  ines_pereira: {
    user: { username: 'ines_pereira', name: 'Inês Pereira', role: 'Student', email: 'ines.pereira@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  tiago_rodrigues: {
    user: { username: 'tiago_rodrigues', name: 'Tiago Rodrigues', role: 'Student', email: 'tiago.rodrigues@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  lucia_santos: {
    user: { username: 'lucia_santos', name: 'Lucia Santos', role: 'Student', email: 'lucia.santos@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  pedro_santos: {
    user: { username: 'pedro_santos', name: 'Pedro Santos', role: 'Student', email: 'pedro.santos@northwood.edu', schoolId: 'northwood' },
    password: 'password'
  },
  julio_silva: {
    user: { username: 'julio_silva', name: 'Julio Silva', role: 'Student', email: 'julio.silva@miniarte.edu', schoolId: 'miniarte_matola' },
    password: 'password'
  },
  mariana_lopes: {
    user: { username: 'mariana_lopes', name: 'Mariana Lopes', role: 'Student', email: 'mariana.lopes@miniarte.edu', schoolId: 'miniarte_beira' },
    password: 'password'
  },
  laura_moreira: {
    user: { username: 'laura_moreira', name: 'Laura Moreira', role: 'Student', email: 'laura.moreira@logix.edu', schoolId: 'logixsystems' },
    password: 'password'
  },
  daniela_fernandes: {
    user: { username: 'daniela_fernandes', name: 'Daniela Fernandes', role: 'Student', email: 'daniela.fernandes@plc.edu', schoolId: 'plc' },
    password: 'password'
  },
  andre_ramos: {
    user: { username: 'andre_ramos', name: 'Andre Ramos', role: 'Student', email: 'andre.ramos@trialschool.edu', schoolId: 'trialschool' },
    password: 'password'
  },
  parent1: {
    user: { username: 'parent1', name: 'Ana Santos', role: 'Parent', email: 'ana.santos@email.com' },
    password: 'password'
  },
  parent_pereira: {
    user: { username: 'parent_pereira', name: 'João Pereira', role: 'Parent', email: 'joao.pereira@email.com' },
    password: 'password'
  },
  parent_rodrigues: {
    user: { username: 'parent_rodrigues', name: 'Carla Rodrigues', role: 'Parent', email: 'carla.rodrigues@email.com' },
    password: 'password'
  },
  parent_silva: {
    user: { username: 'parent_silva', name: 'Fernanda Silva', role: 'Parent', email: 'fernanda.silva@email.com' },
    password: 'password'
  },
  parent_lopes: {
    user: { username: 'parent_lopes', name: 'Sérgio Lopes', role: 'Parent', email: 'sergio.lopes@email.com' },
    password: 'password'
  },
  parent_moreira: {
    user: { username: 'parent_moreira', name: 'Joana Moreira', role: 'Parent', email: 'joana.moreira@email.com' },
    password: 'password'
  },
  parent_fernandes: {
    user: { username: 'parent_fernandes', name: 'Rui Fernandes', role: 'Parent', email: 'rui.fernandes@email.com' },
    password: 'password'
  },
  parent_ramos: {
    user: { username: 'parent_ramos', name: 'Paula Ramos', role: 'Parent', email: 'paula.ramos@email.com' },
    password: 'password'
  },
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

const emptySchoolData: Omit<SchoolData, 'profile'> = {
    students: [], teachers: [], classes: [], courses: [], syllabi: [],
    admissions: [], exams: [], finance: [], assets: [], grades: [], attendance: [],
    events: [], feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform'],
    audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'],
    expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
    expenses: [], teams: [], competitions: [], terms: [], holidays: [],
    kioskMedia: [], activityLogs: [], messages: [], savedReports: [],
    examBoards: ['Internal', 'Cambridge', 'IEB'], deployedTests: [],
    lessonPlans: [], savedTests: [], schoolGroups: {}
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
        { id: 'STU004', name: 'Lucia Santos', email: 'lucia.santos@northwood.edu', phone: '840000004', address: 'Rua de Kassuende', sex: 'Female', dateOfBirth: '2010-02-12', grade: '8', class: 'A', parentName: 'Ana Santos', parentEmail: 'ana.santos@email.com', status: 'Active', behavioralAssessments: [] },
        { id: 'STU005', name: 'Pedro Santos', email: 'pedro.santos@northwood.edu', phone: '840000005', address: 'Rua de Kassuende', sex: 'Male', dateOfBirth: '2013-11-05', grade: '5', class: 'B', parentName: 'Ana Santos', parentEmail: 'ana.santos@email.com', status: 'Active', behavioralAssessments: [] },
    ],
    teachers: [
        { id: 'T01', name: 'Sérgio Almeida', email: 'sergio.almeida@northwood.edu', phone: '820000001', address: 'Av. da Guerra Popular', sex: 'Male', subject: 'Mathematics', experience: '10 years', qualifications: 'M.Sc. Mathematics', status: 'Active' },
        { id: 'T02', name: 'Catarina Martins', email: 'catarina.martins@northwood.edu', phone: '820000002', address: 'Rua da Argélia', sex: 'Female', subject: 'History', experience: '8 years', qualifications: 'M.A. History', status: 'Active' },
    ],
    classes: [
        { id: 'C01', name: 'Grade 10-A', grade: '10', teacher: 'Sérgio Almeida', students: 30, room: '101' },
        { id: 'C02', name: 'Grade 11-B', grade: '11', teacher: 'Catarina Martins', students: 28, room: '102' },
        { id: 'C03', name: 'Grade 9-C', grade: '9', teacher: 'Sérgio Almeida', students: 25, room: '103' },
        { id: 'C04', name: 'Grade 8-B', grade: '8', teacher: 'Catarina Martins', students: 28, room: '104' },
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
        { id: 'G04', studentId: 'STU004', subject: 'History', grade: '19', date: new Date('2024-04-12T00:00:00Z'), type: 'Coursework', description: 'Mozambique History Presentation', teacherId: 'T02' },
        { id: 'G05', studentId: 'STU005', subject: 'Mathematics', grade: '17', date: new Date('2024-04-18T00:00:00Z'), type: 'Test', description: 'Geometry Quiz', teacherId: 'T01' },
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
    schoolGroups: {
      'miniarte_group': ['miniarte', 'miniarte_matola', 'miniarte_beira'],
    },
    ...emptySchoolData,
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
};

const miniArteData: SchoolData = {
    ...emptySchoolData,
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
};

const miniArteMatolaData: SchoolData = {
    ...emptySchoolData,
    profile: {
        id: 'miniarte_matola',
        name: 'MiniArte Matola Campus',
        head: 'Isabel Rocha',
        address: 'Bairro Tsalala, Matola',
        phone: '860000302',
        email: 'isabel.rocha@miniarte.edu',
        motto: 'Nurturing Young Artists',
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
        subscription: { status: 'Paid', amount: 250, dueDate: '2025-01-01' },
        awards: [],
    },
    students: [ { id: 'STU301', name: 'Julio Silva', email: 'julio.silva@miniarte.edu', phone: '860000301', address: 'Bairro Tsalala', sex: 'Male', dateOfBirth: '2012-09-01', grade: '6', class: 'A', parentName: 'Fernanda Silva', parentEmail: 'fernanda.silva@email.com', status: 'Active', behavioralAssessments: [] }],
};

const miniArteBeiraData: SchoolData = {
    ...emptySchoolData,
    profile: {
        id: 'miniarte_beira',
        name: 'MiniArte Beira Campus',
        head: 'Pedro Gonçalves',
        address: 'Bairro da Ponta Gêa, Beira',
        phone: '860000402',
        email: 'pedro.goncalves@miniarte.edu',
        motto: 'Artistry by the Sea',
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
        subscription: { status: 'Paid', amount: 250, dueDate: '2025-01-01' },
        awards: [],
    },
    students: [{ id: 'STU401', name: 'Mariana Lopes', email: 'mariana.lopes@miniarte.edu', phone: '860000401', address: 'Bairro da Ponta Gêa', sex: 'Female', dateOfBirth: '2011-12-25', grade: '7', class: 'A', parentName: 'Sérgio Lopes', parentEmail: 'sergio.lopes@email.com', status: 'Active', behavioralAssessments: [] }],
};

const logixSystemsData: SchoolData = {
    ...emptySchoolData,
    profile: {
        id: 'logixsystems',
        name: 'Logix Systems School',
        head: 'Ricardo Jorge',
        address: '123 Tech Park, Matola',
        phone: '555-0100',
        email: 'ricardo.jorge@logix.edu',
        motto: 'Logic and Learning',
        tier: 'Starter',
        logoUrl: 'https://placehold.co/100x100.png',
        certificateTemplateUrl: 'https://placehold.co/800x600.png',
        transcriptTemplateUrl: 'https://placehold.co/600x800.png',
        gradingSystem: '20-Point',
        currency: 'USD',
        status: 'Active',
        schoolLevel: 'Full',
        gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 },
        kioskConfig: defaultKioskConfig,
        subscription: { status: 'Paid', amount: 100, dueDate: '2025-01-01' },
    },
    students: [
        { id: 'STU501', name: 'Laura Moreira', email: 'laura.moreira@logix.edu', phone: '870000501', address: 'Av. do Trabalho', sex: 'Female', dateOfBirth: '2010-03-22', grade: '8', class: 'A', parentName: 'Joana Moreira', parentEmail: 'joana.moreira@email.com', status: 'Active', behavioralAssessments: [] }
    ],
    teachers: [
        { id: 'T501', name: 'Jorge Dias', email: 'jorge.dias@logix.edu', phone: '870000502', address: 'Rua das Flores', sex: 'Male', subject: 'Science', experience: '6 years', qualifications: 'B.Sc. Biology', status: 'Active' },
    ],
    classes: [
        { id: 'C501', name: 'Grade 8-A', grade: '8', teacher: 'Jorge Dias', students: 1, room: 'S1' }
    ],
};

const plcData: SchoolData = {
    ...emptySchoolData,
    profile: {
        id: 'plc',
        name: 'Progressive Learning Center',
        head: 'Beatriz Lima',
        address: '456 Innovation Drive, Maputo',
        phone: '555-0200',
        email: 'beatriz.lima@plc.edu',
        motto: 'Progress Through Knowledge',
        tier: 'Pro',
        logoUrl: 'https://placehold.co/100x100.png',
        certificateTemplateUrl: 'https://placehold.co/800x600.png',
        transcriptTemplateUrl: 'https://placehold.co/600x800.png',
        gradingSystem: '20-Point',
        currency: 'USD',
        status: 'Active',
        schoolLevel: 'Secondary',
        gradeCapacity: { "8": 30, "9": 30, "10": 30, "11": 35, "12": 35 },
        kioskConfig: defaultKioskConfig,
        subscription: { status: 'Paid', amount: 250, dueDate: '2025-01-01' },
    },
    students: [
        { id: 'STU601', name: 'Daniela Fernandes', email: 'daniela.fernandes@plc.edu', phone: '850000601', address: 'Av. Acordos de Lusaka', sex: 'Female', dateOfBirth: '2007-11-18', grade: '11', class: 'A', parentName: 'Rui Fernandes', parentEmail: 'rui.fernandes@email.com', status: 'Active', behavioralAssessments: [] }
    ],
    teachers: [
        { id: 'T601', name: 'Sofia Carvalho', email: 'sofia.carvalho@plc.edu', phone: '850000602', address: 'Av. de Moçambique', sex: 'Female', subject: 'English', experience: '12 years', qualifications: 'M.A. English Literature', status: 'Active' },
    ],
    classes: [
        { id: 'C601', name: 'Grade 11-A', grade: '11', teacher: 'Sofia Carvalho', students: 1, room: 'E1' }
    ],
};

const trialSchoolData: SchoolData = {
    ...emptySchoolData,
    profile: {
        id: 'trialschool',
        name: 'Trial School',
        head: 'Sofia Mendes',
        address: '789 Demo Street, Matola',
        phone: '555-0300',
        email: 'sofia.mendes@trialschool.edu',
        motto: 'A Place to Start',
        tier: 'Starter',
        logoUrl: 'https://placehold.co/100x100.png',
        certificateTemplateUrl: 'https://placehold.co/800x600.png',
        transcriptTemplateUrl: 'https://placehold.co/600x800.png',
        gradingSystem: '20-Point',
        currency: 'USD',
        status: 'Active',
        schoolLevel: 'Primary',
        gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30 },
        kioskConfig: defaultKioskConfig,
        subscription: { status: 'Paid', amount: 100, dueDate: '2025-01-01' },
    },
    students: [
        { id: 'STU701', name: 'Andre Ramos', email: 'andre.ramos@trialschool.edu', phone: '830000701', address: 'Av. das Indústrias', sex: 'Male', dateOfBirth: '2014-06-30', grade: '4', class: 'A', parentName: 'Paula Ramos', parentEmail: 'paula.ramos@email.com', status: 'Active', behavioralAssessments: [] }
    ],
    teachers: [
        { id: 'T701', name: 'Filipe Correia', email: 'filipe.correia@trialschool.edu', phone: '830000702', address: 'Rua do Rio', sex: 'Male', subject: 'General Studies', experience: '4 years', qualifications: 'B.Ed.', status: 'Active' },
    ],
    classes: [
        { id: 'C701', name: 'Grade 4-A', grade: '4', teacher: 'Filipe Correia', students: 1, room: 'P1' }
    ],
};

const initialSchoolData: Record<string, SchoolData> = {
    'northwood': northwoodData,
    'miniarte': miniArteData,
    'miniarte_matola': miniArteMatolaData,
    'miniarte_beira': miniArteBeiraData,
    'logixsystems': logixSystemsData,
    'plc': plcData,
    'trialschool': trialSchoolData,
};

export async function getSchoolsFromFirestore(): Promise<Record<string, SchoolData>> {
    const schoolsCollection = collection(db, 'schools');
    const schoolSnapshot = await getDocs(schoolsCollection);
    const schoolList = schoolSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data() as SchoolData;
        return acc;
    }, {} as Record<string, SchoolData>);
    return schoolList;
}

export async function getUsersFromFirestore(): Promise<Record<string, UserProfile>> {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    if (userSnapshot.empty) {
        return {};
    }
    const userList = userSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data() as UserProfile;
        return acc;
    }, {} as Record<string, UserProfile>);
    return userList;
}

export async function seedInitialData(): Promise<void> {
    const batch = writeBatch(db);
    
    // Seed schools
    Object.entries(initialSchoolData).forEach(([schoolId, schoolData]) => {
        const schoolRef = doc(db, 'schools', schoolId);
        
        const dataWithServerTimestamps = {
            ...schoolData,
            activityLogs: schoolData.activityLogs.map(log => ({...log, timestamp: serverTimestamp()})),
            events: schoolData.events.map(event => ({...event, date: Timestamp.fromDate(new Date(event.date))})),
            terms: schoolData.terms.map(term => ({...term, startDate: Timestamp.fromDate(new Date(term.startDate)), endDate: Timestamp.fromDate(new Date(term.endDate))})),
            holidays: schoolData.holidays.map(holiday => ({...holiday, date: Timestamp.fromDate(new Date(holiday.date))})),
            competitions: schoolData.competitions.map(comp => ({...comp, date: Timestamp.fromDate(new Date(comp.date))})),
            deployedTests: schoolData.deployedTests.map(test => ({...test, deadline: Timestamp.fromDate(new Date(test.deadline))})),
            admissions: schoolData.admissions.map(adm => ({...adm, date: Timestamp.now()})),
        };

        batch.set(schoolRef, dataWithServerTimestamps);
    });

    // Seed users
    Object.entries(mockUsers).forEach(([username, userProfile]) => {
        const userRef = doc(db, 'users', username);
        batch.set(userRef, userProfile);
    });

    await batch.commit();
}


export async function createSchoolInFirestore(data: NewSchoolData, groupId?: string): Promise<{ school: SchoolData, adminProfile: UserProfile, adminUsername: string }> {
    const schoolId = data.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || `school${Date.now()}`;

    const newSchoolProfile: SchoolProfile = {
        id: schoolId,
        ...data,
        tier: groupId ? 'Premium' : data.tier,
        logoUrl: 'https://placehold.co/100x100.png',
        certificateTemplateUrl: 'https://placehold.co/800x600.png',
        transcriptTemplateUrl: 'https://placehold.co/600x800.png',
        gradingSystem: '20-Point',
        currency: 'USD',
        status: 'Active',
        schoolLevel: 'Full',
        gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 },
        kioskConfig: { showDashboard: true, showLeaderboard: true, showTeacherLeaderboard: true, showAllSchools: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false },
        subscription: { status: 'Paid', amount: 300, dueDate: '2025-01-01' },
        awards: [],
    };
    
    const adminUsername = data.email.split('@')[0].replace(/[^a-z0-9]/gi, '');
    const adminProfile: UserProfile = {
      user: {
        username: adminUsername,
        name: data.head,
        role: 'Admin',
        email: data.email,
        schoolId: schoolId,
      },
      password: 'password'
    };

    const newSchoolData: SchoolData = {
        profile: newSchoolProfile,
        students: [], teachers: [], classes: [], courses: [], syllabi: [],
        admissions: [], exams: [],
        finance: [], assets: [], grades: [], attendance: [],
        events: [], feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform'],
        audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'],
        expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
        expenses: [], teams: [], competitions: [], terms: [], holidays: [],
        kioskMedia: [],
        activityLogs: [{
            id: `LOG${schoolId}${Date.now()}`,
            timestamp: serverTimestamp(),
            schoolId: schoolId,
            user: 'System Admin',
            role: 'GlobalAdmin',
            action: 'Create',
            details: `Provisioned new school: ${data.name}.`
        }],
        messages: [], savedReports: [],
        examBoards: ['Internal', 'Cambridge', 'IEB'],
        deployedTests: [],
        lessonPlans: [],
        savedTests: [],
        schoolGroups: {},
    };

    const schoolDocRef = doc(db, 'schools', schoolId);
    
    const batch = writeBatch(db);
    batch.set(schoolDocRef, newSchoolData);
    
    if (groupId) {
        const groupRef = doc(db, 'schools', 'miniarte'); // Hardcoded 'miniarte' as the group holder
        batch.update(groupRef, {
            [`schoolGroups.${groupId}`]: arrayUnion(schoolId)
        });
    }

    await batch.commit();
    
    return { school: newSchoolData, adminProfile, adminUsername };
}

export async function createUserInFirestore(username: string, profile: UserProfile): Promise<void> {
    const userDocRef = doc(db, 'users', username);
    await setDoc(userDocRef, profile);
}


export async function updateSchoolInFirestore(schoolId: string, data: Partial<SchoolProfile>): Promise<boolean> {
  try {
    const schoolRef = doc(db, 'schools', schoolId);
    
    const updateData: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
        updateData[`profile.${key}`] = data[key];
      }
    }
    
    if (Object.keys(updateData).length === 0) return true;

    await updateDoc(schoolRef, updateData);
    
    return true;
  } catch (error) {
    console.error("Error updating school profile in Firestore:", error);
    return false;
  }
}

// --- Teacher CRUD ---

export async function addTeacherToFirestore(schoolId: string, teacherData: Omit<Teacher, 'id' | 'status'>): Promise<Teacher> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newTeacher: Teacher = {
        id: `T${Date.now()}`,
        status: 'Active',
        ...teacherData
    };
    await updateDoc(schoolRef, {
        teachers: arrayUnion(newTeacher)
    });
    return newTeacher;
}

export async function updateTeacherInFirestore(schoolId: string, teacherId: string, teacherData: Partial<Teacher>): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;
    
    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedTeachers = schoolData.teachers.map(t => t.id === teacherId ? { ...t, ...teacherData } : t);
    await updateDoc(schoolRef, { teachers: updatedTeachers });
}

export async function deleteTeacherFromFirestore(schoolId: string, teacherId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;
    const teacherToDelete = schoolData.teachers.find(t => t.id === teacherId);
    if (teacherToDelete) {
        await updateDoc(schoolRef, {
            teachers: arrayRemove(teacherToDelete)
        });
    }
}

// --- Class CRUD ---

export async function addClassToFirestore(schoolId: string, classData: Omit<Class, 'id'>): Promise<Class> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newClass: Class = {
        id: `C${Date.now()}`,
        ...classData
    };
    await updateDoc(schoolRef, {
        classes: arrayUnion(newClass)
    });
    return newClass;
}

export async function updateClassInFirestore(schoolId: string, classId: string, classData: Partial<Class>): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
     if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedClasses = schoolData.classes.map(c => c.id === classId ? { ...c, ...classData } : c);
    await updateDoc(schoolRef, { classes: updatedClasses });
}

export async function deleteClassFromFirestore(schoolId: string, classId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;

    const batch = writeBatch(db);
    
    const classToDelete = schoolData.classes.find(c => c.id === classId);
    if(classToDelete) {
        batch.update(schoolRef, { classes: arrayRemove(classToDelete) });
    }

    const coursesToDelete = schoolData.courses.filter(c => c.classId === classId);
    if(coursesToDelete.length > 0) {
        batch.update(schoolRef, { courses: arrayRemove(...coursesToDelete) });
    }
    
    await batch.commit();
}

// --- Syllabus CRUD ---
export async function addSyllabusToFirestore(schoolId: string, syllabusData: Omit<Syllabus, 'id' | 'topics'>): Promise<Syllabus> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newSyllabus: Syllabus = {
        id: `SYL${Date.now()}`,
        topics: [],
        ...syllabusData
    };
    await updateDoc(schoolRef, {
        syllabi: arrayUnion(newSyllabus)
    });
    return newSyllabus;
}

export async function updateSyllabusTopicInFirestore(schoolId: string, subject: string, grade: string, topic: SyllabusTopic): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolDoc = await getDoc(schoolRef);
    if (!schoolDoc.exists()) return;

    const schoolData = schoolDoc.data() as SchoolData;
    
    const updatedSyllabi = schoolData.syllabi.map(s => {
        if (s.subject === subject && s.grade === grade) {
            const topicIndex = s.topics.findIndex(t => t.id === topic.id);
            if (topicIndex > -1) {
                s.topics[topicIndex] = topic;
            } else {
                s.topics.push(topic);
            }
        }
        return s;
    });

    await updateDoc(schoolRef, { syllabi: updatedSyllabi });
}

export async function deleteSyllabusTopicFromFirestore(schoolId: string, subject: string, grade: string, topicId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolDoc = await getDoc(schoolRef);
    if (!schoolDoc.exists()) return;

    const schoolData = schoolDoc.data() as SchoolData;

    const updatedSyllabi = schoolData.syllabi.map(s => {
        if (s.subject === subject && s.grade === grade) {
            s.topics = s.topics.filter(t => t.id !== topicId);
        }
        return s;
    });

    await updateDoc(schoolRef, { syllabi: updatedSyllabi });
}

// --- Course CRUD ---
export async function addCourseToFirestore(schoolId: string, courseData: Omit<Course, 'id'>): Promise<Course> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newCourse: Course = {
        id: `CRS${Date.now()}`,
        ...courseData
    };
    await updateDoc(schoolRef, {
        courses: arrayUnion(newCourse)
    });
    return newCourse;
}

export async function updateCourseInFirestore(schoolId: string, courseId: string, courseData: Partial<Course>): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedCourses = schoolData.courses.map(c => c.id === courseId ? { ...c, ...courseData } : c);
    await updateDoc(schoolRef, { courses: updatedCourses });
}

export async function deleteCourseFromFirestore(schoolId: string, courseId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;
    const courseToDelete = schoolData.courses.find(c => c.id === courseId);
    if (courseToDelete) {
        await updateDoc(schoolRef, {
            courses: arrayRemove(courseToDelete)
        });
    }
}

// --- Finance CRUD ---

export async function addFeeToFirestore(schoolId: string, feeData: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>, studentName: string): Promise<FinanceRecord> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newFee: FinanceRecord = {
        id: `FIN${Date.now()}`,
        studentName: studentName,
        status: 'Pending',
        amountPaid: 0,
        ...feeData
    };
    await updateDoc(schoolRef, {
        finance: arrayUnion(newFee)
    });
    return newFee;
}

export async function recordPaymentInFirestore(schoolId: string, feeId: string, amount: number): Promise<FinanceRecord | null> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolDoc = await getDoc(schoolRef);
    if (!schoolDoc.exists()) return null;

    const schoolData = schoolDoc.data() as SchoolData;
    let updatedFee: FinanceRecord | undefined;

    const updatedFinance = schoolData.finance.map(f => {
        if (f.id === feeId) {
            const newAmountPaid = f.amountPaid + amount;
            const status = newAmountPaid >= f.totalAmount ? 'Paid' : 'Partially Paid';
            updatedFee = { ...f, amountPaid: newAmountPaid, status };
            return updatedFee;
        }
        return f;
    });

    await updateDoc(schoolRef, { finance: updatedFinance });
    return updatedFee || null;
}

export async function addExpenseToFirestore(schoolId: string, expenseData: Omit<Expense, 'id'>): Promise<Expense> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newExpense: Expense = {
        id: `EXP${Date.now()}`,
        ...expenseData
    };
    await updateDoc(schoolRef, {
        expenses: arrayUnion(newExpense)
    });
    return newExpense;
}

// --- Sports CRUD ---
export async function addTeamToFirestore(schoolId: string, teamData: Omit<Team, 'id' | 'playerIds'>): Promise<Team> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newTeam: Team = {
        id: `TM${Date.now()}`,
        playerIds: [],
        ...teamData
    };
    await updateDoc(schoolRef, {
        teams: arrayUnion(newTeam)
    });
    return newTeam;
}

export async function deleteTeamFromFirestore(schoolId: string, teamId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;

    const teamToDelete = schoolData.teams.find(t => t.id === teamId);
    if (teamToDelete) {
        const batch = writeBatch(db);
        batch.update(schoolRef, { teams: arrayRemove(teamToDelete) });
        
        const competitionsToDelete = schoolData.competitions.filter(c => c.ourTeamId === teamId);
        if (competitionsToDelete.length > 0) {
            batch.update(schoolRef, { competitions: arrayRemove(...competitionsToDelete) });
        }
        await batch.commit();
    }
}

export async function addPlayerToTeamInFirestore(schoolId: string, teamId: string, studentId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedTeams = schoolData.teams.map(t => {
        if (t.id === teamId && !t.playerIds.includes(studentId)) {
            return { ...t, playerIds: [...t.playerIds, studentId] };
        }
        return t;
    });
    await updateDoc(schoolRef, { teams: updatedTeams });
}

export async function removePlayerFromTeamInFirestore(schoolId: string, teamId: string, studentId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
     if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedTeams = schoolData.teams.map(t => {
        if (t.id === teamId) {
            return { ...t, playerIds: t.playerIds.filter(id => id !== studentId) };
        }
        return t;
    });
    await updateDoc(schoolRef, { teams: updatedTeams });
}

export async function addCompetitionToFirestore(schoolId: string, competitionData: Omit<Competition, 'id' | 'date'> & { date: Date }): Promise<Competition> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newCompetition = {
        id: `CMP${Date.now()}`,
        ...competitionData,
        date: Timestamp.fromDate(competitionData.date),
    };
    await updateDoc(schoolRef, {
        competitions: arrayUnion(newCompetition)
    });
    return { ...newCompetition, date: competitionData.date };
}

export async function addCompetitionResultInFirestore(schoolId: string, competitionId: string, result: Competition['result']): Promise<Competition | null> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return null;

    const schoolData = schoolSnapshot.data() as SchoolData;

    let updatedCompetition: Competition | undefined;
    const updatedCompetitions = schoolData.competitions.map(c => {
        if (c.id === competitionId) {
            const outcome = result.ourScore > result.opponentScore ? 'Win' : result.ourScore < result.opponentScore ? 'Loss' : 'Draw';
            updatedCompetition = { ...c, result: { ...result, outcome } };
            return updatedCompetition;
        }
        return c;
    });

    if (updatedCompetition) {
        await updateDoc(schoolRef, { competitions: updatedCompetitions });
        return { ...updatedCompetition, date: (updatedCompetition.date as any).toDate() };
    }
    return null;
}

// --- Admission CRUD ---

export async function addAdmissionToFirestore(schoolId: string, admissionData: NewAdmissionData, parentName: string, parentEmail: string): Promise<Admission> {
    const schoolRef = doc(db, 'schools', schoolId);
    
    const newAdmission: Admission = {
        id: `ADM${Date.now()}`,
        status: 'Pending',
        parentName: parentName,
        parentEmail: parentEmail,
        ...admissionData,
        date: new Date(),
        dateOfBirth: admissionData.dateOfBirth
    };
    
    const serializableAdmission = { ...newAdmission, date: Timestamp.fromDate(newAdmission.date) };
    
    await updateDoc(schoolRef, {
      admissions: arrayUnion(serializableAdmission)
    });

    return newAdmission;
}


export async function updateAdmissionStatusInFirestore(schoolId: string, admissionId: string, status: Admission['status']): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedAdmissions = schoolData.admissions.map(a => a.id === admissionId ? { ...a, status } : a);

    await updateDoc(schoolRef, { admissions: updatedAdmissions });
}

export async function addStudentFromAdmissionInFirestore(schoolId: string, application: Admission): Promise<Student> {
    const batch = writeBatch(db);
    const targetSchoolRef = doc(db, 'schools', schoolId);
    
    const gradeParts = application.appliedFor.replace('Grade ', '').split('-');
    const grade = gradeParts[0] ? gradeParts[0].trim() : '1';
    const studentClass = gradeParts[1] ? gradeParts[1].trim() : 'A';

    const newStudent: Student = {
        id: application.studentIdToTransfer || `STU${Date.now()}`,
        name: application.name,
        email: `${application.name.toLowerCase().replace(/\s+/g, '.')}@${schoolId}.edu`,
        phone: `555-01${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
        address: '123 Oak Avenue, Maputo',
        sex: application.sex,
        dateOfBirth: application.dateOfBirth,
        grade: grade,
        class: studentClass,
        parentName: application.parentName,
        parentEmail: application.parentEmail,
        status: 'Active',
        behavioralAssessments: [],
    };

    batch.update(targetSchoolRef, {
        students: arrayUnion(newStudent)
    });
    
    if (application.type === 'Transfer' && application.fromSchoolId && application.studentIdToTransfer) {
        const fromSchoolRef = doc(db, 'schools', application.fromSchoolId);
        const fromSchoolDoc = await getDoc(fromSchoolRef);
        if (fromSchoolDoc.exists()) {
            const fromSchoolData = fromSchoolDoc.data() as SchoolData;
            const updatedStudents = fromSchoolData.students.map(s => {
                if (s.id === application.studentIdToTransfer) {
                    return { ...s, status: 'Transferred' as const };
                }
                return s;
            });
            batch.update(fromSchoolRef, { students: updatedStudents });
        }
    }

    await batch.commit();
    return newStudent;
}


// --- Messaging CRUD ---
export async function sendMessageInFirestore(senderSchoolId: string, recipientSchoolId: string, messageData: NewMessageData): Promise<Message> {
    const senderSchoolRef = doc(db, 'schools', senderSchoolId);
    const recipientSchoolRef = doc(db, 'schools', recipientSchoolId);
  
    const newMessage = {
      id: `MSG${Date.now()}`,
      ...messageData,
      timestamp: Timestamp.now(),
      status: 'Pending',
    };
  
    const batch = writeBatch(db);
  
    batch.update(senderSchoolRef, {
      messages: arrayUnion(newMessage)
    });
  
    if (senderSchoolId !== recipientSchoolId) {
      batch.update(recipientSchoolRef, {
        messages: arrayUnion(newMessage)
      });
    }
  
    await batch.commit();
    return { ...newMessage, timestamp: new Date() } as Message;
}

// --- Asset CRUD ---
export async function addAssetToFirestore(schoolId: string, assetData: Omit<any, 'id'>): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newAsset = {
        id: `ASSET${Date.now()}`,
        ...assetData
    };
    await updateDoc(schoolRef, {
        assets: arrayUnion(newAsset)
    });
    return newAsset;
}

// Kiosk Media
export async function addKioskMediaToFirestore(schoolId: string, mediaData: Omit<KioskMedia, 'id' | 'createdAt'>): Promise<KioskMedia> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newMedia = {
        id: `MEDIA${Date.now()}`,
        createdAt: Timestamp.now(),
        ...mediaData
    };
    await updateDoc(schoolRef, { kioskMedia: arrayUnion(newMedia) });
    return { ...newMedia, createdAt: new Date() };
}

export async function removeKioskMediaFromFirestore(schoolId: string, mediaId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;
    const schoolData = schoolSnapshot.data() as SchoolData;
    const mediaToRemove = schoolData.kioskMedia.find(m => m.id === mediaId);
    if (mediaToRemove) {
        await updateDoc(schoolRef, {
            kioskMedia: arrayRemove(mediaToRemove)
        });
    }
}

// Behavioral Assessment
export async function addBehavioralAssessmentToFirestore(schoolId: string, assessmentData: Omit<BehavioralAssessment, 'id' | 'date'>): Promise<BehavioralAssessment> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) throw new Error("School not found");
    const schoolData = schoolSnapshot.data() as SchoolData;
    const newAssessment = {
        id: `BA${Date.now()}`,
        date: Timestamp.now(),
        ...assessmentData
    };
    const updatedStudents = schoolData.students.map(s => {
        if(s.id === assessmentData.studentId) {
            if(!s.behavioralAssessments) s.behavioralAssessments = [];
            s.behavioralAssessments.push(newAssessment as any);
        }
        return s;
    });
    await updateDoc(schoolRef, { students: updatedStudents });
    return { ...newAssessment, date: new Date() };
}

// Grade
export async function addGradeToFirestore(schoolId: string, gradeData: Omit<Grade, 'id'|'date'>): Promise<Grade> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newGrade = {
        id: `GR${Date.now()}`,
        date: Timestamp.now(),
        ...gradeData
    };
    await updateDoc(schoolRef, { grades: arrayUnion(newGrade) });
    return { ...newGrade, date: new Date() };
}

// Attendance
export async function addLessonAttendanceToFirestore(schoolId: string, courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;
    const schoolData = schoolSnapshot.data() as SchoolData;

    const attendanceDate = new Date(date);
    const newRecords = Object.entries(studentStatuses).map(([studentId, status]) => ({
        id: `ATT${Date.now()}${studentId}`,
        studentId,
        date: Timestamp.fromDate(attendanceDate),
        status,
        courseId,
    }));

    const filteredAttendance = schoolData.attendance.filter(a => {
        const recordDateStr = a.date instanceof Timestamp ? a.date.toDate().toISOString().split('T')[0] : new Date(a.date).toISOString().split('T')[0];
        return !(recordDateStr === date && a.courseId === courseId);
    });

    const updatedAttendance = [...filteredAttendance, ...newRecords];
    await updateDoc(schoolRef, { attendance: updatedAttendance });
}

// Test Submission
export async function addTestSubmissionToFirestore(schoolId: string, deployedTestId: string, studentId: string, score: number): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;
    
    const schoolData = schoolSnapshot.data() as SchoolData;

    const submission = {
        studentId,
        score,
        submittedAt: Timestamp.now()
    };
    
    const updatedTests = schoolData.deployedTests.map(t => {
        if(t.id === deployedTestId) {
            return {...t, submissions: [...t.submissions, submission]};
        }
        return t;
    });
    
    await updateDoc(schoolRef, { deployedTests: updatedTests });
}


// --- Academic Year Settings ---

export async function addTermToFirestore(schoolId: string, termData: any): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newTerm = {
        id: `TERM${Date.now()}`,
        ...termData,
        startDate: Timestamp.fromDate(termData.startDate),
        endDate: Timestamp.fromDate(termData.endDate),
    };
    await updateDoc(schoolRef, { terms: arrayUnion(newTerm) });
    return { ...newTerm, startDate: newTerm.startDate.toDate(), endDate: newTerm.endDate.toDate() };
}

export async function addHolidayToFirestore(schoolId: string, holidayData: any): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newHoliday = {
        id: `HOL${Date.now()}`,
        ...holidayData,
        date: Timestamp.fromDate(holidayData.date)
    };
    await updateDoc(schoolRef, { holidays: arrayUnion(newHoliday) });
    return { ...newHoliday, date: newHoliday.date.toDate() };
}

// Dropdown List Management
export async function addExamBoardToFirestore(schoolId: string, boardName: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { examBoards: arrayUnion(boardName) });
}

export async function deleteExamBoardFromFirestore(schoolId: string, boardName: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { examBoards: arrayRemove(boardName) });
}

export async function addFeeDescriptionToFirestore(schoolId: string, desc: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { feeDescriptions: arrayUnion(desc) });
}

export async function deleteFeeDescriptionFromFirestore(schoolId: string, desc: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { feeDescriptions: arrayRemove(desc) });
}

export async function addAudienceToFirestore(schoolId: string, aud: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { audiences: arrayUnion(aud) });
}

export async function deleteAudienceFromFirestore(schoolId: string, aud: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { audiences: arrayRemove(aud) });
}

    
