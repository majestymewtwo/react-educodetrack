import { useEffect } from "react";

export default function Codechef({ isVisible, username }) {
  useEffect(() => {
    console.log("Codechef loaded");
  }, []);

  return (
    <div className={`${isVisible ? "block" : "hidden"}`}>
      <h1>Codechef : {username}</h1>
    </div>
  );
}
