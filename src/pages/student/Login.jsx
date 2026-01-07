export default function Login() {
  const sendOTP = async (e) => {
    e.preventDefault();
  };

  return (
    <section className="h-screen w-screen p-4 flex items-center justify-center bg-amber-400">
      <form
        onSubmit={sendOTP}
        className="w-full md:w-1/3 p-4 space-y-4 flex flex-col items-center border border-gray-300 shadow-xl rounded-lg bg-white"
      >
        <h1 className="font-semibold text-xl">EduCodeTrack</h1>
        <input
          type="text"
          placeholder="Enter your Email"
          className="w-full p-2 border border-gray-300 rounded-sm focus:border-amber-500 focus:outline-none"
        />
        <button className="w-full p-2 border border-gray-300 rounded-sm text-white bg-amber-500 cursor-pointer font-semibold focus:bg-amber-600">
          Get OTP
        </button>
      </form>
    </section>
  );
}
