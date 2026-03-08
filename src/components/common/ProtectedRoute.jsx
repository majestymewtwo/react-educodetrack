import { Navigate } from "react-router";

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payloadBase64 = token.split(".")[1];

    const decodedPayload = JSON.parse(atob(payloadBase64));

    const expirationTime = decodedPayload.exp * 1000;
    const currentTime = Date.now();
    
    return expirationTime > currentTime;
  } catch (error) {
    console.error("Invalid token format", error);
    return false;
  }
};

export default function ProtectedRoute({ type, children }) {
  const tokenName = type === "student" ? "studentToken" : "facultyToken";
  const authToken = localStorage.getItem(tokenName);
  if (!isTokenValid(authToken)) {
    if (authToken) {
      localStorage.removeItem(tokenName);
    }
    return (
      <Navigate to={type === "student" ? "/student" : "/faculty"} replace />
    );
  }

  return (
    <section className="bg-slate-50 w-full h-screen overflow-y-scroll">
      {children}
    </section>
  );
}
