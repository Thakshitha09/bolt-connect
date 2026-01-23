import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Student } from "../types";
import { Button } from "./ui/Button";
import { useAuthStore } from "../store/authStore";

interface UserDashboardProps {
  student: Student;
}

export function UserDashboard({ student }: UserDashboardProps) {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleLogout = () => {
    setUser(null);
    navigate("/login"); // ✅ Logout should go to login
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* ✅ LOGO / TITLE — NO NAVIGATION */}
          <div className="flex items-center gap-3 cursor-default">
            <img
              src="/favicon.svg"
              alt="JALA Connect"
              className="h-8 w-8"
            />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              JALA Connect
            </h1>
          </div>

          {/* LOGOUT */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
          
          {/* PROFILE HEADER */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gray-100 p-3 rounded-full">
              <User className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <p className="text-gray-500">{student.email}</p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CONTACT */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Contact Details
              </h3>
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {student.phoneNumber}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {student.address}
                  </dd>
                </div>
              </dl>
            </div>

            {/* STATUS */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Account Status
              </h3>
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm sm:col-span-2">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                        student.activityStatus === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.activityStatus}
                    </span>
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Date Joined
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {new Date(student.dateOfJoining).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* SUPPORT */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700">
              For any queries, contact support at{" "}
              <a href="tel:+916281994649" className="font-medium">
                +91-628-199-4649
              </a>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
