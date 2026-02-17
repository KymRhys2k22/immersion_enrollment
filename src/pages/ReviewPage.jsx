/**
 * ReviewPage.jsx
 *
 * Purpose: The third step of the enrollment process.
 * Displays a summary of the student's details and selected track before submission.
 *
 * Location: /src/pages/ReviewPage.jsx
 */

import { toPng } from "html-to-image";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TRACKS } from "../constants";
import { submitEnrollment } from "../services/supabase"; // Service to handle data submission
import { ChevronLeft, Edit2, Star, Check, Send, Download } from "lucide-react";

/**
 * ReviewPage Component
 *
 * @param {Object} props
 * @param {Object} props.enrollment - The global enrollment state to display.
 */
const ReviewPage = ({ enrollment, updateProfile }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const selectedTrack = TRACKS.find((t) => t.id === enrollment.selectedTrackId);
  const cardRef = useRef(null);

  // Set enrollment timestamp when page loads (if not already set)
  useEffect(() => {
    if (!enrollment.profile.enrolledAt) {
      updateProfile({ enrolledAt: new Date().toISOString() });
    }
  }, []);

  const handleSubmit = async () => {
    if (!isVerified) return;

    setIsSubmitting(true);
    try {
      const result = await submitEnrollment(enrollment);
      console.log("Enrollment submitted successfully:", result);
      navigate("/success");
    } catch (error) {
      console.error("Failed to submit enrollment:", error);
      alert("Failed to submit enrollment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCard = useCallback(() => {
    if (cardRef.current === null) {
      return;
    }

    toPng(cardRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `immersion-track-${selectedTrack?.id || "card"}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Failed to generate image", err);
      });
  }, [selectedTrack]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 z-50 shadow-lg">
        <header className="px-6 py-4 flex items-center relative shrink-0">
          <button
            className="w-10 h-10 flex items-center justify-start text-slate-600 dark:text-slate-300"
            onClick={() => navigate("/step/2")}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center pr-10">
            Review and Submit
          </h1>
        </header>

        <div className="px-6 mb-8 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Step 3 of 4
            </span>
            <span className="text-xs font-bold text-primary uppercase">
              Final Review
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
            <div className="h-full bg-primary/40 w-1/4 rounded-full"></div>
            <div className="h-full bg-primary/40 w-1/4 rounded-full"></div>
            <div className="h-full bg-primary w-1/4 rounded-full"></div>
            <div className="h-full bg-slate-200 dark:bg-slate-800 w-1/4 rounded-full"></div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-6 pb-40 pt-36 md:pb-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Student Details
                </h2>
                <button
                  className="text-primary text-xs font-semibold flex items-center gap-1"
                  onClick={() => navigate("/step/1")}>
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                {[
                  {
                    label: "Student Number",
                    value: enrollment.profile.studentNumber,
                  },
                  { label: "Full Name", value: enrollment.profile.fullName },
                  {
                    label: "University Email",
                    value: enrollment.profile.email,
                  },
                  {
                    label: "Academic Section",
                    value: enrollment.profile.section,
                  },
                  {
                    label: "Immersion Program",
                    value: selectedTrack.title,
                  },
                  {
                    label: "Enrollment Date",
                    value: enrollment.profile.enrolledAt
                      ? new Date(
                          enrollment.profile.enrolledAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not set",
                  },
                  {
                    label: "Enrollment Time",
                    value: enrollment.profile.enrolledAt
                      ? new Date(
                          enrollment.profile.enrolledAt,
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Not set",
                  },
                ].map((item, idx, arr) => (
                  <React.Fragment key={item.label}>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                        {item.label}
                      </span>
                      <span className="text-base font-medium">
                        {item.value}
                      </span>
                    </div>
                    {idx !== arr.length - 1 && (
                      <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Chosen Immersion Track
                </h2>
                <span className="text-xs text-red-500 animate-bounce italic flex items-center gap-1">
                  <Download className="w-3 h-3" /> Click card to save
                </span>
              </div>
              {selectedTrack && (
                <div
                  ref={cardRef}
                  onClick={handleDownloadCard}
                  className="bg-cover bg-center rounded-2xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden text-white h-full min-h-[200px] flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group border-primary ring-4 ring-primary/5"
                  style={{ backgroundImage: "url(/bg_card.webp)" }}>
                  <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 group-hover:bg-white/80 dark:group-hover:bg-slate-900/90 transition-colors backdrop-blur-[2px]" />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-14 h-14 bg-accent/75 rounded-xl flex items-center justify-center shrink-0">
                      <selectedTrack.icon className="text-black w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-900 dark:text-white/80 uppercase font-bold tracking-widest mb-1">
                        Immersion Program
                      </p>
                      <h3 className="text-slate-900 dark:text-white font-bold text-xl leading-tight mb-3">
                        {selectedTrack.title}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-slate-900 dark:text-white/80 font-medium">
                          {enrollment.profile.studentNumber}
                        </p>
                        <p className="text-xs text-slate-900 dark:text-white/80 font-medium">
                          {enrollment.profile.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-900/10 dark:border-white/20 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <Star className="text-accent w-3 h-3 fill-current" />
                      <span className="text-[11px] text-slate-800 dark:text-white/90 font-medium">
                        {selectedTrack.isCertified
                          ? "Certified Training"
                          : "Immersion Ready"}
                      </span>
                    </div>
                    <span className="text-[11px] bg-white/20 text-slate-900 dark:text-white px-2 py-1 rounded-full font-bold">
                      {selectedTrack.hours} Hours
                    </span>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div
            className="flex gap-3 px-2 max-w-2xl mx-auto cursor-pointer"
            onClick={() => setIsVerified(!isVerified)}>
            <div className="mt-1">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isVerified
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600 bg-transparent"
                }`}>
                {isVerified && (
                  <Check className="text-white w-3 h-3 stroke-4" />
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed select-none">
              I verify that all information provided is accurate. I understand
              that my enrollment is subject to approval by the immersion
              coordinator.
            </p>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900/80 backdrop-blur-lg p-6 border-t border-slate-100 dark:border-slate-800 space-y-3 safe-bottom z-50 md:static md:bg-transparent md:border-t-0 md:flex md:flex-row-reverse md:gap-4 md:items-center md:max-w-5xl md:mx-auto md:w-full">
        <button
          className="w-full md:w-auto md:px-8 bg-primary hover:bg-[#008800] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isSubmitting || !isVerified}>
          {isSubmitting ? "Submitting..." : "Submit Enrollment"}
          <Send className="w-4 h-4" />
        </button>
        <button
          className="w-full md:w-auto md:px-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold py-3 rounded-xl transition-all"
          onClick={() => navigate("/step/2")}
          disabled={isSubmitting}>
          Back to Edit
        </button>
      </footer>
    </>
  );
};

export default ReviewPage;
