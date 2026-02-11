import { useEffect } from "react";

export default function Leetcode({ isVisible, username }) {
  useEffect(() => {
    console.log("Leetcode loaded");
  }, []);

  return (
    <div className={`${isVisible ? "block" : "hidden"}`}>
      <h1>Leetcode : {username}</h1>
    </div>
  );
}
