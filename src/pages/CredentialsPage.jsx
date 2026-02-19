/**
 * CredentialsPage.jsx
 *
 * Purpose: The first step of the enrollment process.
 * Displays the student's pre-filled information and allows verification of credentials.
 *
 * Location: /src/pages/CredentialsPage.jsx
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Hook for navigation
import gsap from "gsap";
import {
  ChevronLeft,
  GraduationCap,
  IdCard,
  Mail,
  User,
  Lock,
  Users,
  Info,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowBigRight,
} from "lucide-react";
import { verifyCredentials } from "../services/studentVerification";
import { checkEnrollmentStatus } from "../services/supabase";

/**
 * CredentialsPage Component
 *
 * @param {Object} props
 * @param {Object} props.enrollment - The global enrollment state containing student profile.
 * @param {Function} props.updateProfile - Function to update student profile data.
 */
const CredentialsPage = ({ enrollment, updateProfile }) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("idle"); // idle, success, error
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false); // Track if popup was already animated
  const popupRef = useRef(null);

  useEffect(() => {
    const { studentNumber, email } = enrollment.profile;

    const verify = async () => {
      if (studentNumber && email) {
        setIsVerifying(true);
        setVerificationStatus("idle");
        try {
          const student = await verifyCredentials(studentNumber, email);
          if (student) {
            updateProfile({
              fullName: student.name,
              section: student.section,
              sectionId: student.section_id, // Store section_id for track filtering
            });
            setVerificationStatus("success");

            // Check if student is already enrolled
            const alreadyEnrolled = await checkEnrollmentStatus(studentNumber);
            setIsAlreadyEnrolled(alreadyEnrolled);
          } else {
            updateProfile({
              fullName: "",
              section: "",
              sectionId: "",
            });
            setVerificationStatus("error");
          }
        } catch (error) {
          console.error("Verification error:", error);
          setVerificationStatus("error");
        } finally {
          setIsVerifying(false);
        }
      } else {
        setVerificationStatus("idle");
        updateProfile({
          fullName: "",
          section: "",
          sectionId: "",
        });
      }
    };

    const timer = setTimeout(verify, 800); // 800ms debounce
    return () => clearTimeout(timer);
  }, [
    enrollment.profile.studentNumber,
    enrollment.profile.email,
    updateProfile,
  ]);

  // Separate useEffect for popup animation (runs only once when isAlreadyEnrolled becomes true)
  useEffect(() => {
    if (isAlreadyEnrolled && popupRef.current && !hasAnimated) {
      gsap.fromTo(
        popupRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
      );
      setHasAnimated(true); // Mark as animated to prevent re-animation
    }
  }, [isAlreadyEnrolled, hasAnimated]);

  return (
    <>
      <header className="py-4 flex items-center justify-center relative shrink-0">
        <h1 className="text-xl font-bold text-center">Student Information</h1>
      </header>

      <div className="px-6 mb-8 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Step 1 of 4
          </span>
          <span className="text-xs font-bold text-primary uppercase">
            Profile Verification
          </span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
          <div className="h-full bg-primary w-1/4 rounded-full"></div>
          <div className="h-full bg-slate-200 dark:bg-slate-800 w-1/4 rounded-full"></div>
          <div className="h-full bg-slate-200 dark:bg-slate-800 w-1/4 rounded-full"></div>
          <div className="h-full bg-slate-200 dark:bg-slate-800 w-1/4 rounded-full"></div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-6 pt-2 pb-32 md:pb-10 custom-scrollbar">
        <form className="space-y-6 max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Student Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <IdCard className="w-5 h-5" />
                </div>
                <input
                  required
                  className="placeholder:text-slate-400 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={enrollment.profile.studentNumber}
                  onChange={(e) =>
                    updateProfile({ studentNumber: e.target.value })
                  }
                  type="number"
                  placeholder="e.g. 00000000015"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Institutional Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  required
                  type="email"
                  className="placeholder:text-slate-400 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={enrollment.profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  placeholder="e.g. sample@feualabang.edu.ph"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2 justify-center">
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-xs font-medium text-slate-500">
                  Verifying records...
                </span>
              </>
            ) : verificationStatus === "success" ? (
              <>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    Profile Verified
                  </span>
                </div>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
              </>
            ) : verificationStatus === "error" ? (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/10 px-3 py-1 rounded-full">
                <XCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  Student Record Not Found
                </span>
              </div>
            ) : (
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Full Name
              </label>
              <div className="relative opacity-60">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800">
                  <User className="w-5 h-5" />
                </div>
                <input
                  className="w-full placeholder:text-slate-400  bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-12 text-black dark:text-slate-400 cursor-not-allowed"
                  readOnly
                  value={enrollment.profile.fullName}
                  placeholder="Auto-filled upon verification"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Section
              </label>
              <div className="relative opacity-60">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-800">
                  <Users className="w-5 h-5" />
                </div>
                <input
                  className="w-full placeholder:text-slate-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-12 text-black dark:text-slate-400 cursor-not-allowed"
                  readOnly
                  value={enrollment.profile.section}
                  placeholder="Auto-filled upon verification"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-800">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Already Enrolled Popup */}
          {isAlreadyEnrolled && (
            <div
              ref={popupRef}
              className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl border-2 border-green-500 flex gap-4 items-start shadow-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-white w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-green-700 dark:text-green-400 mb-1">
                  Already Enrolled!
                </h3>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Great news! You have already successfully enrolled in your
                  immersion program. No further action is required.
                </p>
              </div>
            </div>
          )}

          <div className="bg-accent/10 dark:bg-accent/5 p-4 rounded-xl border border-accent/20 flex gap-3">
            <Info className="text-accent w-5 h-5 shrink-0" />
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Please ensure the auto-filled details are correct. If there is a
              mismatch, please contact sir Mckhy.
            </p>
          </div>
        </form>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 safe-bottom">
        <button
          className="w-full bg-primary hover:bg-[#008800] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          onClick={() => navigate("/step/2")}
          disabled={verificationStatus !== "success" || isAlreadyEnrolled}>
          <span>Confirm Enrollment</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-[0.2em] font-medium">
          Academic Year 2025-2026
        </p>
        {enrollment.profile.studentNumber === "12345" && (
          <div className="flex justify-end mt-1.5 items-center flex-row">
            <button
              className="underline italic text-xs text-slate-400 hover:text-primary"
              onClick={() => navigate("/admin")}>
              admin log in
            </button>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </div>
        )}
      </footer>
    </>
  );
};

export default CredentialsPage;
