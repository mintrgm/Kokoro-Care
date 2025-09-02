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
      setMessages([
        { type: "bot", text: "👋 Hello! I'm HelpBot. How can I assist you today?" },
      ]);
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
        className="fixed bottom-6 right-6 w-20 h-20 bg-[#052F5F] text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-offside hover:scale-110 transition z-[9999] border border-white"
        aria-label="Toggle HelpBot"
      >
        <img src={assets.Help} alt="Help" className="w-16 h-16" />
      </button>

      {show && (
        <div
          className="fixed bottom-24 right-6 w-80 max-w-[90vw] bg-[#061328] border border-white rounded-2xl shadow-lg flex flex-col overflow-hidden transition-transform hover:scale-105 z-[9999]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-black text-white px-4 py-2 font-offside text-lg border-b border-white">
            HelpBot
          </div>

          <div
            ref={responseRef}
            className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80 bg-[#0a1a3f] text-white font-margarine text-sm"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className="max-w-[80%] px-3 py-2 rounded-lg whitespace-pre-wrap self-start bg-black text-white border border-white/20 shadow-md"
                style={{
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                  marginLeft: msg.type === "user" ? "auto" : "0",
                  marginRight: msg.type === "user" ? "0" : "auto",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex p-2 gap-2 border-t border-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-full font-margarine focus:outline-none focus:ring-2 focus:ring-white bg-[#0a1a3f] text-white placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-white hover:text-gray-300 p-2 rounded-full disabled:opacity-50"
              aria-label="Send"
            >
              <img className="w-10 h-10" src={assets.Send} alt="Send" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default HelpBot;
