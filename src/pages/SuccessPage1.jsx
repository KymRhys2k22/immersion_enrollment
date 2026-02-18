import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  FileText,
  Download,
  Info,
  Calendar,
  Building,
  UserCheck,
} from "lucide-react";
import generatePDF from "react-to-pdf";
import { TRACKS } from "../constants";

const SuccessPage = ({ enrollment }) => {
  const navigate = useNavigate();

  // PDF target ref
  const targetRef = React.useRef(null);

  // Download PDF function
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

  // Find selected track
  const selectedTrack = TRACKS.find(
    (t) => t.id === enrollment?.selectedTrackId,
  ) || {
    title: "Unspecified Track",
    hours: 0,
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden bg-slate-50 min-h-screen">
      {/* MAIN VISIBLE CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center text-center w-full z-10 py-12">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center relative z-10 shadow-xl">
            <Check className="w-12 h-12 stroke-[3px]" />
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
          Enrollment Successful!
        </h1>

        <p className="text-slate-500 max-w-md mb-10">
          Your immersion enrollment confirmation is ready for download.
        </p>

        {/* Download Card */}
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md border border-slate-100 mb-8">
          <div className="flex items-center gap-4 mb-6 text-left">
            <div className="p-3 bg-red-50 rounded-lg">
              <FileText className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Summary Report
              </p>
              <p className="text-sm font-semibold text-slate-700">
                Immersion_Confirmation.pdf
              </p>
            </div>
          </div>

          <button
            onClick={downloadPDF}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-green-200">
            <Download className="w-5 h-5" />
            Download Confirmation PDF
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Info className="w-4 h-4" />
          Keep a copy for your school records
        </div>
      </main>

      {/* FOOTER NAVIGATION */}
      <footer className="w-full max-w-md pb-12">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-slate-900 text-white py-3 rounded-xl mb-3 font-medium">
          Go to Dashboard
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50">
          Back to Home
        </button>
      </footer>

      {/* ================= PDF TEMPLATE (HIDDEN FROM VIEW) ================= */}
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
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#16a34a",
                margin: "0 0 5px 0",
              }}>
              Enrollment Confirmation
            </h1>
            <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
              Academic Year 2026–2027
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
              Document ID: ENR-
              {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <p style={{ margin: "0 0 3px 0" }}>
              Generated on: {new Date().toLocaleString()}
            </p>
            <p style={{ margin: 0 }}>
              This is an official document for school records.
            </p>
          </div>
        </div>
      </div>
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
