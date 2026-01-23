import { create } from 'zustand';
import { Student } from '../types';

interface StudentState {
  students: Student[];
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [{
    id: '1',
    name: 'John Doe',
    phoneNumber: '911234567890',
    type: 'STUDENT',
    email: 'john@example.com',
    amountPaid: 1000,
    dueAmount: 500,
    discount: 100,
    dateOfJoining: '2024-03-15',
    incentivesPaid: 0,
    country: 'United States',
    state: 'California',
    address: '123 Main St, San Francisco, CA 94105',
    governmentIdProof: 'Passport',
    activityStatus: 'ACTIVE',
    inactiveOn: '2024-06-15',
    inactivityReason: 'Course completion scheduled'
  }],
  setStudents: (students) => set({ students }),
  addStudent: (student) => set((state) => ({ 
    students: [...state.students, student] 
  })),
  updateStudent: (updatedStudent) => set((state) => ({
    students: state.students.map((student) => 
      student.id === updatedStudent.id ? updatedStudent : student
    )
  }))
}));