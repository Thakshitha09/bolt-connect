import { useEffect, useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Input } from "./ui/Input";
import { useLogStore } from "../store/logStore";

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export default function LogsPage() {
  const { logs, fetchLogs } = useLogStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const name = log.adminName?.toLowerCase() || "";
      const email = log.adminEmail?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        email.includes(query);

      const matchesAction =
        actionFilter === "ALL" || log.action === actionFilter;

      const dateObj = log.timestamp ? new Date(log.timestamp) : null;

      const logDateOnly =
        dateObj && !isNaN(dateObj.getTime())
          ? dateObj.toISOString().split("T")[0]
          : null;

      const matchesFromDate =
        !fromDate || (logDateOnly && logDateOnly >= fromDate);

      const matchesToDate =
        !toDate || (logDateOnly && logDateOnly <= toDate);

      return (
        matchesSearch &&
        matchesAction &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [logs, searchQuery, actionFilter, fromDate, toDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#333547] px-6 py-4 flex items-center gap-3">
        <ClipboardList className="text-white" />
        <h1 className="text-white text-xl font-semibold">
          Activity Logs
        </h1>
      </header>

      <main className="p-6">

        <div className="flex flex-wrap gap-4 justify-between mb-6">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="border rounded px-3 py-2 bg-white"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="ADD">Add</option>
            <option value="EDIT">Edit</option>
            <option value="DELETE">Delete</option>
          </select>
        </div>

        <div className="bg-white shadow rounded overflow-hidden">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ClipboardList className="mx-auto mb-4 opacity-50" size={48} />
              <p className="text-lg font-medium">No Logs Found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Admin</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Details</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{log.adminName}</td>
                    <td className="p-3">{log.adminEmail}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-600 font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3">{log.details}</td>
                    <td className="p-3">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
