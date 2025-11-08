import { motion } from "framer-motion";

const ToggleSwitch = ({ options, selected, setSelected }) => {
  return (
    <div className="relative bg-gray-200 rounded-lg p-2 my-2 inline-flex">
      {/* Moving Background Indicator */}
      <motion.div
        layout
        animate={{ x: `${((options.indexOf(selected) * (100 * options.length)) / options.length)}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute top-0 left-0 p-2 h-full"
        style={{ width: `${100 / options.length}%` }}
      >
        <motion.div className="bg-[#0cdfc6] z-10 h-full w-full rounded-lg"></motion.div>
      </motion.div>

      {/* Options */}
      {options.map((option) => (
        <div
          key={option}
          className={`${
            selected === option ? "" : "text-gray-400"
          } text-center z-20 p-2 px-4 mx-1 rounded-lg cursor-pointer`}
          onClick={() => setSelected(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default ToggleSwitch;
