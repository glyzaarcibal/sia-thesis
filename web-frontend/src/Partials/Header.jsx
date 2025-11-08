import React from "react";
import wordMark from "../assets/images/pathfinder.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { triggerLogout } from "../Redux/Slice/AuthSlice";
import { useAuth } from "../Hooks/useAuth";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const Header = () => {
  const user = useSelector((state) => state.auth);
  console.log(user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Logout?",
      text: "You are about to be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("token");
        Swal.fire("You are now logged out.");
        dispatch(triggerLogout());
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      }
    });
  };

  return (
    <>
      <div className="fixed z-50 top-0 left-0 h-20 px-14 w-full flex justify-between items-center bg-white shadow-custom">
        <div className="w-44">
          <img className="" src={wordMark} />
        </div>
        <div className="gap-5 flex justify-end items-center ">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          {user.isLoggedIn && <Link to="/profile">Profile</Link>}

          {user.isLoggedIn ? (
            <div className="cursor-pointer" onClick={() => handleLogout()}>
              Logout
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}

          <Link
            className="rounded-lg bg-[#0cdfc6] px-4 py-2 text-white font-bold"
            to="/quiz"
          >
            Start Quiz
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
