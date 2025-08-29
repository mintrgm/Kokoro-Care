import { useState, useEffect, useRef } from "react";
import { FaSpinner, FaInfoCircle } from "react-icons/fa";
import baymaxApi from "../services/baymaxApi";
import Welcome from "../components/Welcome";
import { assets } from "../assets/assets";
import axios from "axios";
import HistoryPopup from "../components/HistoryPopup";

function Baymax() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const fileInputRef = useRef(null);

  const currentUser = { _id: "123" };

  const handleNewChat = () => {
    if (messages.length > 0) {
      saveChatToDB(messages);
      setChatHistory((prev) => [
        ...prev,
        { id: Date.now(), messages, timestamp: new Date().toLocaleString() },
      ]);
    }
    setMessages([]);
    inputRef.current?.focus();
  };

  const toggleHistoryPopup = () => {
    setShowHistoryPopup((prev) => !prev);
  };

  const handleViewHistory = (historyMessages) => {
    setMessages(historyMessages);
    setShowHistoryPopup(false);
  };

  useEffect(() => {
    setInitialRender(false);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await baymaxApi.post("/api/chat", { query: currentInput });
      const botMessage = { text: response.data.answer, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API error:", error);
      const errorMessage = {
        text: "Sorry, I encountered an error processing your request.",
        sender: "bot",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSubmit(), 100);
  };

  const handleClearChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  const saveChatToDB = async (messages) => {
    try {
      const res = await axios.post("http://localhost:8000/api/baymax/save-chat", {
        userId: currentUser._id,
        chat: messages,
      });
      console.log("Chat saved:", res.data);
    } catch (err) {
      console.error("Failed to save chat", err);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log("Selected files:", files);
  };

  return (
    <>
      <style>{`
        @keyframes messageAppear {
          from {opacity: 0; transform: translateY(10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        @keyframes pulse-slow {
          0%, 100% {opacity: 1;}
          50% {opacity: 0.6;}
        }
        @keyframes pulse {
          0%, 100% {opacity: 0.4; transform: scale(1);}
          50% {opacity: 1; transform: scale(1.2);}
        }

        /* Hover zoom effect for icons */
        .icon-btn img,
        .icon-btn svg {
          transition: transform 0.2s ease-in-out;
        }
        .icon-btn:hover img,
        .icon-btn:hover svg {
          transform: scale(1.1);
        }
      `}</style>

      <div className="min-h-screen flex flex-col relative overflow-hidden pt-8">
        <img
          src={assets.Baymax3}
          alt="Baymax Left"
          className="hidden md:block absolute left-[-50px] bottom-0 z-10 w-32 md:w-48 lg:w-60"
        />
        <img
          src={assets.Baymax2}
          alt="Baymax Right"
          className="hidden md:block absolute right-4 bottom-24 z-10 w-32 md:w-48 lg:w-60 scale-x-[-1]"
        />
        <div
          className="fixed inset-0 z-[-1] bg-cover bg-center"
          style={{ backgroundImage: `url(${assets.Bg})` }}
        />

        <div className="flex flex-col flex-1 relative w-full h-full max-w-5xl mx-auto">
          <div
            className="absolute rounded-full filter blur-[50px] opacity-15 z-[-1]"
            style={{
              backgroundColor: "#0ea5e9",
              width: "300px",
              height: "300px",
              top: "-150px",
              right: "-100px",
            }}
          />
          <div
            className="absolute rounded-full filter blur-[50px] opacity-15 z-[-1]"
            style={{
              backgroundColor: "#10b981",
              width: "250px",
              height: "250px",
              bottom: "-100px",
              left: "-50px",
            }}
          />

          <header className="text-center mb-8 relative z-10">
            <div className="flex justify-center mb-4">
              <img
                src={assets.Baymax0}
                alt="BAYMAX! Logo"
                className="w-52 md:w-[400px]"
              />
            </div>
            <p className="font-margarine text-center text-lg text-white">
              Your Personal Health Care Companion
            </p>
          </header>

          <main
            ref={chatContainerRef}
            className={`flex flex-col h-[80vh] backdrop-blur-sm bg-white/90 border-4 border-gray-600 rounded-2xl transition-opacity duration-300 font-margarine ${
              initialRender ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="border-b border-gray-200 p-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div
                  className="relative w-20 h-20 rounded-full overflow-hidden bg-white shadow-lg animate-[pulse-slow_3s_ease-in-out_infinite]"
                  style={{ border: "4px solid #60a5fa" }}
                >
                  <img
                    src={assets.Baymax1}
                    alt="Baymax Profile"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className="absolute inset-[-6px] rounded-full pointer-events-none"
                    style={{
                      boxShadow:
                        "0 0 8px 4px rgba(59, 130, 246, 0.7), 0 0 12px 8px rgba(59, 130, 246, 0.3)",
                      opacity: 0.7,
                      animation: "pulse-slow 3s ease-in-out infinite",
                      zIndex: -1,
                    }}
                  />
                </div>
                <span className="font-offside text-xl text-gray-900">Baymax</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleNewChat}
                  title="New Chat"
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition icon-btn"
                >
                  <img src={assets.New} alt="New Chat" className="w-12 h-12" />
                </button>
                <button
                  onClick={toggleHistoryPopup}
                  title="Chat History"
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition icon-btn"
                >
                  <img src={assets.History} alt="History" className="w-12 h-12" />
                </button>
                <button
                  onClick={handleClearChat}
                  disabled={messages.length === 0}
                  title="Clear conversation"
                  className="p-2 rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-700 hover:bg-gray-100 transition icon-btn"
                >
                  <img src={assets.Delete} alt="Clear Chat" className="w-12 h-12" />
                </button>
              </div>
            </div>

            <div
              className="flex-grow overflow-y-auto p-4 space-y-2 bg-white border border-gray-300 rounded"
              style={{ overscrollBehavior: "contain" }}
            >
              {messages.length === 0 ? (
                <Welcome onSelectQuestion={handleSelectQuestion} />
              ) : (
                messages.map((message, index) => {
                  const isUser = message.sender === "user";
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-2 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                      style={{ animation: "messageAppear 0.3s ease forwards" }}
                    >
                      {!isUser && (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 shadow">
                          <img
                            src={assets.Baymax1}
                            alt="Baymax"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div
                        className={`max-w-[70%] px-4 py-2 text-sm leading-snug relative ${
                          isUser
                            ? "rounded-[18px_18px_4px_18px] bg-gradient-to-br from-sky-500 to-blue-800 text-white shadow-md"
                            : "rounded-[18px_18px_18px_4px] bg-gray-100 text-gray-800 border-l-4 border-emerald-500"
                        } ${
                          message.isError
                            ? "bg-red-100 text-red-700 border border-red-300"
                            : ""
                        }`}
                      >
                        {message.text}
                      </div>

                      {isUser && (
                        <div className="relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden shadow">
                          <img
                            src={assets.Linux}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                          <span
                            className="absolute inset-0 rounded-full pointer-events-none"
                            style={{
                              boxShadow:
                                "0 0 8px 4px rgba(56, 189, 248, 0.7), 0 0 12px 8px rgba(2, 132, 199, 0.3)",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {isLoading && (
                <div className="flex items-start gap-2 justify-start">
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-lg animate-[pulse_1.5s_ease-in-out_infinite]"
                    style={{ border: "2px solid #3b82f6" }}
                  >
                    <img
                      src={assets.Baymax1}
                      alt="Baymax"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="max-w-[70%] px-4 py-2 text-sm rounded-[18px_18px_18px_4px] bg-gray-100 text-gray-800 border-l-4 border-emerald-500 relative">
                    <div className="flex justify-center items-center gap-1">
                      <span
                        className="inline-block h-2 w-2 rounded-full bg-emerald-500 opacity-40 animate-[pulse_1s_infinite_ease-in-out]"
                        style={{ animationDelay: "0s" }}
                      />
                      <span
                        className="inline-block h-2 w-2 rounded-full bg-emerald-500 opacity-40 animate-[pulse_1s_infinite_ease-in-out]"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="inline-block h-2 w-2 rounded-full bg-emerald-500 opacity-40 animate-[pulse_1s_infinite_ease-in-out]"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} style={{ height: 0 }} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white border-t border-gray-200 rounded-2xl"
            >
              <div className="relative flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/gif, image/bmp, image/webp, image/svg+xml, application/pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                <button
                  type="button"
                  onClick={handleUploadClick}
                  title="Upload Image"
                  className="flex-shrink-0 p-2 hover transition icon-btn"
                >
                  <img src={assets.Upload} alt="Upload" className="w-8 h-8" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Beep boop… awaiting your health query..."
                  className="flex-grow pr-14 font-margarine bg-white h-12 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  disabled={isLoading}
                  style={{ minWidth: 0 }}
                />
                <button
                  type="submit"
                  disabled={isLoading || input.trim() === ""}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-transform duration-200 ease-in-out text-primary-600 hover:scale-110 will-change-transform disabled:cursor-not-allowed disabled:opacity-50 icon-btn"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" size={18} />
                  ) : (
                    <img src={assets.Send} alt="Send" className="w-10 h-10" />
                  )}
                </button>
              </div>
            </form>
          </main>

          {showHistoryPopup && (
            <HistoryPopup
              userId={currentUser._id}
              onClose={toggleHistoryPopup}
              onSelectChat={(chatMessages) => {
                setMessages(chatMessages);
              }}
            />
          )}

          <footer className="py-4 text-center text-gray-500">
            <div className="flex items-center justify-center gap-1 mb-2">
              <FaInfoCircle size={14} />
              <p className="text-sm font-margarine text-white">
                Not a substitute for professional medical advice, diagnosis, or
                treatment.
              </p>
            </div>
            <p className="text-sm font-offside text-white">
              © {new Date().getFullYear()} Baymax (Medical Assistant) | Developed
              by{" "}
              <a
                href="https://www.linkedin.com/in/manita-thapa-90376718b/"
                className="underline hover:text-blue-400"
              >
                Manita Thapa
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Baymax;
