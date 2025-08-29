

import { type Role } from "@/context/auth-context";

// This file is now used only for seeding the database for the first time.
// The main application reads directly from Firestore.

export const initialSchoolData: Record<string, any> = {
    'northwood': {
        profile: {
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
            kioskConfig: { showDashboard: true, showLeaderboard: true, showTeacherLeaderboard: true, showAllSchools: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false },
            subscription: { status: 'Paid', amount: 300, dueDate: '2025-01-01' },
            awards: [],
            feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform', 'Field Trip', 'Library Fund'],
            audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Grades 6-8', 'Whole School Community', 'All Staff'],
            expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics', 'Marketing'],
            examBoards: ['Internal', 'Cambridge', 'IEB'],
            schoolGroups: {},
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
            { id: 'T03', name: 'Vasco Nunes', email: 'vasco.nunes@northwood.edu', phone: '820000003', address: 'Av. Vladimir Lenine', sex: 'Male', subject: 'Physical Education', experience: '12 years', qualifications: 'B.Sc. Sports Science', status: 'Active' },
        ],
        classes: [
            { id: 'C01', name: 'Grade 10-A', grade: '10', teacher: 'Sérgio Almeida', students: 30, room: '101' },
            { id: 'C02', name: 'Grade 11-B', grade: '11', teacher: 'Catarina Martins', students: 28, room: '102' },
            { id: 'C03', name: 'Grade 9-C', grade: '9', teacher: 'Sérgio Almeida', students: 25, room: '103' },
            { id: 'C04', name: 'Grade 8-A', grade: '8', teacher: 'Catarina Martins', students: 28, room: '104' },
            { id: 'C05', name: 'Grade 5-B', grade: '5', teacher: 'Vasco Nunes', students: 22, room: '105' },
        ],
        courses: [
            { id: 'CRS01', subject: 'Mathematics', teacherId: 'T01', classId: 'C01', schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00', room: '101' }] },
            { id: 'CRS02', subject: 'History', teacherId: 'T02', classId: 'C02', schedule: [{ day: 'Tuesday', startTime: '10:00', endTime: '11:00', room: '102' }] },
            { id: 'CRS03', subject: 'Mathematics', teacherId: 'T01', classId: 'C03', schedule: [{ day: 'Wednesday', startTime: '11:00', endTime: '12:00', room: '103' }] },
            { id: 'CRS04', subject: 'Physical Education', teacherId: 'T03', classId: 'C05', schedule: [{ day: 'Friday', startTime: '14:00', endTime: '15:00', room: 'Gym' }] },
        ],
        grades: [
            { id: 'G01', studentId: 'STU001', subject: 'Mathematics', grade: '18', date: new Date('2024-03-15T00:00:00Z'), type: 'Test', description: 'Algebra Test', teacherId: 'T01' },
            { id: 'G02', studentId: 'STU002', subject: 'Mathematics', grade: '14', date: new Date('2024-03-15T00:00:00Z'), type: 'Test', description: 'Algebra Test', teacherId: 'T01' },
            { id: 'G03', studentId: 'STU003', subject: 'History', grade: '16', date: new Date('2024-04-10T00:00:00Z'), type: 'Coursework', description: 'WWII Essay', teacherId: 'T02' },
            { id: 'G04', studentId: 'STU004', subject: 'History', grade: '19', date: new Date('2024-04-12T00:00:00Z'), type: 'Coursework', description: 'Mozambique History Presentation', teacherId: 'T02' },
            { id: 'G05', studentId: 'STU005', subject: 'Physical Education', grade: '17', date: new Date('2024-04-18T00:00:00Z'), type: 'Test', description: 'Fitness Test', teacherId: 'T03' },
        ],
        finance: [
            { id: 'FIN01', studentId: 'STU001', studentName: 'Miguel Santos', description: 'Term 1 Tuition', totalAmount: 50000, amountPaid: 50000, dueDate: '2024-02-01', status: 'Paid' },
            { id: 'FIN02', studentId: 'STU002', studentName: 'Inês Pereira', description: 'Term 1 Tuition', totalAmount: 50000, amountPaid: 25000, dueDate: '2024-02-01', status: 'Partially Paid' },
            { id: 'FIN03', studentId: 'STU003', studentName: 'Tiago Rodrigues', description: 'Term 2 Tuition', totalAmount: 50000, amountPaid: 0, dueDate: '2024-05-01', status: 'Pending' },
            { id: 'FIN04', studentId: 'STU004', studentName: 'Lucia Santos', description: 'Term 1 Tuition', totalAmount: 45000, amountPaid: 45000, dueDate: '2024-02-01', status: 'Paid' },
        ],
        activityLogs: [
            { id: 'LOG001', timestamp: new Date('2024-05-20T10:00:00Z'), schoolId: 'northwood', user: 'Amelia Costa', role: 'Admin', action: 'Update', details: 'Updated school profile.' },
            { id: 'LOG002', timestamp: new Date('2024-05-19T14:30:00Z'), schoolId: 'northwood', user: 'Sérgio Almeida', role: 'Teacher', action: 'Create', details: 'Added new grade for Miguel Santos.' },
        ],
        savedTests: [
            { id: 'ST01', teacherId: 'T01', subject: 'Mathematics', topic: 'Algebra Basics', grade: '10', createdAt: new Date(), questions: [
                { question: 'What is 2 + 2?', options: ['3', '4', '5', '22'], correctAnswer: '4' },
                { question: 'What is x in x + 5 = 10?', options: ['3', '4', '5', '15'], correctAnswer: '5' },
            ]},
        ],
        deployedTests: [
            { id: 'DT01', testId: 'ST01', classId: 'C01', deadline: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), submissions: [] }
        ],
        syllabi: [], admissions: [], exams: [], assets: [], attendance: [], events: [], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], messages: [], savedReports: [], lessonPlans: [],
    },
    'miniarte': {
        profile: {
            id: 'miniarte', name: 'MiniArte Creative School', head: 'Carlos Pereira', address: 'Rua da Cultura, Beira', phone: '+258 86 111 2233', email: 'carlos.pereira@miniarte.edu', motto: 'Creating the Future', tier: 'Premium', logoUrl: 'https://placehold.co/100x100.png', certificateTemplateUrl: 'https://placehold.co/800x600.png', transcriptTemplateUrl: 'https://placehold.co/600x800.png', gradingSystem: '20-Point', currency: 'USD', status: 'Active', schoolLevel: 'Full', gradeCapacity: { "1": 20, "2": 20, "3": 20, "4": 25, "5": 25, "6": 25, "7": 30, "8": 30, "9": 30, "10": 30, "11": 30, "12": 30 }, kioskConfig: { showDashboard: true, showLeaderboard: true, showTeacherLeaderboard: true, showAllSchools: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false }, subscription: { status: 'Paid', amount: 500, dueDate: '2025-01-01' }, schoolGroups: { 'miniarte_group': ['miniarte', 'miniarte_matola', 'miniarte_beira'] },
        },
        students: [], teachers: [], classes: [], courses: [], syllabi: [], admissions: [], exams: [], finance: [], assets: [], grades: [], attendance: [], events: [], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], activityLogs: [], messages: [], savedReports: [], deployedTests: [], lessonPlans: [], savedTests: [],
    },
    'miniarte_matola': {
        profile: {
            id: 'miniarte_matola', name: 'MiniArte Matola Campus', head: 'Isabel Rocha', address: 'Bairro Tsalala, Matola', phone: '860000302', email: 'isabel.rocha@miniarte.edu', motto: 'Nurturing Young Artists', tier: 'Premium', logoUrl: 'https://placehold.co/100x100.png', certificateTemplateUrl: 'https://placehold.co/800x600.png', transcriptTemplateUrl: 'https://placehold.co/600x800.png', gradingSystem: '20-Point', currency: 'USD', status: 'Active', schoolLevel: 'Full', gradeCapacity: { "1": 20, "2": 20, "3": 20, "4": 25, "5": 25, "6": 25, "7": 30, "8": 30, "9": 30, "10": 30, "11": 30, "12": 30 }, kioskConfig: { showDashboard: true, showLeaderboard: true, showTeacherLeaderboard: true, showAllSchools: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false }, subscription: { status: 'Paid', amount: 250, dueDate: '2025-01-01' }, awards: [],
        },
        students: [ { id: 'STU301', name: 'Julio Silva', email: 'julio.silva@miniarte.edu', phone: '860000301', address: 'Bairro Tsalala', sex: 'Male', dateOfBirth: '2012-09-01', grade: '6', class: 'A', parentName: 'Fernanda Silva', parentEmail: 'fernanda.silva@email.com', status: 'Active', behavioralAssessments: [] }],
        teachers: [], classes: [], courses: [], syllabi: [], admissions: [], exams: [], finance: [], assets: [], grades: [], attendance: [], events: [], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], activityLogs: [], messages: [], savedReports: [], deployedTests: [], lessonPlans: [], savedTests: [],
    },
    'miniarte_beira': {
        profile: {
            id: 'miniarte_beira', name: 'MiniArte Beira Campus', head: 'Pedro Gonçalves', address: 'Bairro da Ponta Gêa, Beira', phone: '860000402', email: 'pedro.goncalves@miniarte.edu', motto: 'Artistry by the Sea', tier: 'Premium', logoUrl: 'https://placehold.co/100x100.png', certificateTemplateUrl: 'https://placehold.co/800x600.png', transcriptTemplateUrl: 'https://placehold.co/600x800.png', gradingSystem: '20-Point', currency: 'USD', status: 'Active', schoolLevel: 'Full', gradeCapacity: { "1": 20, "2": 20, "3": 20, "4": 25, "5": 25, "6": 25, "7": 30, "8": 30, "9": 30, "10": 30, "11": 30, "12": 30 }, kioskConfig: { showDashboard: true, showLeaderboard: true, showTeacherLeaderboard: true, showAllSchools: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false }, subscription: { status: 'Paid', amount: 250, dueDate: '2025-01-01' }, awards: [],
        },
        students: [{ id: 'STU401', name: 'Mariana Lopes', email: 'mariana.lopes@miniarte.edu', phone: '860000401', address: 'Bairro da Ponta Gêa', sex: 'Female', dateOfBirth: '2011-12-25', grade: '7', class: 'A', parentName: 'Sérgio Lopes', parentEmail: 'sergio.lopes@email.com', status: 'Active', behavioralAssessments: [] }],
        teachers: [], classes: [], courses: [], syllabi: [], admissions: [], exams: [], finance: [], assets: [], grades: [], attendance: [], events: [], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], activityLogs: [], messages: [], savedReports: [], deployedTests: [], lessonPlans: [], savedTests: [],
    },
    'logixsystems': {
        profile: {
            id: 'logixsystems', name: 'Logix Systems School', head: 'Ricardo Jorge', address: '123 Tech Park, Matola', phone: '555-0100', email: 'ricardo.jorge@logix.edu', motto: 'Logic and Learning', tier: 'Starter', logoUrl: 'https://placehold.co/100x100.png', certificateTemplateUrl: 'https://placehold.co/800x600.png', transcriptTemplateUrl: 'https://placehold.co/600x800.png', gradingSystem: '20-Point', currency: 'USD', status: 'Active', schoolLevel: 'Full', gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 }, kioskConfig: { showDashboard: true, showLeaderboard: true, showTeacherLeaderboard: true, showAllSchools: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false }, subscription: { status: 'Paid', amount: 100, dueDate: '2025-01-01' },
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
        courses: [ { id: 'CRS501', subject: 'Science', teacherId: 'T501', classId: 'C501', schedule: [{ day: 'Tuesday', startTime: '08:00', endTime: '09:00', room: 'S1' }] }],
        grades: [ { id: 'G501', studentId: 'STU501', subject: 'Science', grade: '15', date: new Date('2024-04-01T00:00:00Z'), type: 'Test', description: 'Biology Test', teacherId: 'T501' }],
        finance: [ { id: 'FIN501', studentId: 'STU501', studentName: 'Laura Moreira', description: 'Term 1 Tuition', totalAmount: 35000, amountPaid: 35000, dueDate: '2024-02-01', status: 'Paid' }],
        syllabi: [], admissions: [], exams: [], assets: [], attendance: [], events: [], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], activityLogs: [], messages: [], savedReports: [], deployedTests: [], lessonPlans: [], savedTests: [],
    },
    'plc': {
        profile: {
            id: 'plc', name: 'Progressive Learning Center', head: 'Beatriz Lima', address: '456 Innovation Drive, Maputo', phone: '555-0200', email: 'beatriz.lima@plc.edu', motto: 'Progress Through Knowledge', tier: 'Pro', logoUrl: 'https://placehold.co/100x100.png', certificateTemplateUrl: 'https://placehold.co/800x600.png', transcriptTemplateUrl: 'https://placehold.co/600x800.png', gradingSystem: '20-Point', currency: 'USD', status: 'Active', schoolLevel: 'Secondary', gradeCapacity: { "8": 30, "9": 30, "10": 30, "11": 35, "12": 35 }, kioskConfig: { showDashboard: true, showLeaderboard: true, showTeacherLeaderboard: true, showAllSchools: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false }, subscription: { status: 'Paid', amount: 250, dueDate: '2025-01-01' },
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
        courses: [{ id: 'CRS601', subject: 'English', teacherId: 'T601', classId: 'C601', schedule: [{ day: 'Thursday', startTime: '10:00', endTime: '11:00', room: 'E1' }] }],
        grades: [ { id: 'G601', studentId: 'STU601', subject: 'English', grade: '16', date: new Date('2024-04-05T00:00:00Z'), type: 'Coursework', description: 'Literature Essay', teacherId: 'T601' }],
        finance: [ { id: 'FIN601', studentId: 'STU601', studentName: 'Daniela Fernandes', description: 'Term 1 Tuition', totalAmount: 60000, amountPaid: 60000, dueDate: '2024-02-01', status: 'Paid' }],
        syllabi: [], admissions: [], exams: [], assets: [], attendance: [], events: [], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], activityLogs: [], messages: [], savedReports: [], deployedTests: [], lessonPlans: [], savedTests: [],
    },
    'trialschool': {
        profile: {
            id: 'trialschool', name: 'Trial School', head: 'Sofia Mendes', address: '789 Demo Street, Matola', phone: '555-0300', email: 'sofia.mendes@trialschool.edu', motto: 'A Place to Start', tier: 'Starter', logoUrl: 'https://placehold.co/100x100.png', certificateTemplateUrl: 'https://placehold.co/800x600.png', transcriptTemplateUrl: 'https://placehold.co/600x800.png', gradingSystem: '20-Point', currency: 'USD', status: 'Active', schoolLevel: 'Primary', gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30 }, kioskConfig: { showDashboard: true, showLeaderboard: true, showTeacherLeaderboard: true, showAllSchools: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false }, subscription: { status: 'Paid', amount: 100, dueDate: '2025-01-01' },
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
        courses: [{ id: 'CRS701', subject: 'General Studies', teacherId: 'T701', classId: 'C701', schedule: [{ day: 'Monday', startTime: '08:00', endTime: '09:00', room: 'P1' }] }],
        grades: [{ id: 'G701', studentId: 'STU701', subject: 'General Studies', grade: '14', date: new Date('2024-04-10T00:00:00Z'), type: 'Coursework', description: 'Project', teacherId: 'T701' }],
        finance: [ { id: 'FIN701', studentId: 'STU701', studentName: 'Andre Ramos', description: 'Term 1 Tuition', totalAmount: 25000, amountPaid: 25000, dueDate: '2024-02-01', status: 'Paid' }],
        syllabi: [], admissions: [], exams: [], assets: [], attendance: [], events: [], expenses: [], teams: [], competitions: [], terms: [], holidays: [], kioskMedia: [], activityLogs: [], messages: [], savedReports: [], deployedTests: [], lessonPlans: [], savedTests: [],
    },
};

    