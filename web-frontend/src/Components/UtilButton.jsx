import React from "react";

const UtilButton = ({ text, onClick, disabled = false }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${
        disabled
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-[#0cdfc6] cursor-pointer hover:bg-white hover:border-2 hover:border-[#0cdfc6] hover:text-[#0cdfc6]"
      } my-2 p-4 px-8  rounded-lg shadow-lg text-white  `}
    >
      {text}
    </button>
  );
};

export default UtilButton;
