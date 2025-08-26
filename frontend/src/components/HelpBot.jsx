import { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import helpbotApi from "../services/helpbotApi";

function HelpBot() {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const responseRef = useRef(null);

  useEffect(() => {
    if (show && messages.length === 0) {
      setMessages([{ type: "bot", text: "👋 Hello! I'm HelpBot. How can I assist you today?" }]);
    }
  }, [show, messages]);

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput) return;

    setMessages((prev) => [...prev, { type: "user", text: userInput }]);
    setInput("");
    setLoading(true);

    try {
      const res = await helpbotApi.post("/helpbot", { text: userInput });
      const data = res.data;
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.response || "🤖 Sorry, try again?" },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow((prev) => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#344d6e] text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-offside hover:scale-105 transition"
        aria-label="Toggle HelpBot"
      >
        <img
          src={assets.Help}
          alt="Help"
          className="w-10 h-10"
        />
      </button>

      {show && (
        <div
          className="fixed bottom-24 right-6 w-80 max-w-[90vw] bg-white border rounded-2xl shadow-lg flex flex-col z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="bg-[#000080] text-white px-4 py-2 font-offside text-lg">
            HelpBot
          </div>

          {/* Chat Messages */}
          <div
            ref={responseRef}
            className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80 bg-gray-50 font-margarine text-sm"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] px-3 py-2 rounded-lg whitespace-pre-wrap ${
                  msg.type === "bot"
                    ? "bg-blue-100 text-gray-800 self-start"
                    : "bg-[#000080] text-white self-end ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <form onSubmit={handleSubmit} className="flex p-2 gap-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-full font-margarine focus:outline-none focus:ring-2 focus:ring-[#000080]"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-[#000080] hover:text-blue-900 p-2 rounded-full disabled:opacity-50"
              aria-label="Send"
            >
              <img
                className="w-10 h-10"
                src={assets.Send}
                alt="Send"
              />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default HelpBot;
