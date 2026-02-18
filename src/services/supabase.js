import { createClient } from "@supabase/supabase-js";

// These would normally come from process.env, but for this demo, we assume they exist if needed.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if student is already enrolled in the database
export const checkEnrollmentStatus = async (studentNumber) => {
  try {
    const { data, error } = await supabase
      .from("en_student")
      .select("*")
      .eq("student_number", studentNumber)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new students
      console.error("Error checking enrollment:", error);
      throw error;
    }

    return data ? true : false; // Returns true if already enrolled
  } catch (error) {
    console.error("Error in checkEnrollmentStatus:", error);
    return false;
  }
};

export const submitEnrollment = async (enrollment) => {
  try {
    // Map enrollment data to match database schema
    const enrollmentRecord = {
      student_number: enrollment.profile.studentNumber,
      name: enrollment.profile.fullName,
      email: enrollment.profile.email,
      section: enrollment.profile.section,
      immersion_program: enrollment.selectedTrackId,
    };

    console.log("Inserting to Supabase en_student table:", enrollmentRecord);

    const { data, error } = await supabase
      .from("en_student")
      .insert([enrollmentRecord])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Successfully inserted:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error submitting enrollment:", error);
    throw error;
  }
};

// Get enrollment counts for each immersion program
export const getTrackEnrollmentCounts = async () => {
  try {
    const { data, error } = await supabase
      .from("en_student")
      .select("immersion_program");

    if (error) {
      console.error("Error fetching enrollment counts:", error);
      throw error;
    }

    // Count occurrences of each immersion_program
    const counts = {};
    data.forEach((record) => {
      const trackId = record.immersion_program;
      counts[trackId] = (counts[trackId] || 0) + 1;
    });

    return counts; // Returns object like { "ai": 15, "game-design": 22, ... }
  } catch (error) {
    console.error("Error in getTrackEnrollmentCounts:", error);
    return {};
  }
};

/**
 * Fetches all student enrollment records from the database.
 * @returns {Promise<Array>} List of enrollment objects.
 */
export const getAllEnrollments = async () => {
  try {
    const { data, error } = await supabase
      .from("en_student")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all enrollments:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getAllEnrollments:", error);
    throw error;
  }
};
/**
 * Deletes a student enrollment record from the database.
 * @param {string|number} id - The unique ID of the record to delete.
 */
export const deleteEnrollment = async (id) => {
  try {
    const { error } = await supabase.from("en_student").delete().eq("id", id);

    if (error) {
      console.error("Error deleting enrollment:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteEnrollment:", error);
    throw error;
  }
};
