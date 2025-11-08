import React, { useEffect, useState } from "react";
import questionsData from "../Data/Questions";
import { AnimatePresence, motion } from "framer-motion";
import UtilButton from "../Components/UtilButton";
import { playAudio } from "../Utils/playSound";
import axiosInstance from "../Utils/axiosInstance";
import ToggleSwitch from "../Components/Switch/ToggleSwitch";
import TextField from "@mui/material/TextField";
import AnalysisModal from "../Components/AnalysisModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Quiz = () => {
  const [questions, setQuestions] = useState(questionsData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState({});
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState(18);
  const [modalOpen, setModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [temp, setTemp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // playAudio(questions[0].englishAudio);
  }, []);

  const handleSelect = (index) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: index,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    const quiz_result = Object.values(answers);

    console.log("Quiz Result:", quiz_result);

    try {
      // First request: Get analysis result
      const res = await axiosInstance.post("/api/analysis/", { quiz_result });

      if (res.status === 200) {
        const analysis_result = res.data.analysis_result;

        // Save the result in local state
        setResult(analysis_result);

        console.log("Analysis Result:", analysis_result);

        // Second request: Save the result to /analysis/
        await axiosInstance.post("/analysis/", {
          quiz_result,
          analysis_result,
          gender,
          age,
        });

        console.log("Successfully saved analysis to /analysis/");
      }
    } catch (e) {
      console.error("Error:", e.response ? e.response.data : e);
    }
  };

  const handleAnalysis = async () => {
    const quiz_result = Object.values(answers);
    const formData = {
      quiz_result,
      result,
    };

    setIsLoading(true);
    const toastId = toast.loading("Analyzing your responses...");

    try {
      const res = await axiosInstance.post(
        "https://hook.us2.make.com/fy1ej5uroah2xsb8nk0t821ywjkccae0",
        {
          formData,
        }
      );

      setAnalysisData(res.data);
      console.log(res);

      // Update the loading toast to success
      toast.update(toastId, {
        render: "Analysis complete!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (e) {
      console.log(e);

      // Update the loading toast to error
      toast.update(toastId, {
        render: "Analysis failed. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openAnalysis = async () => {
    console.log(analysisData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    console.log(modalOpen);
  }, [modalOpen]);

  return (
    <motion.div
      layout
      className="absolute top-0 left-0 w-full grid grid-cols-[300px_auto] items-center min-h-screen p-4 gap-4 overflow-hidden"
    >
      <motion.div className="flex flex-col justify-center items-center w-full h-full py-4">
        <motion.div className="bg-white shadow-custom w-full h-3/4 rounded-2xl p-4">
          <div>Language</div>
          <ToggleSwitch
            options={["English", "Tagalog"]}
            selected={language}
            setSelected={setLanguage}
          />
          <div>Gender</div>
          <ToggleSwitch
            options={["Male", "Female"]}
            selected={gender}
            setSelected={setGender}
          />
          <div>Age</div>
          <TextField
            id="age"
            type="age"
            variant="outlined"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            fullWidth
          />
          <div>Result</div>
          <UtilButton onClick={() => handleAnalysis()} text="Analyze" />
          <UtilButton
            text="View Analysis"
            onClick={openAnalysis}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          />
        </motion.div>
      </motion.div>

      <motion.div className="flex flex-col justify-center items-center w-full h-full ">
        <AnimatePresence mode="popLayout">
          <motion.p
            layout
            className="flex text-xl font-bold text-gray-500 my-4"
          >
            Question {currentQuestion + 1} of {questions.length}
          </motion.p>
        </AnimatePresence>
        {questions.map((item, i) =>
          currentQuestion === i ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="bg-white shadow-custom rounded-xl p-12 text-center w-full pb-12"
            >
              {/* Question */}
              <h2 className="text-lg font-semibold">
                {language === "English" ? item.question : item.tagalog}
              </h2>

              {/* Answer Options */}
              <div className="mt-4 flex flex-col gap-2">
                {item.answers.map((answer, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-lg transition-all duration-300
                    ${
                      answers[currentQuestion] === index
                        ? "bg-[#0cdfc6] text-white font-bold"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                    onClick={() => handleSelect(index)}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null
        )}

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="flex justify-center items-center gap-4 p-4"
          >
            <UtilButton
              text="Prev"
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              disabled={currentQuestion === 0}
            />
            <UtilButton
              text={
                currentQuestion === questions.length - 1 ? "Finish" : "Next"
              }
              onClick={() => handleNext()}
              disabled={
                currentQuestion === questions.length ||
                answers[currentQuestion] == null
              }
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 w-4/5 h-4/5 overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Analysis Results
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {analysisData ? (
              <div className="space-y-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    Overall Assessment
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {analysisData.overall}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Detailed Insights
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    {analysisData.insights && (
                      <div className="whitespace-pre-line text-gray-700">
                        {analysisData.insights
                          .split("\n\n")
                          .map((paragraph, idx) => (
                            <div key={idx} className="mb-4">
                              {paragraph.startsWith("**") ? (
                                <div>
                                  <h4 className="font-bold text-gray-900 mb-2">
                                    {paragraph.split("**")[1]}
                                  </h4>
                                  <p>
                                    {paragraph
                                      .split("\n   - ")
                                      .slice(1)
                                      .join("\n   - ")}
                                  </p>
                                </div>
                              ) : (
                                <p>{paragraph}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-xl text-gray-500">
                  No analysis data available
                </div>
                <p className="text-gray-400 mt-2">
                  Please complete the quiz and click "Analyze" first
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Quiz;
