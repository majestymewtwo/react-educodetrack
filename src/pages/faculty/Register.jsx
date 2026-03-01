import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router';
import Logo from '@/components/common/Logo';

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

const DEPARTMENTS = ['CSE', 'IT', 'MTECH CSE', 'ECE', 'EEE', 'ENI', 'MECH', 'CIVIL', 'AIDS'];

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    faculty_id: '',
    first_name: '',
    last_name: '',
    phone_no: '',
    email_id: '',
    password: '',
    department_name: '',
    college_name: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/register-faculty`, formData);

      if (res.status === 200 || res.status === 201) {
        setSuccessMsg('Registration successful! Redirecting to login...');
        setFormData({
          faculty_id: '', first_name: '', last_name: '', phone_no: '',
          email_id: '', password: '', department_name: '', college_name: ''
        });
        setTimeout(() => navigate('/faculty/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectClass = "w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-200";

  const renderInput = (label, name, type = 'text', placeholder = '') => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-200"
      />
    </div>
  );

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 font-sans p-4 py-12">
      <div className="bg-gray-800 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-700">
        
        <div className="mb-8 text-center">
          <Logo />
          <p className="text-gray-400 mt-2 text-sm">Faculty Registration</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400 text-sm text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('First Name', 'first_name', 'text', 'Cristiano')}
            {renderInput('Last Name', 'last_name', 'text', 'Ronaldo')}
            {renderInput('Faculty ID', 'faculty_id', 'text', 'SEC21CJ037')}

            {/* Department Select */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-2">Department</label>
              <select
                name="department_name"
                required
                value={formData.department_name}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* College Name Select */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-300 mb-2">College Name</label>
              <select
                name="college_name"
                required
                value={formData.college_name}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="" disabled>Select College</option>
                <option value="Sri Sai Ram Engineering College">Sri Sai Ram Engineering College</option>
              </select>
            </div>

            {renderInput('Phone Number', 'phone_no', 'tel', '9789027587')}
            {renderInput('Email Address', 'email_id', 'email', 'faculty@university.edu')}
            {renderInput('Password', 'password', 'password', '••••••••')}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Register Faculty'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/faculty/login" className="text-blue-500 hover:text-blue-400 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;