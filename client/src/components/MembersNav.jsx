import { NavLink } from "react-router-dom";

export function MembersNav({ icon, title, to = "/", className = "" }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 w-full py-4 
        ${isActive ? "bg-white text-blue-500 font-semibold" : "bg-complementary text-black/80 hover:bg-white/30 hover:text-gray-500"} 
        ${className}`
      }
    >
      <div className="text-xl">{icon}</div>
      <h2 className="text-xs">{title}</h2>
    </NavLink>
  );
}

export default MembersNav;
