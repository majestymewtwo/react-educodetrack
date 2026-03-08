import { useState, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

const departmentOptions = ['CSE', 'IT', 'MTECH CSE', 'ECE', 'EEE', 'ENI', 'MECH', 'CIVIL', 'AIDS'];
const collegeOptions = ['Sri Sai Ram Engineering College'];

export default function AddStudentModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('single');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    phone_no: '',
    email_id: '',
    passout_year: new Date().getFullYear().toString(),
    department_name: '',
    college_name: 'Sri Sai Ram Engineering College',
  });

  const fileInputRef = useRef(null);
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  // --- SINGLE STUDENT LOGIC ---
  const handleSingleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('facultyToken');
      await axios.post(`${SERVER_URL}/api/faculty/create-student`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Student added successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add student. Please check details.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- BULK UPLOAD LOGIC ---

  // UPDATED: Using ExcelJS to add dropdown validations
  const downloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // Define columns and auto-size widths
    worksheet.columns = [
      { header: 'student_id', key: 'student_id', width: 20 },
      { header: 'first_name', key: 'first_name', width: 20 },
      { header: 'last_name', key: 'last_name', width: 20 },
      { header: 'phone_no', key: 'phone_no', width: 15 },
      { header: 'email_id', key: 'email_id', width: 30 },
      { header: 'passout_year', key: 'passout_year', width: 15 },
      { header: 'department_name', key: 'department_name', width: 25 },
      { header: 'college_name', key: 'college_name', width: 35 },
    ];

    // Add dummy data row
    worksheet.addRow({
      student_id: 'SEC21CJ037',
      first_name: 'Muthu Aanand',
      last_name: 'Su',
      phone_no: '9789027587',
      email_id: 'sec21cj037@sairamtap.edu.in',
      passout_year: '2026',
      department_name: 'M.Tech CSE',
      college_name: 'Sri Sai Ram Engineering College'
    });

    // Apply Data Validation (Dropdowns) to the first 1000 rows
    for (let i = 2; i <= 1000; i++) {
      // Column G is department_name
      worksheet.getCell(`G${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        // Formulae must be passed as an array of strings containing the comma-separated options wrapped in quotes
        formulae: [`"${departmentOptions.join(',')}"`]
      };

      // Column H is college_name
      worksheet.getCell(`H${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${collegeOptions.join(',')}"`]
      };
    }

    // Generate the file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, "Student_Upload_Template.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setError(null);
    setSuccessMsg('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const errors = [];
        const sanitizedData = data.map((row, index) => {
          const rowNum = index + 2;
          
          const cleanRow = {
            student_id: String(row.student_id || '').trim(),
            first_name: String(row.first_name || '').trim(),
            last_name: String(row.last_name || '').trim(),
            phone_no: String(row.phone_no || '').trim(),
            email_id: String(row.email_id || '').trim(),
            passout_year: String(row.passout_year || '').trim(),
            department_name: String(row.department_name || '').trim(),
            college_name: String(row.college_name || '').trim(),
          };

          if (!cleanRow.student_id) errors.push(`Row ${rowNum}: Missing Student ID`);
          if (!cleanRow.email_id) errors.push(`Row ${rowNum}: Missing Email`);
          if (!departmentOptions.includes(cleanRow.department_name)) {
            errors.push(`Row ${rowNum}: Invalid Department. Must be one of: ${departmentOptions.join(', ')}`);
          }
          if (cleanRow.college_name !== collegeOptions[0]) {
            errors.push(`Row ${rowNum}: Invalid College. Must be ${collegeOptions[0]}`);
          }

          return cleanRow;
        });

        if (errors.length > 0) {
          setError(errors);
          setParsedData([]);
        } else {
          setParsedData(sanitizedData);
          setSuccessMsg(`Successfully parsed ${sanitizedData.length} students. Ready to upload.`);
        }
      } catch (err) {
        setError('Failed to read the Excel file. Please ensure you are using the provided template.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkSubmit = async () => {
    if (parsedData.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMsg('');
    const token = localStorage.getItem('facultyToken');

    const uploadPromises = parsedData.map(student => 
      axios.post(`${SERVER_URL}/api/faculty/create-student`, student, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );

    try {
      const results = await Promise.allSettled(uploadPromises);
      
      const fulfilled = results.filter(r => r.status === 'fulfilled');
      const rejected = results.filter(r => r.status === 'rejected');

      if (rejected.length === 0) {
        setSuccessMsg(`All ${fulfilled.length} students uploaded successfully!`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError([
          `Uploaded ${fulfilled.length} successfully. Failed ${rejected.length}.`,
          ...rejected.map((r, i) => `Failure ${i + 1}: ${r.reason.response?.data?.message || 'Unknown error'}`)
        ]);
      }
    } catch (err) {
      setError('A critical error occurred during batch upload.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (label, name, type = 'text') => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input
        type={type} name={name} required value={formData[name]} onChange={handleSingleChange}
        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
      />
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-300 mb-1">{label}</label>
      <select
        name={name} required value={formData[name]} onChange={handleSingleChange}
        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm cursor-pointer"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800 shrink-0">
          <h2 className="text-xl font-bold text-white">Add New Student(s)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-700 bg-gray-800 shrink-0">
          <button
            onClick={() => { setActiveTab('single'); setError(null); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'single' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-750' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Single Entry
          </button>
          <button
            onClick={() => { setActiveTab('bulk'); setError(null); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'bulk' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-750' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Bulk Excel Upload
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {Array.isArray(error) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {error.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              ) : (
                <p>{error}</p>
              )}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400 text-sm text-center font-medium">
              {successMsg}
            </div>
          )}

          {activeTab === 'single' && (
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput('First Name', 'first_name')}
                {renderInput('Last Name', 'last_name')}
                {renderInput('Student ID', 'student_id')}
                {renderInput('Passout Year', 'passout_year')}
                {renderInput('Email Address', 'email_id', 'email')}
                {renderInput('Phone Number', 'phone_no', 'tel')}
                {renderSelect('Department', 'department_name', departmentOptions)}
                {renderSelect('College Name', 'college_name', collegeOptions)}
              </div>
              <button
                type="submit" disabled={isLoading}
                className="w-full py-3 mt-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all disabled:opacity-50 flex justify-center"
              >
                {isLoading ? 'Adding Student...' : 'Add Student'}
              </button>
            </form>
          )}

          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-gray-200 font-medium mb-1">Step 1: Download Template</h3>
                  <p className="text-gray-400 text-sm text-balance">Ensure your data matches the exact headers and valid options before uploading.</p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium border border-gray-600 shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Template.xlsx
                </button>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl space-y-4">
                <div>
                  <h3 className="text-gray-200 font-medium mb-1">Step 2: Upload Data</h3>
                  <p className="text-gray-400 text-sm">Upload your filled `.xlsx` or `.csv` file here.</p>
                </div>
                
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full py-8 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-blue-500 hover:bg-gray-800 transition-all flex flex-col items-center gap-2"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>{fileName ? `Selected: ${fileName}` : 'Click to browse files'}</span>
                </button>
              </div>

              <button
                onClick={handleBulkSubmit}
                disabled={isLoading || parsedData.length === 0}
                className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
              >
                {isLoading ? 'Uploading batch...' : `Upload ${parsedData.length} Students`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}