import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Logo from '@/components/common/Logo';

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError('');
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/login-faculty`,
        {
          email_id: email,
          password: password,
        }
      );

      if (res.data?.token) {
        localStorage.setItem('facultyToken', res.data.token);
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 font-sans p-4">
      <div className="bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">

        <div className="mb-8 text-center">
          <Logo />
          <p className="text-gray-400 mt-2 text-sm">
            Faculty Portal
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="faculty@university.edu"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

      </div>
    </section>
  );
}