import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Student } from "../types";

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/students/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student:", err);
        setLoading(false);
      });
  }, [user]);

  if (!user) return <p>Please login</p>;
  if (loading) return <p>Loading...</p>;
  if (!student) return <p>No student data found</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Welcome, {student.name}</h2>

      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Phone:</strong> {student.phoneNumber}</p>
      <p><strong>Type:</strong> {student.type}</p>
      <p><strong>Date Of Joining:</strong> {student.dateOfJoining}</p>
      <p><strong>Status:</strong> {student.activityStatus}</p>
      <p><strong>Address:</strong> {student.address}</p>
      <p><strong>Country:</strong> {student.country}</p>
      <p><strong>State:</strong> {student.state}</p>
    </div>
  );
}
