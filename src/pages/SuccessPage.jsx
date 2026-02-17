/**
 * SuccessPage.jsx
 *
 * Purpose: The final step of the enrollment process.
 * Confirms successful submission and provides a mock PDF download.
 *
 * Location: /src/pages/SuccessPage.jsx
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Check, FileText, Download, Info, LayoutDashboard } from "lucide-react";

/**
 * SuccessPage Component
 *
 * @param {Object} props
 * @param {Object} props.enrollment - The global enrollment state (unused here but available).
 */
const SuccessPage = ({ enrollment }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center text-center w-full z-10 py-12 md:py-20">
        <div className="relative mb-8 md:mb-12">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="w-24 h-24 md:w-32 md:h-32 bg-primary text-white rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-primary/40">
            <Check className="w-12 h-12 md:w-16 md:h-16 stroke-[3]" />
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full animate-bounce"></div>
          <div className="absolute bottom-2 -left-3 w-3 h-3 bg-accent rounded-full animate-bounce delay-150"></div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-slate-900 dark:text-white">
          Enrollment Successful!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs md:max-w-md mx-auto mb-10 md:mb-14 text-sm md:text-base">
          Thank you for enrolling in your work immersion. A confirmation email
          with your details has been sent to your inbox.
        </p>

        <div className="w-full max-w-md bg-white dark:bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-6 text-left">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Summary Report
              </p>
              <p className="text-sm font-semibold truncate">
                Immersion_Enrollment_2024.pdf
              </p>
            </div>
          </div>
          <button className="w-full bg-accent dark:bg-primary text-slate-900 dark:text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg hover:bg-slate-800 dark:hover:bg-primary/90">
            <Download className="w-5 h-5" />
            Download Confirmation PDF
          </button>
        </div>

        <div className="flex items-center gap-2 text-accent">
          <Info className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">
            Keep a copy for your records
          </span>
        </div>
      </main>

      <footer className="w-full p-6 space-y-3 safe-bottom z-10 md:flex md:gap-4 md:space-y-0 md:justify-center md:max-w-2xl">
        <button
          className="w-full md:w-auto md:px-12 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          onClick={() => navigate("/step/1")}>
          Go to Dashboard
          <LayoutDashboard className="w-4 h-4" />
        </button>
        <button
          className="w-full md:w-auto md:px-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold py-3 rounded-xl transition-all"
          onClick={() => navigate("/step/1")}>
          Back to Home
        </button>
      </footer>

      {/* Decorative Blobs */}
      <div className="absolute top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full z-0"></div>
      <div className="absolute bottom-40 -left-20 w-48 h-48 bg-accent/5 rounded-full z-0"></div>
    </div>
  );
};

export default SuccessPage;
