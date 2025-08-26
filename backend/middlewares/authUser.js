const authUser = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.id) {
    return next();
  }
  console.log("Unauthorized access:", req.session);
  return res.status(401).json({ success: false, message: "Not Authorized. Please login." });
};

export default authUser;
