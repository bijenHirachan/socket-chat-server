import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Conversation } from "../models/Conversation.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendToken } from "../utils/sendToken.js";

export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.user._id } });

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getMyProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  return res.status(200).json({
    success: true,
    user,
  });
});

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(new ErrorHandler("Email has already been taken!", 409));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken("User registered successfully!", user, res, 201);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("All fields are required!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("User doesn't exist!", 404));

  const isMatch = await user.comparePasswords(password);

  if (!isMatch) return next(new ErrorHandler("Invalid credentials!", 400));

  sendToken("Logged in successfully!", user, res, 200);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged out successfully!",
    });
});
