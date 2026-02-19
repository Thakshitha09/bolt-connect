export type StudentType = 'JOB_SEEKER' | 'PAID_INTERN' | 'UNPAID_INTERN' | 'STUDENT' | 'LEARNER';

export type ActivityStatus = 'ACTIVE' | 'INACTIVE';

export interface Student {
  id: string;
  name: string;
  phoneNumber: string;
  type: StudentType;
  email: string;
  amountPaid: number;
  dueAmount: number;
  discount: number;
  dateOfJoining: string;
  incentivesPaid: number;
  country: string;
  state: string;
  address: string;
  governmentIdProof: string;
  inactiveOn?: string;
  activityStatus: ActivityStatus;
  inactivityReason?: string;
}

export interface User {
  id: string;
  role: 'ADMIN';
  name: string;
  email: string;
}

export interface LogEntry {
  id: string;
  adminName: string;
  adminEmail: string;
  action: 'ADD' | 'UPDATE';
  studentName: string;
  studentId: string;
  timestamp: string;
  details: string;
}