import { create } from "zustand";

export interface Log {
  timestamp: string | number | Date;
  id?: number;
  adminName: string;
  adminEmail?: string;
  action: string;
  studentName?: string;
  studentId?: number | string;
  details: string;
  createdAt?: string;
}

interface LogStore {
  logs: Log[];
  setLogs: (logs: Log[]) => void;
  fetchLogs: () => Promise<void>;
  addLog: (log: Log) => Promise<void>;
  clearLogs: () => Promise<void>;
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],

  setLogs: (logs) => set({ logs }),

  // FETCH logs
  fetchLogs: async () => {
    try {
      const res = await fetch("http://localhost:5000/logs");
      const data: Log[] = await res.json();

      set({
        logs: data.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        ),
      });
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  },

  // ADD log
  addLog: async (log) => {
    try {
      await fetch("http://localhost:5000/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });

      // Re-fetch after adding
      const res = await fetch("http://localhost:5000/logs");
      const data: Log[] = await res.json();

      set({
        logs: data.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        ),
      });
    } catch (error) {
      console.error("Failed to add log:", error);
    }
  },

  // CLEAR logs
  clearLogs: async () => {
    try {
      await fetch("http://localhost:5000/logs", {
        method: "DELETE",
      });
      set({ logs: [] });
    } catch (error) {
      console.error("Failed to clear logs:", error);
    }
  },
}));
