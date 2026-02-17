/**
 * TrackSelectionPage.jsx
 *
 * Purpose: The second step of the enrollment process.
 * Displays a list of available immersion tracks for the student to choose from.
 *
 * Location: /src/pages/TrackSelectionPage.jsx
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, CheckCircle, Users } from "lucide-react";
import { TRACKS } from "../constants"; // Array of available immersion tracks
import { getTrackEnrollmentCounts } from "../services/supabase";

/**
 * TrackSelectionPage Component
 *
 * @param {Object} props
 * @param {Object} props.enrollment - The global enrollment state.
 * @param {Function} props.setTrack - Function to set the selected track ID.
 */
const TrackSelectionPage = ({ enrollment, setTrack }) => {
  const navigate = useNavigate();
  const [trackCounts, setTrackCounts] = useState({}); // Stores enrollment counts per track
  const [isLoading, setIsLoading] = useState(true);
  const MAX_CAPACITY = 40;

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      const counts = await getTrackEnrollmentCounts();
      setTrackCounts(counts);
      setIsLoading(false);
    };
    fetchCounts();
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 z-50 shadow-lg">
        <header className="px-6 py-4 flex items-center relative shrink-0">
          <button
            className="w-10 h-10 flex items-center justify-start text-slate-600 dark:text-slate-300"
            onClick={() => navigate("/step/1")}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center pr-10">
            Choose Immersion Track
          </h1>
        </header>

        <div className="px-6 mb-8 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Step 2 of 4
            </span>
            <span className="text-xs font-bold text-primary uppercase">
              Track Selection
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
            <div className="h-full bg-primary/40 w-1/4 rounded-full"></div>
            <div className="h-full bg-primary w-1/4 rounded-full"></div>
            <div className="h-full bg-slate-200 dark:bg-slate-800 w-1/4 rounded-full"></div>
            <div className="h-full bg-slate-200 dark:bg-slate-800 w-1/4 rounded-full"></div>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-6 px-6   py-4 overflow-y-auto custom-scrollbar pt-36">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-32 md:pb-24 max-w-6xl mx-auto">
          {TRACKS.filter((track) => {
            // Filter out the track if the student's section_id matches the track id
            // Example: if section_id is "film-photo", remove the "film-photo" track card
            return track.id !== enrollment.profile.sectionId;
          }).map((track) => {
            const isSelected = enrollment.selectedTrackId === track.id;
            const IconComponent = track.icon;
            const enrollmentCount = trackCounts[track.id] || 0;
            const isFull = enrollmentCount >= MAX_CAPACITY;
            const isDisabled = isFull;

            return (
              <div
                key={track.id}
                onClick={() => !isDisabled && setTrack(track.id)}
                className={`group p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                    : isSelected
                      ? "cursor-pointer bg-primary/5 border-primary shadow-lg shadow-primary/10"
                      : "cursor-pointer bg-white shadow-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-md"
                }`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors shrink-0 ${
                      isDisabled
                        ? "bg-slate-200 dark:bg-slate-700 text-slate-400"
                        : isSelected
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                    }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className={`font-bold text-base ${
                          isDisabled
                            ? "text-slate-400 dark:text-slate-500"
                            : isSelected
                              ? "text-primary"
                              : "text-slate-900 dark:text-white group-hover:text-primary"
                        }`}>
                        {track.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {!isLoading && (
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                              isFull
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : enrollmentCount >= 30
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            }`}>
                            <Users className="w-3 h-3" />
                            <span>
                              {enrollmentCount}/{MAX_CAPACITY}
                            </span>
                          </div>
                        )}
                        {isSelected && !isDisabled && (
                          <CheckCircle className="text-primary w-5 h-5 shrink-0" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 z-40 safe-bottom md:static md:bg-none md:border-t md:border-slate-100 md:dark:border-slate-800 md:order-last">
        <button
          className="w-full md:w-auto md:px-8 bg-primary hover:bg-[#008800] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          disabled={!enrollment.selectedTrackId}
          onClick={() => navigate("/step/3")}>
          <span>Next</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default TrackSelectionPage;
