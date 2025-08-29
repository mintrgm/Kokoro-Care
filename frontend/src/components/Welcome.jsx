import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import {
  FaLightbulb,
  FaHeartbeat,
  FaShieldAlt,
  FaNotesMedical,
} from "react-icons/fa";

const sampleQuestions = [
  "What are the symptoms of diabetes?",
  "How can I reduce my blood pressure naturally?",
];

const Welcome = ({ onSelectQuestion }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full text-center px-4 py-6 overflow-y-auto">
      <div
        className="blob-decoration opacity-10"
        style={{ top: "50px", right: "50px" }}
      ></div>
      <div
        className="blob-decoration opacity-10"
        style={{ bottom: "50px", left: "50px" }}
      ></div>

      <div
        className={`transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-500 shadow-lg">
              <img
                src={assets.Baymax1}
                alt="Baymax"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-70"></div>
          </div>
        </div>

        <h2 className="text-3xl font-display font-bold text-text-primary mb-3">
          <span className="font-offside">BAYMAX</span>
        </h2>

      <p className="font-margarine">
        I was immediately alerted when you clicked this chatbot. Suspicious... but I’m here to help! Ask me your health questions. I use trustworthy sources, zero sketchiness.
        <br /><br />
        I’m not a doctor (just extremely huggable), so for serious stuff, talk to a real human.
        <br /><br />
        <em>Now... on a scale of 1 to 10, how would you rate your curiosity?</em>
      </p>

      </div>

      <div className="w-full max-w-2xl mt-6">
        <div className="flex items-center mb-5 justify-center gap-2">
          <FaLightbulb className="text-amber-500" />
          <h3 className="font-offside text-lg">Try asking about...</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
          {sampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onSelectQuestion(question)}
              className={`floating-card group text-left font-offside p-4 border border-light-border bg-white rounded-xl hover:border-primary-300 transition-all shadow-sm hover:shadow-custom ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                {getIcon(index)}
                <span className="group-hover:text-primary-600 transition-colors">
                  {question}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, description }) => (
  <div className="bg-white p-4 rounded-lg border border-light-border text-center shadow-sm">
    <div className="flex justify-center mb-2">
      <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
    </div>
    <h3 className="font-medium mb-1">{title}</h3>
    <p className="text-sm text-text-secondary">{description}</p>
  </div>
);

const getIcon = (index) => {
  const iconClasses =
    "flex-shrink-0 p-2 rounded-full bg-primary-50 text-primary-600";

  switch (index % 5) {
    case 0:
      return <FaHeartbeat className={iconClasses} />;
    case 1:
      return <FaShieldAlt className={iconClasses} />;
    case 2:
      return <FaNotesMedical className={iconClasses} />;
    case 3:
      return <FaLightbulb className={iconClasses} />;
    default:
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-500 shadow-sm">
          <img
            src={assets.Baymax1}
            alt="Baymax"
            className="w-full h-full object-cover"
          />
        </div>
      );
  }
};

export default Welcome;
