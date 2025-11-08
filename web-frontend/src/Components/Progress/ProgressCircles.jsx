import React from "react";

const ProgressCircles = ({ scrollY, totalScrollHeight, numCircles }) => {
  const segmentHeight = totalScrollHeight / numCircles;

  return (
    <div className="relative top-0 h-3/4 w-10 flex justify-center items-center mt-10">
      <div className="h-2/4 w-20 bg-white shadow-custom rounded-lg flex flex-col p-3 gap-2">
        <div className="flex flex-col items-center gap-2 h-full overflow-hidden">
          {[...Array(numCircles)].map((_, index) => {
            const startRange = index * segmentHeight;
            const endRange = startRange + segmentHeight;
            const isActive = scrollY >= startRange && scrollY < endRange;
            const isPassed = scrollY >= endRange;
            const progress = isActive
              ? ((scrollY - startRange) / segmentHeight) * 100
              : isPassed
              ? 100
              : 0;

            return (
              <div
                key={index}
                className={`relative w-full h-4 bg-gray-300 rounded-full overflow-hidden transition-all duration-300 ${
                  isActive ? "flex-grow" : "h-4"
                }`}
              >
                <div
                  className="absolute left-0 top-0 w-full bg-[#0cdfc6] transition-all"
                  style={{ height: `${progress}%` }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressCircles;
