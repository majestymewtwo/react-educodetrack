import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

export default function Leaderboard() {
  // Generate 5 passout years starting from the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // State Management
  const [activeYear, setActiveYear] = useState(years[0]); // Default to current year
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data whenever the active year changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError('');
      setLeaderboard([]);
      
      try {
        const token = localStorage.getItem('facultyToken');
        const res = await axios.get(
          `${SERVER_URL}/api/faculty/student-leaderboard/${activeYear}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // The backend should already return this sorted, but we ensure it's an array
        setLeaderboard(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leaderboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeYear]);

  // Filter logic based on the search query
  const filteredLeaderboard = leaderboard.filter((student) => {
    if (!searchQuery.trim()) return true;
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           student.student_id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Helper to style the Top 3 ranks
  const getRankStyle = (index) => {
    switch (index) {
      case 0: return 'text-yellow-400 font-bold bg-yellow-500/10 border-yellow-500/20'; // Gold
      case 1: return 'text-gray-300 font-bold bg-gray-500/10 border-gray-500/20';       // Silver
      case 2: return 'text-amber-600 font-bold bg-amber-500/10 border-amber-500/20';   // Bronze
      default: return 'text-gray-400 font-medium border-transparent';
    }
  };

  return (
    <div className="bg-gray-900 min-h-full text-gray-200">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Leaderboard</h1>
          <p className="text-sm text-gray-400 mt-1">Global ranking based on coding platform activity & ratings.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
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
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
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
      <div className="p-6">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        {!isLoading && !error && filteredLeaderboard.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-400">No students found for this criteria.</p>
          </div>
        )}

        {/* Leaderboard Table */}
        {!isLoading && !error && filteredLeaderboard.length > 0 && (
          <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-gray-400 border-b border-gray-700 bg-gray-900/50">
                <tr>
                  <th className="py-4 px-6 font-medium w-20 text-center">Rank</th>
                  <th className="py-4 px-6 font-medium">Student Info</th>
                  <th className="py-4 px-6 font-medium">Department</th>
                  <th className="py-4 px-6 font-medium text-center">Active Platforms</th>
                  <th className="py-4 px-6 font-medium text-right">Total Score</th>
                  <th className="py-4 px-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredLeaderboard.map((student, index) => (
                  <tr key={student._id} className="hover:bg-gray-750 transition-colors group">
                    
                    {/* Rank */}
                    <td className="py-4 px-6 text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${getRankStyle(index)}`}>
                        {index + 1}
                      </div>
                    </td>

                    {/* Student Info */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-200 text-base">
                          {student.first_name} {student.last_name}
                        </span>
                        <span className="text-gray-500 text-xs mt-0.5">{student.student_id}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-6 text-gray-400">
                      {student.department_name}
                    </td>

                    {/* Active Platforms */}
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium border border-gray-600">
                        {student.platforms_active || 0} / 4
                      </span>
                    </td>

                    {/* Total Score */}
                    <td className="py-4 px-6 text-right">
                      <span className="font-bold text-blue-400 text-lg">
                        {student.total_score}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <Link 
                        to={`/faculty/profile/${student.student_id}`} 
                        state={student} 
                        className="text-blue-500 hover:text-blue-400 font-medium hover:underline text-sm opacity-0 group-hover:opacity-100 transition-opacity"
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
    </div>
  );
}