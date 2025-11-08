const questions = [
  {
    question:
      "In the past two weeks, how often have you felt excessively worried or anxious?",
    answers: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
    input: "",
    type: "analysis",
    tagalog:
      "Sa nakaraang dalawang linggo, gaano kadalas mong naramdaman na sobra kang nag-aalala o kaba?",
    englishAudio: "../assets/audio/voice/inthepast.mp3",
  },
  {
    question:
      "In the past two weeks, how often have you felt down, hopeless, or lost interest in things you enjoy?",
    answers: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
    input: "",
    type: "analysis",
    tagalog:
      "Sa nakaraang dalawang linggo, gaano kadalas mong naramdaman na ikaw ay malungkot, nawawalan ng pag-asa, o nawawala ang interes sa mga bagay na kinagigiliwan mo?",
  },
  {
    question: "How would you rate your overall self-esteem?",
    answers: [
      "Very Low",
      "Low",
      "Moderate",
      "High",
      "Very High",
      "Extremely High",
    ],
    input: "",
    type: "analysis",
    tagalog: "Paano mo irarate ang kabuuang pagpapahalaga mo sa sarili?",
  },
  {
    question: "How would you rate your overall sleep quality?",
    answers: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"],
    input: "",
    type: "analysis",
    tagalog: "Paano mo irarate ang kabuuang kalidad ng iyong pagtulog?",
  },
  {
    question: "How would you rate your overall stress level?",
    answers: ["Low", "Moderate", "High"],
    input: "",
    type: "analysis",
    tagalog: "Paano mo irarate ang kabuuang antas ng iyong stress?",
  },

  // Multiple Choice Questions
  {
    question: "Have you ever been diagnosed with a mental health condition?",
    answers: ["No", "Yes"],
    input: "",
    type: "multiple choice",
    tagalog: "Nadiagnose ka na ba ng isang kondisyon sa kalusugan ng isip?",
  },
  {
    question: "How often do you experience headaches?",
    answers: [
      "Never",
      "Rarely",
      "Occasionally",
      "Often",
      "Very Often",
      "Almost Daily",
    ],
    input: "",
    type: "multiple choice",
    tagalog: "Gaano kadalas kang nakakaranas ng pananakit ng ulo?",
  },
  {
    question: "How would you describe your blood pressure?",
    answers: ["Low", "Normal", "High"],
    input: "",
    type: "multiple choice",
    tagalog: "Paano mo ilalarawan ang iyong presyon ng dugo?",
  },
  {
    question:
      "How often do you experience shortness of breath or breathing difficulties?",
    answers: [
      "Never",
      "Rarely",
      "Occasionally",
      "Often",
      "Very Often",
      "Almost Daily",
    ],
    input: "",
    type: "multiple choice",
    tagalog:
      "Gaano kadalas kang nakakaranas ng kakulangan sa paghinga o kahirapan sa paghinga?",
  },
  {
    question:
      "How would you rate the noise level in your living/study environment?",
    answers: [
      "Very Quiet",
      "Quiet",
      "Moderate",
      "Noisy",
      "Very Noisy",
      "Extremely Noisy",
    ],
    input: "",
    type: "multiple choice",
    tagalog:
      "Paano mo irarate ang antas ng ingay sa iyong lugar ng paninirahan o pag-aaral?",
  },
  {
    question: "How comfortable is your living situation?",
    answers: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"],
    input: "",
    type: "multiple choice",
    tagalog: "Gaano ka-komportable ang iyong kalagayan sa paninirahan?",
  },
  {
    question: "How safe do you feel in your living or working environment?",
    answers: [
      "Very Unsafe",
      "Unsafe",
      "Neutral",
      "Safe",
      "Very Safe",
      "Extremely Safe",
    ],
    input: "",
    type: "multiple choice",
    tagalog:
      "Gaano ka-ligtas ang iyong nararamdaman sa iyong lugar ng paninirahan o trabaho?",
  },
  {
    question:
      "Are all your basic needs (food, shelter, healthcare) adequately met?",
    answers: [
      "Not at all",
      "Rarely",
      "Sometimes",
      "Most of the Time",
      "Almost Always",
      "Always",
    ],
    input: "",
    type: "multiple choice",
    tagalog:
      "Natutugunan ba nang sapat ang lahat ng iyong pangunahing pangangailangan (pagkain, tirahan, pangangalaga sa kalusugan)?",
  },
  {
    question: "How would you rate your academic performance?",
    answers: ["Very Poor", "Poor", "Fair", "Good", "Very Good", "Excellent"],
    input: "",
    type: "multiple choice",
    tagalog: "Paano mo irarate ang iyong pagganap sa akademiko?",
  },
  {
    question: "How much academic pressure do you experience?",
    answers: [
      "None",
      "Very Light",
      "Manageable",
      "Somewhat Heavy",
      "Heavy",
      "Overwhelming",
    ],
    input: "",
    type: "multiple choice",
    tagalog: "Gaano kalaki ang presyur na nararanasan mo sa akademiko?",
  },
  {
    question:
      "How would you describe your relationship with your teachers/professors?",
    answers: ["Very Poor", "Poor", "Neutral", "Good", "Very Good", "Excellent"],
    input: "",
    type: "multiple choice",
    tagalog:
      "Paano mo ilalarawan ang iyong relasyon sa iyong mga guro/profesor?",
  },
  {
    question: "How worried are you about your future career?",
    answers: [
      "Not at all",
      "Slightly",
      "Somewhat",
      "Moderately",
      "Very",
      "Extremely",
    ],
    input: "",
    type: "multiple choice",
    tagalog: "Gaano ka-nababahala tungkol sa iyong hinaharap na karera?",
  },
  {
    question:
      "How strong is your social support system (friends, family, community)?",
    answers: ["None", "Weak", "Moderate", "Strong"],
    input: "",
    type: "multiple choice",
    tagalog:
      "Gaano kalakas ang iyong sistema ng suporta mula sa lipunan (mga kaibigan, pamilya, komunidad)?",
  },
  {
    question:
      "How often do you feel pressured by your peers to do things you wouldn’t normally do?",
    answers: [
      "Never",
      "Rarely",
      "Occasionally",
      "Often",
      "Very Often",
      "Almost Always",
    ],
    input: "",
    type: "multiple choice",
    tagalog:
      "Gaano kadalas kang nakakaranas ng presyur mula sa iyong mga kapantay na gawin ang mga bagay na hindi mo karaniwang ginagawa?",
  },
  {
    question: "How actively do you participate in extracurricular activities?",
    answers: [
      "Not at all",
      "Rarely",
      "Occasionally",
      "Regularly",
      "Very Actively",
      "Extremely Active",
    ],
    input: "",
    type: "multiple choice",
    tagalog:
      "Gaano ka-aktibo ang iyong pakikilahok sa mga extracurricular na aktibidad?",
  },
  {
    question: "How often have you experienced bullying?",
    answers: [
      "Never",
      "Rarely",
      "Occasionally",
      "Often",
      "Very Often",
      "Almost Always",
    ],
    input: "",
    type: "multiple choice",
    tagalog: "Gaano kadalas kang nakakaranas ng pambubully?",
  },
];

export default questions;
