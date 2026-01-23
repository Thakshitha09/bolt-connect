import { create } from "zustand";

export interface Log {
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

  // FETCH logs (latest first)
  fetchLogs: async () => {
    const res = await fetch("http://localhost:5000/logs");
    const data: Log[] = await res.json();

    set({
      logs: data.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      ),
    });
  },

  // ADD log
  addLog: async (log) => {
    await fetch("http://localhost:5000/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });

    const res = await fetch("http://localhost:5000/logs");
    const data: Log[] = await res.json();

    set({
      logs: data.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      ),
    });
  },

  // CLEAR logs
  clearLogs: async () => {
    await fetch("http://localhost:5000/logs", { method: "DELETE" });
    set({ logs: [] });
  },
}));
