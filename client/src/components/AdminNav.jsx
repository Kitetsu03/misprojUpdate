import { Chart as Chartjs } from "chart.js/auto";
import { useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";

function AdminNav() {
  const navRef = useRef();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const showNavbar = () => {
    setIsOpen((s) => !s);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <>
      <div>
        <nav
          ref={navRef}
          className={`bg-blue-400 backdrop-blur-[2px] text-white border-white/90 flex flex-col fixed sm:sticky right-0 top-0 h-dvh w-64 transition-transform duration-200 z-40 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } sm:relative sm:translate-x-0 sm:w-60 sm:bg-white/10`}
        >
          <div className="p-6 flex flex-col items-center justify-center w-full font-secondary">
            <IoPersonOutline className="text-5xl" />
            <h3 className="text-2xl px-6 font-primary border-b-2 mb-5">
              Admin
            </h3>

            <ul className="w-full">
              <hr className="opacity-30" />

              <NavLink to="/admin" end>
                {({ isActive }) => (
                  <li
                    className={`p-4 text-[1.2rem] hover:bg-white/20 ${
                      isActive
                        ? "bg-white text-blue-500 font-semibold rounded-lg mx-2"
                        : ""
                    }`}
                  >
                    Dashboard
                  </li>
                )}
              </NavLink>

              <hr className="opacity-30" />

              <NavLink to="/admin/useraccess">
                {({ isActive }) => (
                  <li
                    className={`p-4 text-[1.2rem] hover:bg-white/20 ${
                      isActive
                        ? "bg-white text-blue-500 font-semibold rounded-lg mx-2"
                        : ""
                    }`}
                  >
                    Users & Access
                  </li>
                )}
              </NavLink>

              <hr className="opacity-30" />

              <NavLink to="/admin/members">
                {({ isActive }) => (
                  <li
                    className={`p-4 text-[1.2rem] hover:bg-white/20 ${
                      isActive
                        ? "bg-white text-blue-500 font-semibold rounded-lg mx-2"
                        : ""
                    }`}
                  >
                    Members Data
                  </li>
                )}
              </NavLink>

              <NavLink to="/admin/reports">
                {({ isActive }) => (
                  <li
                    className={`p-4 border-t-white/20 border-t-2 text-[1.2rem] hover:bg-white/20 ${
                      isActive
                        ? "bg-white text-blue-500 font-semibold rounded-lg mx-2"
                        : ""
                    }`}
                  >
                    Reports
                  </li>
                )}
              </NavLink>

              <NavLink to="/admin/settings">
                {({ isActive }) => (
                  <li
                    className={`p-4 border-t-white/20 border-t-2 text-[1.2rem] hover:bg-white/20 ${
                      isActive
                        ? "bg-white text-blue-500 font-semibold rounded-lg mx-2"
                        : ""
                    }`}
                  >
                    Settings
                  </li>
                )}
              </NavLink>

              {/* LOGOUT BUTTON */}
              <li
                onClick={handleLogout}
                className="p-4 pb-5 text-[1.2rem] absolute bottom-0 hover:bg-white/20 w-full border-t-white/20 border-t-2 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Hamburger */}
      <button
        className="nav-btn right-0 sm:hidden fixed top-4 mr-4 z-50 p-2 bg-blue-400 backdrop-blur-[2px] rounded"
        onClick={showNavbar}
      >
        <FaBars />
      </button>
    </>
  );
}

export default AdminNav;
