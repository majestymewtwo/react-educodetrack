import { Link } from "react-router";
import Logo from "../common/Logo";
import Logout from "../common/Logout";

export default function () {
  const links = [
    {
      href: "/student/dashboard",
      title: "Dashboard",
      image: "/dashboard.png",
    },
    {
      href: "/student/leaderboard",
      title: "Leaderboard",
      image: "/leaderboard.png",
    },
    {
      href: "/student/profile",
      title: "Profile",
      image: "/profile.png",
    },
  ];

  return (
    <section className="w-[20%] bg-gray-800 h-screen p-2 flex flex-col justify-between font-semibold">
      <div className="space-y-4">
        <Logo />
        {links.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="bg-amber-500 hover:bg-amber-400 p-3 rounded-lg cursor-pointer flex items-center justify-between"
          >
            <p>{item.title}</p>
            <img src={item.image} alt={item.title} className="size-7" />
          </Link>
        ))}
      </div>
      <Logout type="student" />
    </section>
  );
}
