import { useEffect, useMemo, useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useLogStore } from "../store/logStore";

export default function LogsPage() {
  const { logs, fetchLogs, clearLogs } = useLogStore();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /* ================= DATE + ACTION FILTER ================= */
  const dateFilteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // action filter
      if (actionFilter !== "ALL" && log.action !== actionFilter) {
        return false;
      }

      // date filter
      if (!fromDate && !toDate) return true;

      const logDate = new Date(log.createdAt || "");

      if (fromDate && logDate < new Date(fromDate)) return false;
      if (toDate && logDate > new Date(toDate + "T23:59:59")) return false;

      return true;
    });
  }, [logs, fromDate, toDate, actionFilter]);

  /* ================= 50 / 30 / 20 LOGIC ================= */
  const visibleLogs = useMemo(() => {
    const total = dateFilteredLogs.length;
    if (total === 0) return [];

    const fiftyCount = Math.ceil(total * 0.5);
    const thirtyCount = Math.ceil(total * 0.3);
    const twentyCount = total - fiftyCount - thirtyCount;

    const highPriority = dateFilteredLogs.filter(
      (l) => l.action === "ADD" || l.action === "EDIT"
    );

    const mediumPriority = dateFilteredLogs.filter(
      (l) => l.action === "DELETE"
    );

    const lowPriority = dateFilteredLogs.filter(
      (l) => l.action === "LOGIN" || l.action === "LOGOUT"
    );

    return [
      ...highPriority.slice(0, fiftyCount),
      ...mediumPriority.slice(0, thirtyCount),
      ...lowPriority.slice(0, twentyCount),
    ];
  }, [dateFilteredLogs]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>

      {/* FILTERS */}
      <div className="flex gap-3 mb-4">
        <Input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <Input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        {/* ACTION FILTER */}
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Actions</option>
          <option value="ADD">ADD</option>
          <option value="EDIT">EDIT</option>
          <option value="DELETE">DELETE</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOGOUT">LOGOUT</option>
        </select>

        <Button
          className="bg-red-600 text-white"
          onClick={() => {
            if (window.confirm("Clear all logs?")) {
              clearLogs();
            }
          }}
        >
          Clear Logs
        </Button>
      </div>

      {/* LOGS TABLE */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-3 text-left">Admin</th>
            <th className="p-3">Action</th>
            <th className="p-3">Student</th>
            <th className="p-3">Details</th>
            <th className="p-3">Time</th>
          </tr>
        </thead>

        <tbody>
          {visibleLogs.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No logs available
              </td>
            </tr>
          ) : (
            visibleLogs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-3">{log.adminName}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.studentName || "-"}</td>
                <td className="p-3">{log.details}</td>
                <td className="p-3">
                  {new Date(log.createdAt || "").toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
