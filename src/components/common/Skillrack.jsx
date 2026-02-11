import { useEffect } from "react";

export default function Skillrack({ isVisible, url }) {
  useEffect(() => {
    console.log("Skillrack loaded");
  }, []);

  return (
    <div className={`${isVisible ? "block" : "hidden"}`}>
      <h1>Skillrack : {url}</h1>
    </div>
  );
}
