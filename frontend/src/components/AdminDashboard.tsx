import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Edit2,
  Eye,
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

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { user, setUser } = useAuthStore();
  const { students, setStudents } = useStudentStore();
  const { addLog } = useLogStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  /* ================= FETCH STUDENTS ================= */
/* ================= FETCH STUDENTS ================= */
const fetchStudents = async () => {
  const res = await fetch("/api/students");
  const data = await res.json();

  const today = new Date();

  for (const student of data) {
    if (
      student.inactiveOn &&
      new Date(student.inactiveOn) < today &&
      student.activityStatus.toUpperCase() === "ACTIVE"
    ) {
      await fetch(`/api/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...student,
          activityStatus: "INACTIVE",
        }),
      });
    }
  }

  const updatedRes = await fetch("/api/students");
  const updatedData = await updatedRes.json();

  setStudents(updatedData);
};

/* ✅ CALL IT HERE */
useEffect(() => {
  fetchStudents();
}, []);



  /* ================= FILTER + SEARCH ================= */
  const filteredStudents = useMemo(() => {
  let result = students;

  // Filter by status
  if (filterStatus !== "ALL") {
    result = result.filter(
      (s) =>
        s.activityStatus &&
        s.activityStatus.trim().toUpperCase() === filterStatus
    );
  }

  // Search filter
  result = result.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phoneNumber.includes(searchQuery)
  );

  // 🔥 SORT BY NAME (A-Z)
  return result.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}, [students, searchQuery, filterStatus]);


  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
  try {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adminName: user?.name,
        adminEmail: user?.email,
      }),
    });
  } catch (error) {
    console.error("Logout error:", error);
  }

  setUser(null);
  navigate("/login");
};


  /* ================= ADD ================= */
const handleAddStudent = async (data: Omit<Student, "id">) => {
  const formattedData = {
    ...data,
    activityStatus:
      data.activityStatus === "INACTIVE" ? "INACTIVE" : "ACTIVE",
  };

  await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedData),
  });

  setIsAddModalOpen(false);
  await fetchStudents();
};


  /* ================= EDIT ================= */
  const handleEditStudent = async (updatedStudent: Student) => {
    await fetch(`/api/students/${updatedStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });

    setIsEditModalOpen(false);
    setSelectedStudent(null);
    fetchStudents();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#333547] px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/logs")}
            variant="ghost"
            className="text-white"
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Logs
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-6">
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />

          <div className="flex gap-2">
            <Button onClick={() => setFilterStatus("ALL")}>All</Button>
            <Button onClick={() => setFilterStatus("ACTIVE")}>Active</Button>
            <Button onClick={() => setFilterStatus("INACTIVE")}>
              Inactive
            </Button>

            <Button onClick={() => setIsAddModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
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
            {filteredStudents.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.phoneNumber}</td>
                <td className="p-3">{s.type}</td>
                <td className="p-3">{s.activityStatus}</td>

                <td className="p-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(s);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(s);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {/* ADD MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Student"
      >
        <AddStudentForm
          onSubmit={handleAddStudent}
          onCancel={() => setIsAddModalOpen(false)}
          existingPhoneNumbers={students.map((s) => s.phoneNumber)}
          existingEmails={students.map((s) => s.email.toLowerCase())}
        />
      </Modal>

      {/* VIEW MODAL */}
      {selectedStudent && (
        <ViewStudentModal
          student={selectedStudent}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {/* EDIT MODAL */}
      {selectedStudent && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Student"
        >
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
