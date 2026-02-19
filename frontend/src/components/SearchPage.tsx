import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Student } from "../types";

export function SearchPage() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResult, setSearchResult] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getExpiryText = (inactiveOn?: string) => {
    if (!inactiveOn) return null;

    const today = new Date();
    const inactiveDate = new Date(inactiveOn);

    const diffTime = inactiveDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Expired ${Math.abs(diffDays)} day(s) ago`;
    if (diffDays === 0) return "Expires today";
    return `Expires in ${diffDays} day(s)`;
  };

  const handleSearch = async () => {
    if (phoneNumber.length !== 12) {
      setError("Please enter a valid 12-digit phone number");
      setSearchResult(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `/api/students/phone/${phoneNumber}`
      );

      if (!res.ok) {
        setError("No student found with this phone number");
        setSearchResult(null);
        setLoading(false);
        return;
      }

      const data: Student = await res.json();
      setSearchResult(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#333547] relative">
      <div className="absolute top-6 left-6"></div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center py-16">
          <div
            className="cursor-pointer select-none"
            onClick={() => navigate("/login")}
          >
            <img
              src="/logo.png"
              alt="JALA Connect Logo"
              className="h-20 mb-3 mx-auto"
            />
            <p className="mt-2 text-lg text-gray-300 text-center">
              Mentorship and Learning, Redefined
            </p>
          </div>

          <div className="mt-8 w-full max-w-md">
            <div className="flex gap-2">
              <Input
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 12) setPhoneNumber(value);
                }}
                placeholder="Enter 12-digit phone number"
                className="flex-1 bg-white/10 border-white/20 text-white"
                maxLength={12}
              />
              <Button
                onClick={handleSearch}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {loading && (
              <p className="mt-2 text-sm text-gray-300">Searching...</p>
            )}

            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>
        </div>

        {searchResult && (
          <div className="mt-8 bg-[#15172b] ring-1 ring-white/10 sm:rounded-xl p-6 max-w-2xl mx-auto">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm text-gray-300">Name</dt>
                <dd className="text-sm text-white col-span-2">
                  {searchResult.name}
                </dd>
              </div>

              <div className="px-4 py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm text-gray-300">Phone</dt>
                <dd className="text-sm text-white col-span-2">
                  {searchResult.phoneNumber}
                </dd>
              </div>

              <div className="px-4 py-3 grid grid-cols-3 gap-4">
                <dt className="text-sm text-gray-300">Status</dt>
                <dd className="col-span-2">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      searchResult.activityStatus === "ACTIVE"
                        ? "bg-green-900 text-green-200"
                        : "bg-red-900 text-red-200"
                    }`}
                  >
                    {searchResult.activityStatus}
                  </span>
                </dd>
              </div>

              {searchResult.inactiveOn && (
                <div className="px-4 py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm text-gray-300">Expires On</dt>
                  <dd className="text-sm text-white col-span-2">
                    {new Date(
                      searchResult.inactiveOn
                    ).toLocaleDateString()}
                    <div className="mt-1 text-sm font-semibold text-yellow-400">
                      ⏳ {getExpiryText(searchResult.inactiveOn)}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
