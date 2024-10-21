// handling user requests
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";
const saltRounds = 10;

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking all fields
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // validating email
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
    }

    // check if email already exists
    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // hashing strong password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    if (token) {
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (isMatchPassword) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser };
