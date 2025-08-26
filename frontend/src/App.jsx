import { Routes, Route, useLocation } from "react-router-dom";
import {
  About,
  Doctors,
  Home,
  Login,
  Baymax,
  MyProfile,
  MyAppointments,
  Appointment,
} from "./pages";
import { Navbar, Footer } from "./components";
import HelpBot from "./components/HelpBot";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();

  const hideHelpBot = ["/login"].includes(location.pathname);
  const hideFooter = location.pathname === "/baymax";

  const containerClasses =
    location.pathname === "/baymax" ? "mx-0" : "mx-5 sm:mx-[10%]";

  return (
    <div className={`${containerClasses}`}>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/baymax" element={<Baymax />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>
      {!hideHelpBot && <HelpBot />}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;
