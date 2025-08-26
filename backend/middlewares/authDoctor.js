const authDoctor = (req, res, next) => {
  console.log("=== Session Check ===");
  console.log("Session:", req.session);
  console.log("Doctor ID in session:", req.session?.doctorId);

  if (req.session && req.session.doctorId) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Unauthorized access. Session not found or missing user",
      session: req.session, 
    });
  }
};

export default authDoctor;
