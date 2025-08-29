import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full flex flex-col lg:flex-row items-center overflow-hidden z-10"
      style={{
        height: "100vh",
        background: "linear-gradient(to top, #090A0A, #111720)",
      }}
    >
      <img
        src={assets.Card}
        alt="Card"
        className="absolute top-0 left-0 w-full h-[95%] object-cover z-0 opacity-60" 
      />

      <div
        className="flex-1 z-10 flex flex-col justify-center max-w-[70rem] p-6 sm:p-10 md:p-14 lg:p-16"
        style={{ marginLeft: "90px", marginTop: "40px" }} 
      >
        <p className="text-[14px] sm:text-[8px] font-electrolize text-[#BAE7FF] mb-6">
Creating an account on our platform is more than just entering your details—it’s your first step toward a smoother, smarter, and stress-free healthcare experience. In today’s busy world, where even finding time for yourself can feel like a challenge, managing doctor visits shouldn’t add to the chaos. That’s where we step in. With one simple account, you’ll unlock a world of convenience designed to put your health at the center of everything.
When you create an account, you’re not just signing up—you’re creating your personal health hub. Think of it as your own medical diary, only smarter, safer, and always within reach. Gone are the days of scattered papers, forgotten phone numbers, and the never-ending search for “that one doctor’s card you had somewhere.” With your account, all your doctors, specialists, and appointments live in one secure, organized space. Need to book a cardiologist? Done in a few clicks. Want to check your upcoming appointment with your dermatologist? It’s right there in your dashboard.
But that’s not all. Your account doesn’t just help you book—it helps you manage your health with confidence. You can track your past appointments, view your upcoming ones, and stay on top of your healthcare without the stress of keeping notes or relying on memory. Whether it’s a routine check-up, a follow-up visit, or a consultation with a new specialist, everything you need is neatly recorded for your convenience. No more “Didn’t I already see a doctor for this?” moments. Your account keeps it all clear.
We also know that life doesn’t always go as planned. Sometimes you need to reschedule, cancel, or even look for a new doctor at the last minute. With your account, making changes is simple and stress-free. Instead of waiting on hold or running into scheduling conflicts, you can handle everything online in just a few taps—freeing you up to focus on what really matters: feeling better.
Security and privacy are just as important to us as convenience. Your account is built with advanced safeguards to ensure that your health information is always safe. Only you can access your details, so you can feel confident knowing your medical history and personal data are protected.
And let’s not forget—healthcare should feel human. That’s why your account isn’t just about organization; it’s about connection. It connects you with the right doctors, the right specialists, and the right care when you need it most. It’s your shortcut to healthier days, smarter choices, and peace of mind.
So why wait? Creating an account takes only a minute, but the benefits will stay with you for the long run. It’s your health, your schedule, your doctors—organized in one place, accessible anytime. Start today, and take the first step toward a simpler, brighter, and healthier tomorrow.        </p>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="bg-[#00233A] text-[#BAE7FF] px-6 py-3 rounded-full border-2 border-[#BAE7FF] hover:bg-[#BAE7FF] hover:text-[#00233A] transition-all duration-300 font-semibold mb-6 ml-96 mt-2 focus:outline-none" 
        >
          Create Account
        </button>

        <div className="flex justify-start ml-28 -mt-2">
          <img
            src={assets.Hand}
            alt="hand pointing"
            className="w-80 h-80 object-contain" 
          />
        </div>
      </div>

      <div className="hidden lg:block relative z-10" style={{ width: "600px", marginLeft: "auto", marginRight: "70px" }}>
        <img
          src={assets.Robot}
          alt="robot"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Banner;
