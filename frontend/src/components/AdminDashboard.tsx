import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Edit2,
  Eye,
  Trash2,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { AddStudentForm } from "./AddStudentForm";
import { EditStudentForm } from "./EditStudentForm";
import ViewStudentModal from "./ViewStudentModal";

import { Student } from "../types";
import { useAuthStore } from "../store/authStore";
import { useStudentStore } from "../store/studentStore";
import { useLogStore } from "../store/logStore";

/* ================= EXPIRY UTIL ================= */
const getExpiryInfo = (inactiveOn?: string) => {
  if (!inactiveOn) return null;

  const today = new Date();
  const expiry = new Date(inactiveOn);
  const diffDays = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return { type: "EXPIRED", label: "Expired" };
  if (diffDays <= 1) return { type: "WARNING", label: `Expires in ${diffDays} day` };

  return null;
};

export function AdminDashboard() {
  const navigate = useNavigate();

  const { user, setUser } = useAuthStore();
  const { students, setStudents } = useStudentStore();
  const { fetchLogs, addLog } = useLogStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    const res = await fetch("http://localhost:5000/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
    fetchLogs();
  }, []);

  /* ================= SORT + SEARCH ================= */
  const filteredStudents = useMemo(() => {
    const searched = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phoneNumber.includes(searchQuery)
    );

    return searched.sort((a, b) => {
      const aInfo = getExpiryInfo(a.inactiveOn);
      const bInfo = getExpiryInfo(b.inactiveOn);

      const priority = (info: any) => {
        if (!info) return 3;
        if (info.type === "EXPIRED") return 1;
        if (info.type === "WARNING") return 2;
        return 3;
      };

      return priority(aInfo) - priority(bInfo);
    });
  }, [students, searchQuery]);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await addLog({
      adminName: user?.name || "Admin User",
      adminEmail: user?.email || "",
      action: "LOGOUT",
      details: "Admin logged out",
    });

    setUser(null);
    navigate("/login");
  };

  /* ================= ADD ================= */
  const handleAddStudent = async (data: Omit<Student, "id">) => {
    await fetch("http://localhost:5000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    await addLog({
      adminName: user?.name || "Admin User",
      adminEmail: user?.email || "",
      action: "ADD",
      studentName: data.name,
      studentId: "db",
      details: "Added student",
    });

    setIsAddModalOpen(false);
    fetchStudents();
  };

  /* ================= EDIT ================= */
  const handleEditStudent = async (updatedStudent: Student) => {
    await fetch(`http://localhost:5000/students/${updatedStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });

    await addLog({
      adminName: user?.name || "Admin User",
      adminEmail: user?.email || "",
      action: "EDIT",
      studentName: updatedStudent.name,
      studentId: updatedStudent.id,
      details: "Edited student details",
    });

    setIsEditModalOpen(false);
    setSelectedStudent(null);
    fetchStudents();
  };

  /* ================= DELETE ================= */
  const handleDeleteStudent = async (student: Student) => {
    if (!window.confirm(`Delete ${student.name}?`)) return;

    await fetch(`http://localhost:5000/students/${student.id}`, {
      method: "DELETE",
    });

    await addLog({
      adminName: user?.name || "Admin User",
      adminEmail: user?.email || "",
      action: "DELETE",
      studentName: student.name,
      studentId: student.id,
      details: "Deleted student",
    });

    fetchStudents();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-[#333547] px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <Button onClick={() => navigate("/logs")} variant="ghost" className="text-white">
            <ClipboardList className="h-4 w-4 mr-2" />
            Logs
          </Button>

          <Button onClick={handleLogout} variant="ghost" className="text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-6">
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />

          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => {
              const expiry = getExpiryInfo(s.inactiveOn);

              return (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.phoneNumber}</td>
                  <td className="p-3">{s.type}</td>
                  <td className="p-3">{s.activityStatus}</td>

                  <td className="p-3 flex items-center gap-2">
                    <Button size="sm" onClick={() => { setSelectedStudent(s); setIsViewModalOpen(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button size="sm" onClick={() => { setSelectedStudent(s); setIsEditModalOpen(true); }}>
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <div className="relative">
                      <Button
                        size="sm"
                        className="bg-red-600 text-white"
                        onClick={() => handleDeleteStudent(s)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      {expiry && (
                        <span
                          title={expiry.label}
                          className={`absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            expiry.type === "EXPIRED"
                              ? "bg-red-600 text-white"
                              : "bg-yellow-500 text-black"
                          }`}
                        >
                          ⏳
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>

      {/* MODALS */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Student">
        <AddStudentForm
          onSubmit={handleAddStudent}
          onCancel={() => setIsAddModalOpen(false)}
          existingPhoneNumbers={students.map((s) => s.phoneNumber)}
          existingEmails={students.map((s) => s.email.toLowerCase())}
        />
      </Modal>

      {selectedStudent && (
        <ViewStudentModal
          student={selectedStudent}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {selectedStudent && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Student">
          <EditStudentForm
            student={selectedStudent}
            onSubmit={handleEditStudent}
            onCancel={() => setIsEditModalOpen(false)}
            existingPhoneNumbers={students.map((s) => s.phoneNumber)}
          />
        </Modal>
      )}
    </div>
  );
}
