import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useAuthStore } from "../store/authStore";
import { useLogStore } from "../store/logStore";

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
  const { addLog } = useLogStore();

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

    // remove password before storing
    const { password: _, ...userWithoutPassword } = adminUser;

    // ✅ set auth state
    setUser(userWithoutPassword);

    // ✅ LOG LOGIN (THIS WAS MISSING)
    await addLog({
      adminName: adminUser.name,
      adminEmail: adminUser.email,
      action: "LOGIN",
      details: "Admin logged in",
    });

    setError("");
    navigate("/dashboard");
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
