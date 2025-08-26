const authAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authAdmin;
