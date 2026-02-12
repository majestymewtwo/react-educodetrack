import { useState } from "react";
import Leetcode from "./Leetcode";
import Codechef from "./Codechef";
import Geeksforgeeks from "./Geeksforgeeks";
import Skillrack from "./Skillrack";

export default function CodingProfile({
  leetcode,
  codechef,
  geeksforgeeks,
  skillrack,
}) {
  const [activeTab, setActiveTab] = useState("leetcode");
  const token = localStorage.getItem("studentToken");

  return (
    <section className="border-2 border-slate-300 shadow-lg bg-white rounded-lg">
      <div className="grid grid-cols-4 items-center">
        <Tab
          src="/leetcode.png"
          name="leetcode"
          handleClick={setActiveTab}
          active={activeTab}
        />
        <Tab
          src="/codechef.png"
          name="codechef"
          handleClick={setActiveTab}
          active={activeTab}
        />
        <Tab
          src="/geeksforgeeks.png"
          name="geeksforgeeks"
          handleClick={setActiveTab}
          active={activeTab}
        />
        <Tab
          src="/skillrack.png"
          name="skillrack"
          handleClick={setActiveTab}
          active={activeTab}
        />
      </div>
      <div className="p-4 min-h-screen">
        <Leetcode
          username={leetcode}
          isVisible={activeTab === "leetcode"}
          token={token}
        />
        <Codechef
          username={codechef}
          isVisible={activeTab == "codechef"}
          token={token}
        />
        <Geeksforgeeks
          username={geeksforgeeks}
          isVisible={activeTab == "geeksforgeeks"}
          token={token}
        />
        <Skillrack
          url={skillrack}
          isVisible={activeTab == "skillrack"}
          token={token}
        />
      </div>
    </section>
  );
}

function Tab({ src, name, handleClick, active }) {
  return (
    <button
      className={`cursor-pointer px-10 border-x border-b-2 border-slate-300 ${active === name ? "bg-slate-200" : "hover:bg-slate-100"} h-full`}
      onClick={() => handleClick(name)}
    >
      <img src={src} alt={name} />
    </button>
  );
}
