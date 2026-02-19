import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  FileText,
  Download,
  Info,
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Building,
  UserCheck,
} from "lucide-react";
import generatePDF from "react-to-pdf";
import { TRACKS } from "../constants";

/**
 * SuccessPage Component
 *
 * @param {Object} props
 * @param {Object} props.enrollment - The global enrollment state containing student profile and selected track.
 */
const SuccessPage = ({ enrollment }) => {
  const navigate = useNavigate();
  const targetRef = React.useRef();

  const downloadPDF = async () => {
    if (!targetRef.current) {
      console.error("PDF target element not found");
      return;
    }

    const filename = `Immersion_Enrollment_${(
      enrollment?.profile?.fullName || "Student"
    ).replace(/\s+/g, "_")}.pdf`;

    // FIX: Pass a function that returns the ref.current
    // Added 'canvas' and 'method' options for better reliability
    generatePDF(() => targetRef.current, {
      filename,
      method: "save",
      canvas: {
        useCORS: true,
        logging: false,
      },
      page: {
        margin: 10,
        format: "A4",
      },
    });
  };

  // Find the details of the selected track
  const selectedTrack = TRACKS.find(
    (t) => t.id === enrollment.selectedTrackId,
  ) || { title: "Unspecified Track", hours: 0 };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center text-center w-full z-10  md:py-20">
        <div className="relative mb-8 md:mb-12">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="w-24 h-24 md:w-32 md:h-32 bg-primary text-white rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-primary/40">
            <Check className="w-12 h-12 md:w-16 md:h-16 stroke-3" />
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
                Immersion_Enrollment_Confirmation.pdf
              </p>
            </div>
          </div>
          <button
            onClick={downloadPDF}
            className="w-full bg-accent dark:bg-primary text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg group">
            <Download className="w-5 h-5 group-hover:animate-bounce" />
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

      {/* Hidden PDF content for react-to-pdf */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          background: "white",
        }}>
        <div
          ref={targetRef}
          style={{
            width: "210mm", // Standard A4 Width
            height: "297mm", // Standard A4 Height
            padding: "20mm",
            backgroundColor: "white",
            fontFamily: "Arial, sans-serif",
            color: "#1e293b",
            boxSizing: "border-box", // CRITICAL: Keeps padding inside the 210x297 box
            overflow: "hidden", // CRITICAL: Prevents any overflow from creating page 2
            display: "flex",
            flexDirection: "column",
          }}>
          {/* PDF Header */}
          <div
            style={{
              borderBottom: "3px solid #16a34a",
              paddingBottom: "15px",
              marginBottom: "30px",
            }}>
            <div className="flex flex-row items-center gap-2">
              <img
                style={{ width: "20px", height: "20px" }}
                src="/vite.svg"
                alt="Logo"
              />
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#16a34a",
                  margin: "0 0 5px 0",
                }}>
                Enrollment Confirmation
              </h1>
            </div>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              Academic Year 2025–2026
            </p>
          </div>

          {/* Student Info */}
          <div style={{ marginBottom: "35px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "8px",
                marginBottom: "15px",
              }}>
              Student Information
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}>
              <InfoItem
                label="Full Name"
                value={enrollment?.profile?.fullName}
              />
              <InfoItem
                label="Student Number"
                value={enrollment?.profile?.studentNumber}
              />
              <InfoItem label="Email" value={enrollment?.profile?.email} />
              <InfoItem label="Section" value={enrollment?.profile?.section} />
            </div>
          </div>

          {/* Track Details Card */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}>
              Immersion Placement
            </h2>
            <div style={{ marginBottom: "12px" }}>
              <p
                style={{
                  fontSize: "10px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  margin: "0 0 2px 0",
                }}>
                Assigned Track
              </p>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                {selectedTrack.title}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  margin: "0 0 2px 0",
                }}>
                Required Hours
              </p>
              <p style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                {selectedTrack.hours} Hours
              </p>
            </div>
          </div>

          {/* Spacer pushes footer to the bottom */}
          <div style={{ flexGrow: 1 }}></div>

          {/* PDF Footer */}
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              paddingTop: "15px",
              fontSize: "11px",
              color: "#94a3b8",
            }}>
            <p style={{ margin: "0 0 3px 0" }}>
              Generated on: {new Date().toLocaleString()}
            </p>
            <p style={{ margin: 0 }}>
              This is not official document for school records.
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full  space-y-3 safe-bottom z-10 md:flex md:gap-4 md:space-y-0 md:justify-center md:max-w-2xl">
        <button
          className="w-full mb-4 md:w-auto md:px-12 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95"
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

// Reusable Info Item for PDF
const InfoItem = ({ label, value }) => (
  <div style={{ marginBottom: "12px" }}>
    <p
      style={{
        fontSize: "10px",
        color: "#94a3b8",
        textTransform: "uppercase",
        fontWeight: "bold",
        margin: "0 0 4px 0",
      }}>
      {label}
    </p>
    <p
      style={{
        fontSize: "14px",
        fontWeight: "600",
        color: "#1e293b",
        margin: 0,
      }}>
      {value || "Not Provided"}
    </p>
  </div>
);

export default SuccessPage;
