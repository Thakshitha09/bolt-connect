import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useAuthStore } from "../store/authStore";

const ADMIN_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin",
    name: "Admin User",
    role: "ADMIN" as const,
  },
  {
    id: "2",
    email: "admin@test.com",
    password: "admin",
    name: "Test Admin",
    role: "ADMIN" as const,
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const adminUser = ADMIN_USERS.find(
    (admin) => admin.email === email && admin.password === password
  );

  if (!adminUser) {
    setError("Invalid email or password");
    return;
  }

  const { password: _, ...userWithoutPassword } = adminUser;

  setUser(userWithoutPassword);

  await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      adminName: adminUser.name,
      adminEmail: adminUser.email,
    }),
  });

  // ✅ Redirect based on role
  if (adminUser.role === "ADMIN") {
    navigate("/admin");
  } else {
    navigate("/user");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <GraduationCap className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
