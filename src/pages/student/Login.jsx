import axios from "axios";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/api/auth/generate-student-otp`, {
        email_id: email,
      });
      toast.success("OTP sent successfully");
      setOtpSent(true);
    } catch (err) {
      toast.error("An error occured");
      console.log(err);
    }
    setLoading(false);
  };

  const validateOtp = async (otp) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/auth/validate-student-otp`,
        {
          email_id: email,
          otp_code: otp,
        },
      );
      const data = res.data;
      const studentToken = data.token;
      const studentProfile = data.student;

      localStorage.setItem("studentToken", studentToken);
      localStorage.setItem("studentProfile", JSON.stringify(studentProfile));

      toast.success("OTP verified successfully");
      navigate("/student/dashboard");
    } catch (err) {
      toast.error("An error occured");
      console.log(err);
    }
    setLoading(false);
  };

  if (localStorage.getItem("studentToken"))
    return <Navigate to="/student/dashboard" />;

  return (
    <section className="h-screen w-screen p-4 flex items-center justify-center bg-amber-400">
      <div className="w-full md:w-1/3 p-4 space-y-6 flex flex-col items-center border border-gray-300 shadow-xl rounded-lg bg-white">
        <div className="gap-1">
          <img src="/student.png" alt="EduCodeTrack" className="size-24 ml-4" />
          <h1 className="font-semibold text-xl">EduCodeTrack</h1>
        </div>
        <p className="text-center italic">
          Track progress. Compare performance. <br /> Improve continuously.
        </p>
        {otpSent ? (
          <ValidateOtp
            email={email}
            validateOtp={validateOtp}
            loading={loading}
          />
        ) : (
          <SendOtp
            handleChange={handleChange}
            sendOTP={sendOTP}
            loading={loading}
          />
        )}
      </div>
    </section>
  );
}

function SendOtp({ handleChange, sendOTP, loading }) {
  return (
    <>
      <p>Enter your registered email to receive an OTP</p>
      <input
        type="text"
        onChange={handleChange}
        placeholder="Enter your Email"
        className="w-full p-2 border border-gray-300 rounded-sm focus:border-amber-500 focus:outline-none"
      />
      <button
        disabled={loading}
        onClick={sendOTP}
        className="w-full p-2 border border-gray-300 rounded-sm text-white bg-amber-500 cursor-pointer font-semibold focus:bg-amber-600"
      >
        {loading ? (
          <img src="/loading.gif" alt="loading" className="size-7 mx-auto" />
        ) : (
          "Get OTP"
        )}
      </button>
    </>
  );
}

function ValidateOtp({ email, validateOtp, loading }) {
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = () => {
    validateOtp(otpCode);
  };

  return (
    <>
      <div className="text-center">
        <h1>OTP has been successfully sent to </h1>
        <p className="font-semibold">{email}</p>
      </div>
      <OTPInput
        value={otpCode}
        onChange={setOtpCode}
        numInputs={6}
        containerStyle={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          gap: "6px",
        }}
        inputStyle={{
          width: "48px",
          height: "48px",
          fontSize: "18px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          textAlign: "center",
        }}
        renderInput={(props) => <input {...props} />}
      />
      <button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full p-2 border border-gray-300 rounded-sm text-white bg-amber-500 cursor-pointer font-semibold focus:bg-amber-600"
      >
        {loading ? (
          <img src="/loading.gif" alt="loading" className="size-7 mx-auto" />
        ) : (
          "Submit"
        )}
      </button>
    </>
  );
}
