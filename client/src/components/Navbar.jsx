import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Userlogout } from "../redux/AuthSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.authSlice);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(Userlogout());
    toast.success("logout successfuly");
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-linear-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">✨ Gemini</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="hover:text-blue-200 transition duration-200 font-medium"
                >
                  Chat
                </Link>
                <Link
                  to="/history"
                  className="hover:text-blue-200 transition duration-200 font-medium"
                >
                  History
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="dropdown dropdown-center">
                      <div className="avatar">
                        <div tabIndex={0}  className=" w-10 rounded-full">
                          <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
                        </div>
                      </div>
                   
                    <ul
                      tabIndex="-1"
                      className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                    >
                      <li className="text-black">
                        Name: {user?.name || "User"}
                      </li>
                      <li className="text-black">
                        Email: {user?.email || "example@gmail.com"}
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition duration-200 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-blue-500">
            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="block px-4 py-2 hover:bg-blue-700 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chat
                </Link>
                <Link
                  to="/history"
                  className="block px-4 py-2 hover:bg-blue-700 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  History
                </Link>
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold mb-2">
                    {user?.name || "User"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-200 hover:bg-red-600 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-blue-700 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 hover:bg-blue-700 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
