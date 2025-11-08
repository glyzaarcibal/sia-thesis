import React from "react";

const PrimeBtn = ({ text, type = "secondary", onClick }) => {
  return (
    <button
      className={`${
        type === "primary" ? "bg-[#0cdfc6] text-white" : "bg-white"
      } shadow-custom py-4 px-10 rounded-full font-bold text-xs w-full cursor-pointer`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default PrimeBtn;
