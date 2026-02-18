/**
 * Admin.jsx
 *
 * Purpose: Admin Dashboard for viewing all student enrollments.
 * Protected by a username and password defined in environment variables.
 *
 * Features:
 * - Login form with environmental credential verification.
 * - Table view of all "en_student" records from Supabase.
 * - Search by student number or name.
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  supabase,
  getAllEnrollments,
  deleteEnrollment,
} from "../services/supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Search,
  LogOut,
  Lock,
  User,
  ShieldCheck,
  RefreshCcw,
  FileSpreadsheet,
  Download,
  Trash2,
} from "lucide-react";

// Admin credentials from .env
const ADMIN_USER = import.meta.env.VITE_ADMIN_USERNAME;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD;

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      setError("");
      localStorage.setItem("admin_auth", "true");
    } else {
      setError("Invalid username or password");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  // Handle Delete
  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${name}? This action cannot be undone.`,
      )
    ) {
      try {
        await deleteEnrollment(id);
        // Optimistic UI update or just refetch
        setStudents(students.filter((s) => s.id !== id));
      } catch (err) {
        alert("Failed to delete record. Please try again.");
      }
    }
  };

  // Persistence for auth
  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllEnrollments();
      setStudents(data);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handle Excel Export
  const handleExportExcel = () => {
    if (students.length === 0) return;

    // Prepare data for Excel
    const exportData = students.map((s) => ({
      "Student Number": s.student_number || "",
      "Full Name": s.name || "",
      Email: s.email || "",
      "Academic Section": s.section || "",
      "Immersion Program":
        s.immersion_program?.replace("-", " ").toUpperCase() || "",
      "Enrollment Date": s.created_at
        ? new Date(s.created_at).toLocaleDateString()
        : "",
      "Enrollment Time": s.created_at
        ? new Date(s.created_at).toLocaleTimeString()
        : "",
    }));

    // Create Worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set Column Widths
    const wscols = [
      { wch: 15 }, // Student Number
      { wch: 30 }, // Full Name
      { wch: 30 }, // Email
      { wch: 20 }, // Academic Section
      { wch: 25 }, // Immersion Program
      { wch: 15 }, // Enrollment Date
      { wch: 15 }, // Enrollment Time
    ];
    worksheet["!cols"] = wscols;

    // Create Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save file
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const fileName = `enrollments_${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(data, fileName);
  };

  // Filtered Data
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.student_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.immersion_program?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  // Render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Admin Access
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Please log in to manage enrollments.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-[#008800] text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] mt-4">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Admin Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
              Enrollment Manager
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Monitoring {students.length} students
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-semibold text-sm transition-colors py-2 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </header>

      {/* Control Bar */}
      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Search by student number, name, or track..."
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            disabled={loading || students.length === 0}
            className="flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 py-2 px-6 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 px-6 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
            <RefreshCcw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Table Container */}
      <main className="flex-1 overflow-auto p-6 scroll-smooth">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Program Track
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Academic Section
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Submission Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {loading && students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCcw className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-slate-400 font-medium">
                          Loading enrollment data...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-slate-500 font-bold text-xl uppercase tracking-widest opacity-20 italic">
                          No Students Found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">
                          {student.student_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {student.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize">
                          {student.immersion_program?.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {student.section}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                          {student.created_at
                            ? new Date(student.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {student.created_at
                            ? new Date(student.created_at).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : ""}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                          title="Delete Record">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
