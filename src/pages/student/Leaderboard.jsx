import { useState, useEffect } from 'react';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data once when the component mounts
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError('');
      setLeaderboard([]);
      
      try {
        const token = localStorage.getItem('studentToken');
        
        // Hitting the updated endpoint that uses req.user
        const res = await axios.get(
          `${SERVER_URL}/api/student/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setLeaderboard(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leaderboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Filter logic based on the search query
  const filteredLeaderboard = leaderboard.filter((student) => {
    if (!searchQuery.trim()) return true;
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           student.student_id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Helper to style the Top 3 ranks for the light theme
  const getRankStyle = (index) => {
    switch (index) {
      case 0: return 'text-amber-600 font-bold bg-amber-100 border-amber-300 shadow-sm'; // Gold
      case 1: return 'text-slate-600 font-bold bg-slate-100 border-slate-300 shadow-sm'; // Silver
      case 2: return 'text-orange-600 font-bold bg-orange-100 border-orange-300 shadow-sm'; // Bronze
      default: return 'text-slate-500 font-medium border-slate-200 bg-white';
    }
  };

  return (
    <section className="bg-slate-50 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-md border border-slate-300 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Batch Leaderboard</h1>
            <p className="text-sm text-slate-500 mt-1">See how you rank among your peers.</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-md bg-white border border-slate-300 text-slate-700 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-slate-300 shadow-lg rounded-md overflow-hidden">
          
          <div className="p-0 sm:p-4">
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <svg className="animate-spin h-10 w-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="m-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredLeaderboard.length === 0 && (
              <div className="text-center py-16 m-4 border-2 border-dashed border-slate-200 rounded-md">
                <p className="text-slate-500 text-lg">No students found for this criteria.</p>
              </div>
            )}

            {/* Leaderboard Table */}
            {!isLoading && !error && filteredLeaderboard.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="text-slate-500 border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="py-4 px-6 font-semibold w-20 text-center">Rank</th>
                      <th className="py-4 px-6 font-semibold">Student Info</th>
                      <th className="py-4 px-6 font-semibold">Department</th>
                      <th className="py-4 px-6 font-semibold text-center">Active Platforms</th>
                      <th className="py-4 px-6 font-semibold text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeaderboard.map((student, index) => (
                      <tr key={student._id} className="hover:bg-amber-50/30 transition-colors">
                        
                        {/* Rank */}
                        <td className="py-4 px-6 text-center">
                          <div className={`inline-flex items-center justify-center w-9 h-9 rounded-full border ${getRankStyle(index)}`}>
                            {index + 1}
                          </div>
                        </td>

                        {/* Student Info */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-base">
                              {student.first_name} {student.last_name}
                            </span>
                            <span className="text-slate-500 text-xs mt-0.5 font-medium tracking-wide">
                              {student.student_id}
                            </span>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {student.department_name}
                        </td>

                        {/* Active Platforms */}
                        <td className="py-4 px-6 text-center">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                            {student.platforms_active || 0} / 4
                          </span>
                        </td>

                        {/* Total Score */}
                        <td className="py-4 px-6 text-right">
                          <span className="font-extrabold text-amber-600 text-lg">
                            {student.total_score}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}