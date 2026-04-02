export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  rollNo?: string;
  employeeId?: string;
}

export interface AttendanceRecord {
  subject: string;
  totalClasses: number;
  attended: number;
  percentage: number;
}

export interface MarksRecord {
  subject: string;
  internal1: number;
  internal2: number;
  assignment: number;
  total: number;
  maxTotal: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  department: string;
  semester: number;
  attendance: number;
}

export const mockStudentUser: User = {
  id: '1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@college.edu',
  role: 'student',
  department: 'Computer Science',
  rollNo: 'CS2024001',
};

export const mockTeacherUser: User = {
  id: '2',
  name: 'Dr. Priya Mehta',
  email: 'priya.mehta@college.edu',
  role: 'teacher',
  department: 'Computer Science',
  employeeId: 'EMP1042',
};

export const mockAdminUser: User = {
  id: '3',
  name: 'Rajesh Kumar',
  email: 'admin@college.edu',
  role: 'admin',
};

export const mockAttendance: AttendanceRecord[] = [
  { subject: 'Data Structures', totalClasses: 40, attended: 36, percentage: 90 },
  { subject: 'Operating Systems', totalClasses: 38, attended: 30, percentage: 79 },
  { subject: 'Database Systems', totalClasses: 42, attended: 38, percentage: 90 },
  { subject: 'Computer Networks', totalClasses: 35, attended: 28, percentage: 80 },
  { subject: 'Software Engineering', totalClasses: 36, attended: 34, percentage: 94 },
];

export const mockMarks: MarksRecord[] = [
  { subject: 'Data Structures', internal1: 22, internal2: 24, assignment: 9, total: 55, maxTotal: 60 },
  { subject: 'Operating Systems', internal1: 18, internal2: 20, assignment: 8, total: 46, maxTotal: 60 },
  { subject: 'Database Systems', internal1: 25, internal2: 23, assignment: 10, total: 58, maxTotal: 60 },
  { subject: 'Computer Networks', internal1: 20, internal2: 19, assignment: 7, total: 46, maxTotal: 60 },
  { subject: 'Software Engineering', internal1: 23, internal2: 22, assignment: 9, total: 54, maxTotal: 60 },
];

export const mockNotices: Notice[] = [
  { id: '1', title: 'Mid-Semester Exam Schedule Released', content: 'The mid-semester examination schedule for all departments has been released. Please check the exam section for details.', date: '2026-03-28', author: 'Exam Cell', priority: 'high' },
  { id: '2', title: 'Annual Sports Day Registration', content: 'Registrations are now open for the Annual Sports Day. Last date to register is April 10, 2026.', date: '2026-03-25', author: 'Sports Committee', priority: 'medium' },
  { id: '3', title: 'Library Extended Hours', content: 'The college library will remain open until 10 PM during exam weeks starting April 5.', date: '2026-03-22', author: 'Library', priority: 'low' },
  { id: '4', title: 'Guest Lecture on AI & ML', content: 'A guest lecture on "Future of AI & ML" by Dr. Andrew Ng will be held on April 8 in the main auditorium.', date: '2026-03-20', author: 'CS Department', priority: 'medium' },
];

export const mockAssignments: Assignment[] = [
  { id: '1', title: 'Binary Tree Implementation', subject: 'Data Structures', dueDate: '2026-04-05', status: 'pending' },
  { id: '2', title: 'Process Scheduling Simulation', subject: 'Operating Systems', dueDate: '2026-04-03', status: 'submitted' },
  { id: '3', title: 'ER Diagram Design', subject: 'Database Systems', dueDate: '2026-03-30', status: 'graded', grade: 'A' },
  { id: '4', title: 'TCP/IP Protocol Analysis', subject: 'Computer Networks', dueDate: '2026-04-08', status: 'pending' },
];

export const mockStudentRecords: StudentRecord[] = [
  { id: '1', name: 'Aarav Sharma', rollNo: 'CS2024001', email: 'aarav@college.edu', department: 'Computer Science', semester: 4, attendance: 87 },
  { id: '2', name: 'Sneha Patel', rollNo: 'CS2024002', email: 'sneha@college.edu', department: 'Computer Science', semester: 4, attendance: 92 },
  { id: '3', name: 'Rohan Gupta', rollNo: 'CS2024003', email: 'rohan@college.edu', department: 'Computer Science', semester: 4, attendance: 75 },
  { id: '4', name: 'Ananya Singh', rollNo: 'CS2024004', email: 'ananya@college.edu', department: 'Computer Science', semester: 4, attendance: 95 },
  { id: '5', name: 'Vikram Joshi', rollNo: 'EC2024001', email: 'vikram@college.edu', department: 'Electronics', semester: 4, attendance: 82 },
  { id: '6', name: 'Meera Iyer', rollNo: 'ME2024001', email: 'meera@college.edu', department: 'Mechanical', semester: 4, attendance: 88 },
];

export const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
export const subjects = ['Data Structures', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Software Engineering'];
