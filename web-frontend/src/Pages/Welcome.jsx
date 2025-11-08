import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MobileView from "../assets/images/mobile.png";
import QuizIcon from "../assets/images/quiz.png";
import RecommendationIcon from "../assets/images/recommendation.png";
import CounselingIcon from "../assets/images/counseling.png";
import JourneyIcon from "../assets/images/Journey.png";
import ChatbotIcon from "../assets/images/ai.png";
import GamesIcon from "../assets/images/games.png";
import TipsIcon from "../assets/images/tips.png";
import { LuBrainCircuit, LuGamepad, LuPhoneCall } from "react-icons/lu";
import { BsClipboard2Heart } from "react-icons/bs";
import { LiaWpforms } from "react-icons/lia";
import { RiPsychotherapyLine, RiHandHeartLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import Vapi from "@vapi-ai/web";
import { toast } from "react-toastify";

const Welcome = () => {
  const [isCalling, setIsCalling] = useState(false);
  const vapi = new Vapi("4712e393-1100-4981-813a-62981dba89a3");
  const { scrollYProgress } = useScroll();

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const handleCall = async () => {
    const toastId = toast.loading(
      "Please wait while we connect you to our assistant"
    );
    if (!isCalling) {
      try {
        await vapi.start("d98095b5-6bf0-4bb0-9631-214660006c3c");
        setIsCalling(true);
        toast.update(toastId, {
          render: "You are now connected to our assistant",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error starting call:", error);
      }
    } else {
      try {
        window.location.reload();
        vapi.stop();
        setIsCalling(false);
      } catch (error) {
        console.error("Error stopping call:", error);
        setIsCalling(false);
      }
    }
  };

  useEffect(() => {
    console.log(isCalling);
  }, [isCalling]);

  return (
    <div className="absolute top-10 left-0 w-full  text-black overflow-hidden mt-30 ">
      <div className="fixed z-30 bottom-10 right-10 flex justify-center items-center flex-col gap-3">
        <button
          onClick={handleCall}
          className={`py-2 px-4 rounded-2xl shadow-custom flex gap-2 justify-center items-center transition duration-300 ${
            isCalling ? "bg-[#0cdfc6] text-white" : "bg-white text-black"
          }`}
        >
          <p>{isCalling ? "Calling..." : "Call Our Assistant"}</p>
          <LuPhoneCall
            className={`${
              isCalling ? "text-white" : "text-[#0cdfc6]"
            } text-2xl`}
          />
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="w-full px-14 grid grid-cols-2 items-center relative z-10 mb-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h4 className="text-6xl font-extrabold mb-5 drop-shadow-lg leading-tight">
            Find the Right Counseling for You with AI-Powered Insights!
          </h4>
          <p className="text-lg text-black drop-shadow-md">
            Take a quick quiz to determine the best counseling type for your
            needs. Play wellness games, chat with our AI counselor, and start
            your journey to mental well-being.
          </p>
          <div className="mt-6 flex gap-4">
            <motion.button
              className="p-4 px-8 rounded-lg shadow-lg bg-[#0cdfc6] text-white font-bold cursor-pointer transition duration-300 hover:shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link to="/quiz" className="w-full h-full block">
                Try Now
              </Link>
            </motion.button>
            <motion.button
              className="p-4 px-8 rounded-lg shadow-lg bg-white text-gray-900 font-bold cursor-pointer hover:bg-gray-200 transition duration-300 hover:shadow-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link to="/about" className="w-full h-full block">
                Learn More
              </Link>
            </motion.button>
          </div>
        </motion.div>
        <div className="relative flex justify-center items-center">
          <motion.div
            className="absolute flex flex-col justify-center items-center z-20 
             w-30 h-26 rounded-xl shadow-custom bg-white 
             text-center p-4"
            initial={{
              opacity: 0,
              scale: 0,
              transform: "translate(200%, 100%)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transform: "translate(150%, 100%)",
            }}
            transition={{ duration: 1, type: "spring" }}
          >
            <LuBrainCircuit className="text-2xl" />
            <p className="w-full">AI Powered</p>
          </motion.div>
          <motion.div
            style={{ transform: "translate(-150%, -100%)" }}
            className="absolute flex flex-col justify-center items-center z-20 
             w-30 h-26 rounded-xl shadow-custom bg-white 
             text-center p-4"
            initial={{
              opacity: 0,
              scale: 0,
              transform: "translate(-200%, -100%)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              transform: "translate(-150%, -100%)",
            }}
            transition={{ duration: 1, type: "spring" }}
          >
            <LuGamepad className="text-2xl" />
            <p className="w-full">Gamified</p>
          </motion.div>
          <motion.img
            src={MobileView}
            alt="Mobile View"
            className="w-80 h-auto drop-shadow-lg border-8 border-white rounded-3xl shadow-custom"
            style={{ y: imageY }}
            animate={{
              opacity: 1,
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        </div>
      </section>

      <div className="w-full h-1 bg-white my-10 mt-20"></div>

      {/* HOW IT WORKS SECTION */}
      <section
        className="mt-30 px-14 text-center relative py-20"
        style={{
          background:
            "url('/path-to-your-background-image.jpg') center/cover no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold drop-shadow-lg text-white">
            How It Works
          </h2>
          <p className="text-lg text-gray-200 mt-2 drop-shadow-md">
            Discover how our AI-powered system guides you to the right
            counseling path.
          </p>
          <motion.div
            className="mt-10 grid grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            {[
              {
                icon: <LiaWpforms className="text-8xl text-white" />,
                title: "Step 1: Take a Quiz",
                text: "Answer a few quick questions to assess your needs.",
              },
              {
                icon: <RiHandHeartLine className="text-8xl text-white" />,
                title: "Step 2: Get Recommendations",
                text: "Receive AI-driven counseling suggestions tailored for you.",
              },
              {
                icon: <RiPsychotherapyLine className="text-8xl text-white" />,
                title: "Step 3: Start Your Journey",
                text: "Engage with our AI counselor and begin improving your mental well-being.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl shadow-xl flex flex-col items-center text-center border border-white/50 backdrop-blur-xl"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.2) 100%)",
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                {step.icon}
                <h3 className="text-xl font-bold text-white drop-shadow-lg mt-3">
                  {step.title}
                </h3>
                <p className="text-gray-200 mt-2 drop-shadow-md">{step.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="w-full h-1 bg-white my-10"></div>

      {/* FEATURES SECTION */}
      <section className="mt-10 px-14 text-center">
        <h2 className="text-5xl font-bold drop-shadow-lg">Features</h2>
        <p className="text-lg mt-2 drop-shadow-md">
          Explore the cutting-edge features of our AI-driven counseling
          platform.
        </p>
        <motion.div
          className="mt-10 grid grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          {[
            {
              icon: ChatbotIcon,
              title: "AI Chatbooth",
              text: "Chat with an AI counselor for instant guidance and support.",
            },
            {
              icon: GamesIcon,
              title: "Activities",
              text: "Play engaging wellness games to relax and improve mental health.",
            },
            {
              icon: TipsIcon,
              title: "Tips & Knowledge",
              text: "Access expert-backed mental health tips and advice anytime.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl shadow-xl flex flex-col items-center text-center border border-white/50 backdrop-blur-xl"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.2) 100%)",
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-24 h-24 mb-4 drop-shadow-lg"
              />
              <h3 className="text-xl font-bold text-gray-900 drop-shadow-lg">
                {feature.title}
              </h3>
              <p className="text-gray-800 mt-2 drop-shadow-md">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* GET HELP SECTION */}
      <section className="mt-10 px-14 text-center">
        <h2 className="text-5xl font-bold drop-shadow-lg">Get Help</h2>
        <p className="text-lg mt-2 drop-shadow-md">
          You're not alone. If you're struggling, reach out to professionals who
          can help.
        </p>

        <motion.div
          className="mt-10 grid grid-cols-2 gap-10 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <motion.div
            className="p-8 rounded-lg shadow-lg border border-white/50 backdrop-blur-xl text-left"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.2) 100%)",
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 drop-shadow-lg">
              Need Immediate Support?
            </h3>
            <p className="text-gray-800 mt-3 drop-shadow-md">
              If you're feeling overwhelmed, talking to someone can help.
              Professional counselors are available to support you 24/7.
            </p>
            <div className="mt-4 p-4 bg-white rounded-md shadow-md text-gray-900">
              <p className="font-bold text-lg">📞 Mental Health Helpline</p>
              <p className="text-md">
                Call (Philippines):{" "}
                <span className="font-semibold">1553 (Toll-Free)</span>
              </p>
              <p className="text-md">
                National Center for Mental Health Crisis Line:
              </p>
              <p className="text-md">
                Luzon: <span className="font-semibold">0917-899-8727</span> or
                (02) 7989-8727
              </p>
              <p className="text-md">
                Visayas and Mindanao:{" "}
                <span className="font-semibold">0966-351-4518</span> or
                0939-235-9670
              </p>
            </div>
            <motion.button
              className="mt-6 p-4 px-8 rounded-lg shadow-lg bg-[#0cdfc6] text-white font-bold cursor-pointer transition duration-300 hover:shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                window.open(
                  "https://www.nimh.nih.gov/health/find-help",
                  "_blank"
                )
              }
            >
              Talk to a Professional
            </motion.button>
          </motion.div>
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={CounselingIcon}
              alt="Counseling Support"
              className="w-72 h-auto drop-shadow-lg"
            />
          </motion.div>
        </motion.div>
      </section>
      <footer className="mt-14 px-14 py-6 bg-gray-900 text-center text-gray-300">
        <p>&copy; 2025 PathFinder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
