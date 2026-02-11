import { useEffect } from "react";

export default function Geeksforgeeks({ isVisible, username }) {
  useEffect(() => {
    console.log("Geeksforgeeks loaded");
  }, []);

  return (
    <div className={`${isVisible ? "block" : "hidden"}`}>
      <h1>Geeksforgeeks : {username}</h1>
    </div>
  );
}
