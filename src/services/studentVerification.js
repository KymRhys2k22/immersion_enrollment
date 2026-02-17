/**
 * studentVerification.js
 *
 * Service to handle student verification against the OpenSheet API.
 */

const API_URL =
  "https://opensheet.elk.sh/1pbv6_9rWC8ldhlZoUkxyB3KY-6nwaNh0HLFzncsvCBI/students";

let studentsCache = null;

/**
 * Fetches the list of students from the API.
 * Uses a simple in-memory cache to avoid redundant network requests.
 *
 * @returns {Promise<Array>} Array of student objects.
 */
export const fetchStudents = async () => {
  if (studentsCache) {
    return studentsCache;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }
    const data = await response.json();
    studentsCache = data;
    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

/**
 * Verifies if a student exists with the given student number and email.
 *
 * @param {string} studentNumber
 * @param {string} email
 * @returns {Promise<Object|null>} The student object if found, otherwise null.
 */
export const verifyCredentials = async (studentNumber, email) => {
  if (!studentNumber || !email) {
    return null;
  }

  try {
    const students = await fetchStudents();

    // Normalize inputs for comparison
    const normalizedStudentNumber = studentNumber.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const student = students.find(
      (s) =>
        s.student_number === normalizedStudentNumber &&
        s.email_address.toLowerCase() === normalizedEmail,
    );

    return student || null;
  } catch (error) {
    console.error("Verification failed:", error);
    return null;
  }
};
