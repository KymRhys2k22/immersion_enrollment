/**
 * App.jsx
 *
 * Purpose: The main entry point of the application. Handles routing, global state management,
 * and the overall layout structure.
 *
 * Location: /src/App.jsx
 *
 * Key Features:
 * - HashRouter for client-side routing (compatible with static hosting like GitHub Pages).
 * - Centralized state for enrollment data (student profile, selected track, step).
 * - Layout wrapper with responsive design and dark mode support.
 */

import React, { useState } from "react";
// react-router-dom: Library for routing in React applications.
// HashRouter: Uses the hash portion of the URL (i.e. window.location.hash) to keep your UI in sync with the URL.
// Routes, Route: Components to define the mapping between URLs and components.
// Navigate: Component to redirect the user.
// useNavigate: Hook to programmatically navigate.
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Page Components
import CredentialsPage from "./pages/CredentialsPage"; // Step 1: Verify student details
import TrackSelectionPage from "./pages/TrackSelectionPage"; // Step 2: Choose an immersion track
import ReviewPage from "./pages/ReviewPage"; // Step 3: Review summary
import SuccessPage from "./pages/SuccessPage"; // Step 4: Success confirmation

/**
 * App Component
 *
 * The root component that manages the application state and routing.
 */
const App = () => {
  // Global State: Holds all data related to the student's enrollment process.
  // This state is passed down to child pages as props.
  const [enrollment, setEnrollment] = useState(() => {
    // Initialize state from localStorage if available
    const saved = localStorage.getItem("enrollment");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      profile: {
        studentNumber: "",
        email: "",
        fullName: "",
        section: "",
        sectionId: "", // Track ID from API (e.g., "film-photo")
        enrolledAt: null, // Timestamp when enrollment was completed
      },
      selectedTrackId: "ai", // ID of the track selected by the student
      step: 1, // Current step in the process (visual only)
    };
  });

  // Save to localStorage whenever enrollment changes
  React.useEffect(() => {
    localStorage.setItem("enrollment", JSON.stringify(enrollment));
  }, [enrollment]);

  /**
   * Updates the student profile data in the global state.
   * @param {Object} newProfile - Partial profile object to merge with existing profile.
   */
  const updateProfile = React.useCallback((newProfile) => {
    setEnrollment((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...newProfile },
    }));
  }, []);

  /**
   * Sets the selected immersion track.
   * @param {string} trackId - The ID of the selected track (e.g., 'ai', 'game-design').
   */
  const setTrack = React.useCallback((trackId) => {
    setEnrollment((prev) => ({ ...prev, selectedTrackId: trackId }));
  }, []);

  return (
    <HashRouter>
      <div className="flex justify-center min-h-screen bg-background-light dark:bg-background-dark md:py-8 md:px-4 transition-all duration-300">
        <div className="w-full md:max-w-4xl lg:max-w-6xl bg-white dark:bg-slate-900 min-h-screen md:min-h-[800px] md:h-auto flex flex-col relative shadow-2xl md:rounded-[2rem] overflow-hidden border-slate-100 dark:border-slate-800 md:border">
          {/* Top Decorative Border */}
          <div className="h-1.5 w-full bg-accent shrink-0"></div>

          <Routes>
            <Route path="/" element={<Navigate to="/step/1" replace />} />
            <Route
              path="/step/1"
              element={
                <CredentialsPage
                  enrollment={enrollment}
                  updateProfile={updateProfile}
                />
              }
            />
            <Route
              path="/step/2"
              element={
                <TrackSelectionPage
                  enrollment={enrollment}
                  setTrack={setTrack}
                />
              }
            />
            <Route
              path="/step/3"
              element={
                <ReviewPage
                  enrollment={enrollment}
                  updateProfile={updateProfile}
                />
              }
            />
            <Route
              path="/success"
              element={<SuccessPage enrollment={enrollment} />}
            />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
