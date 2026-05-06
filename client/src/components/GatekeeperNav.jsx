import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

function GatekeeperNav() {
  const navRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const showNavbar = () => {
    setIsOpen((s) => !s);
  };
  return (
    <>
      <div className="">
        <nav
          ref={navRef}
          className={`bg-blue-400 backdrop-blur-[2px] text-white border-white/90 flex flex-col fixed sm:sticky right-0 top-0 h-dvh w-64 transition-transform duration-200 z-40 ${
            isOpen ? "translate-x-100 " : "-translate-x-[-100]"
          } sm:relative sm:translate-x-0 sm:w-60 sm:bg-white/10`}
        >
          <div className="p-6 flex flex-col items-center justify-center w-full font-secondary">
            <IoPersonOutline className="text-5xl" />
            <h3 className="text-2xl px-6 font-primary border-b-2 mb-5">
              Gatekeeper
            </h3>
            <ul className="w-full">
              <NavLink to="/gatekeeper" end>
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
              <NavLink to="/gatekeeper/members">
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
              <NavLink to="/gatekeeper/attendance">
                {({ isActive }) => (
                  <li
                    className={`p-4 border-t-white/20 border-t-2 text-[1.2rem] hover:bg-white/20 ${
                      isActive
                        ? "bg-white text-blue-500 font-semibold rounded-lg mx-2"
                        : ""
                    }`}
                  >
                    Attendance
                  </li>
                )}
              </NavLink>
              <NavLink to="/gatekeeper/finance">
                {({ isActive }) => (
                  <li
                    className={`p-4 border-t-white/20 border-t-2 text-[1.2rem] hover:bg-white/20 ${
                      isActive
                        ? "bg-white text-blue-500 font-semibold rounded-lg mx-2"
                        : ""
                    }`}
                  >
                    Finance
                  </li>
                )}
              </NavLink>
              <NavLink to="/gatekeeper/reports">
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
              <NavLink to="/">
                {({ isActive }) => (
                  <li
                    className={`p-4 pb-5 text-[1.2rem] absolute bottom-0 hover:bg-white/20 w-full border-t-white/20 border-t-2 ${
                      isActive
                        ? "bg-white text-blue-500 font-semibold rounded-lg mx-2"
                        : ""
                    }`}
                  >
                    Logout
                  </li>
                )}
              </NavLink>
            </ul>
            {/* <button
                  className="nav-btn close-btn sm:hidden"
                  onClick={showNavbar}
                >
                  <FaTimes />
                </button> */}
          </div>
        </nav>
      </div>

      {/* hamburger - visible only on small screens */}
      <button
        className="nav-btn right-0 sm:hidden fixed top-4 mr-4 z-50 p-2 bg-blue-400 backdrop-blur-[2px] rounded"
        onClick={showNavbar}
      >
        <FaBars />
      </button>
      {/* <nav id="sidebar" className="sticky w-80 flex-row " ref={navRef}>
        <ul class="nav flex-column navbar-expand-lg">
          <a class="toggle" onclick="toggleNav1()">
            <span class="hamburger text-white flex justify-end mt-1 me-3 fs-3">
              <hr />
              <hr />
              <hr />
            </span>
          </a>
          <span class="admin text-white flex justify-center items-center">
            <BsPerson />
          </span>
          <span class="navtitle border-bottom rounded-5 text-white flex justify-center items-center mb-2">
            Admin
          </span>
          <li class="nav-item">
            <a
              class="nav-link active bg-info-subtle text-info-emphasis"
              aria-current="page"
              href="#"
            >
              <span class="icon">
                <BsPerson />
              </span>
              <span class="text"> Dashboard</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span class="icon">
                <BsPerson />
              </span>
              <span class="text"> Users & Access</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span class="icon">
                <BsPerson />
              </span>
              <span class="text"> Members Data</span>
            </a>
          </li>
          <li class="nav-item">
            <button className="dropdown-btn">
              <BsPerson />
              <span class="icon">Reports & Analytics</span>
              <BsPerson />
            </button>
            <ul>
              <li>Overview</li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span class="icon">
                <BsPerson />
              </span>
              <span class="text">System Settings</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span class="icon">
                <BsPerson />
              </span>
              <span class="text">Log-out</span>
            </a>
          </li>
        </ul>
      </nav>
      <main>
        <div className="container">
          <h2>Hello World</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
            quae, deserunt recusandae perferendis accusamus adipisci animi porro
            repellendus possimus iure illum, inventore deleniti eos soluta at,
            sunt error omnis et?
          </p>
        </div>
        <div className="container">
          <h2>Hello World</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
            quae, deserunt recusandae perferendis accusamus adipisci animi porro
            repellendus possimus iure illum, inventore deleniti eos soluta at,
            sunt error omnis et?
          </p>
        </div>
        <div className="container">
          <h2>Hello World</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
            quae, deserunt recusandae perferendis accusamus adipisci animi porro
            repellendus possimus iure illum, inventore deleniti eos soluta at,
            sunt error omnis et?
          </p>
        </div>
      </main> */}
    </>
  );
}

export default GatekeeperNav;
