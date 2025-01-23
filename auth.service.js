import {User} from "./userModel.js"
import jwt from "jsonwebtoken"

const generateToken = (id, secret, expiresIn) => {
    return jwt.sign({ id }, secret, { expiresIn });
  };

export const registerUser = async (
    req
  )=> {
    if (req) {
      const { email, password } = req;
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        throw new Error("User already exists.");
      }
  
      const newUser = new User({ email, password });
      await newUser.save();
  
      return {newUser};
    }
    return undefined;
  };


export const loginUser = async (
    req, res
  ) => {
    if (req) {
      const { email, password } = req;
  
      const existingUser = await User.findOne({ email });
  
      if (!existingUser) {
        throw new Error("Invalid credentials.");
      }
  
      const  JWT_SECRET  = process.env.JWT_SECRET;
  
      const accessToken = generateToken(
        existingUser._id,
        JWT_SECRET,
        "59m"
      );
  
      const refreshToken = generateToken(
        existingUser._id,
        JWT_SECRET,
        "7d"
      );
  
      res.cookie("accessToken", accessToken, {
        httpOnly: true, // Prevent access via JavaScript
        secure: process.env.NODE_ENV === "production", // Secure cookie in production
        sameSite: "None", // Prevent CSRF
        maxAge: 60 * 60 * 1000, // 1 hour
      });
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevent access via JavaScript
        secure: process.env.NODE_ENV === "production", // Secure cookie in production
        sameSite: "None", // Prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      });
  
      await existingUser.save();
  
      const userObject = existingUser.toObject();
      
      return { userObject};
    }
    return undefined;
  };