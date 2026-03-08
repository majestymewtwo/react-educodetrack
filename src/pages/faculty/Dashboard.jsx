import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import AddStudentModal from "@/components/faculty/AddStudent";

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

export default function Dashboard() {
  // Generate 5 years for the tabs (e.g., 2024 to 2028)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // State Management
  const [activeYear, setActiveYear] = useState(years[0]); // Default to current year
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Track which departments are expanded: { "M.Tech CSE": true, "IT": false }
  const [expandedDepts, setExpandedDepts] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch data whenever the active year changes
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError("");
      setData({});
      setExpandedDepts({}); // Reset accordions on tab change

      try {
        const token = localStorage.getItem("facultyToken");
        const res = await axios.get(
          `${SERVER_URL}/api/faculty/college-stats/${activeYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Assuming standard Bearer token format
            },
          },
        );
        setData(res.data || {});
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch student data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [activeYear]);

  // Handle Accordion Toggle
  const toggleAccordion = (dept) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [dept]: !prev[dept],
    }));
  };

  // Filter logic based on the search query
  const getFilteredData = () => {
    if (!searchQuery.trim()) return data;

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = {};

    Object.keys(data).forEach((dept) => {
      const matchingStudents = data[dept].filter((student) => {
        const fullName =
          `${student.first_name} ${student.last_name}`.toLowerCase();
        return fullName.includes(lowerQuery);
      });

      // Only include the department if it has matching students
      if (matchingStudents.length > 0) {
        filtered[dept] = matchingStudents;
      }
    });

    return filtered;
  };

  const displayData = getFilteredData();
  const departmentNames = Object.keys(displayData);

  return (
    <div className="bg-gray-900 min-h-full text-gray-200 mx-auto">
      {/* Header & Search */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => setActiveYear(activeYear)}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">College Statistics</h1>
          <p className="text-sm text-gray-400 mt-1">
            View student data by department and passout year.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Add Student Modal */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            + Add Student
          </button>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs for Passout Years */}
      <div className="flex overflow-x-auto border-b border-gray-800 hide-scrollbar px-6">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap relative ${
              activeYear === year
                ? "text-blue-500"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            {year} Batch
            {activeYear === year && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && departmentNames.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-400">
              No students found for the selected criteria.
            </p>
          </div>
        )}

        {/* Accordion List */}
        {!isLoading &&
          !error &&
          departmentNames.map((dept) => (
            <div
              key={dept}
              className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(dept)}
                className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg text-white">
                    {dept}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                    {displayData[dept].length} Students
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedDepts[dept] ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Accordion Body (Student Table) */}
              {expandedDepts[dept] && (
                <div className="border-t border-gray-700 bg-gray-900/50 p-4 overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="text-gray-400 border-b border-gray-700">
                      <tr>
                        <th className="pb-3 px-4 font-medium">Student Name</th>
                        <th className="pb-3 px-4 font-medium">Register No</th>
                        <th className="pb-3 px-4 font-medium">Email</th>
                        <th className="pb-3 px-4 font-medium">Phone</th>
                        <th className="pb-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {displayData[dept].map((student) => (
                        <tr
                          key={student._id}
                          className="hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-gray-200">
                            {student.first_name} {student.last_name}
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {student.student_id}
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {student.email_id}
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {student.phone_no}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                student.is_placed
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              }`}
                            >
                              {student.is_placed ? "Placed" : "Not Placed"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              to={`/faculty/profile/${student.student_id}`}
                              state={student}
                              className="text-blue-400 hover:text-blue-300 font-medium hover:underline text-sm"
                            >
                              View Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
