import { NavLink, Outlet, useNavigate } from 'react-router';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('facultyToken');
    navigate('/faculty/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-600/10 text-blue-500 border border-blue-500/50'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen sticky top-0">
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Faculty<span className="text-blue-500">Portal</span>
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <NavLink to="/faculty/dashboard" end className={navLinkClasses}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NavLink>

        {/* Leaderboard */}
        <NavLink to="/faculty/leaderboard" className={navLinkClasses}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Leaderboard
        </NavLink>
      </nav>

      {/* Sidebar Footer / Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-900 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}