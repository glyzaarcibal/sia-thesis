import React, { useEffect, useState } from "react";
import bg from "../assets/background.jpg";
import ProgressCircles from "../Components/Progress/ProgressCircles";
import AboutContent from "../Partials/Sections/About/AboutContent";

const About = () => {
  const [scrollY, setScrollY] = useState(0);
  const totalScrollHeight = 3000;
  const numCircles = 4;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ height: totalScrollHeight }}>
      <div className="absolute top-0 z-10 min-w-screen min-h-screen max-h-screen px-14">
        <div className="relative z-0 w-full h-full"></div>

        <div className="fixed w-fit z-10 h-full flex justify-center items-center">
          {/* <ProgressCircles
            scrollY={scrollY}
            totalScrollHeight={totalScrollHeight}
            numCircles={numCircles}
          /> */}
        </div>

        <div className="relative top-0 grid grid-cols-2 gap-2 ">
          <div className="z-10 p-8 pl-20 h-fit">
            <div className="relative h-screen flex flex-col justify-center text-4xl">
              <h4 className="font-bold mt-2">About Pathfinder</h4>
              <div className="mt-2"></div>
              <p className="text-xl text-gray-600">
                Pathfinder is a simple yet powerful quiz that helps you discover
                the best counseling approach for your needs. Whether you're
                seeking therapy, coaching, or self-help strategies, Pathfinder
                provides personalized recommendations to guide you toward the
                best mental health support.
              </p>
            </div>
            <div className="relative h-screen flex flex-col justify-center text-4xl ">
              <h4 className="font-bold mt-2">Why PathFinder?</h4>
              <div className="mt-2"></div>
              <p className="text-xl text-gray-600">
                Pathfinder is more than just a name—it’s a promise. Just like a
                compass guiding travelers through uncharted territory, our app
                helps you navigate the world of counseling and find the path
                that suits you best. Whether you're feeling overwhelmed, seeking
                career guidance, or just curious about different therapy styles,
                Pathfinder leads you in the right direction.
                <br /> <div className="mt-2"></div>
                Our AI-driven approach ensures that every recommendation is
                tailored to your unique responses, making the journey toward
                self-discovery smooth and insightful. Let Pathfinder illuminate
                the road ahead and help you take the first step toward a
                brighter, more balanced future.
              </p>
            </div>
            <div className="relative h-screen flex flex-col justify-center text-4xl">
              <h4 className="font-bold mt-2">Meet the Team</h4>
              <div className="mt-2"></div>
              <p className="text-xl text-gray-600">
                Our dedicated team of mental health advocates and tech experts
                built Pathfinder to make counseling more accessible and
                understandable. We are passionate about bridging the gap between
                mental health resources and those who need them the most.
              </p>
            </div>
            <div className="relative h-screen flex flex-col justify-center text-4xl">
              <h4 className="font-bold mt-2">Get Started Today</h4>
              <div className="mt-2"></div>
              <p className="text-xl text-gray-600">
                Take the quiz now and find the counseling approach that fits you
                best! With just a few minutes of your time, you can gain
                insights into what type of support suits your personal growth
                journey. Start today and take the first step toward better
                mental well-being.
              </p>
            </div>
          </div>
          <div className="fixed w-full grid grid-cols-2 h-full justify-center items-center">
            <div></div>
            <AboutContent
              scrollPos={scrollY}
              totalScrollHeight={totalScrollHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
