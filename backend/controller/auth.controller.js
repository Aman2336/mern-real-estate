import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashpassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashpassword });
  try {
    await newUser.save();
    res.status(201).json("User created Successfully");
  } catch (err) {
    next(errorhandler(500, "error"));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validuser = await User.findOne({ email });
    //here both key and value are same so after ES6 we can write only one of them {key :value} => {key}
    if (!validuser) {
      return next(errorhandler(404, "Invalid user"));
    }

    const validpassword = bcryptjs.compareSync(password, validuser.password);
    //here we use compaseSync because we used hashed password from bcrypt.js
    if (!validpassword) {
      return next(errorhandler(406, "Incorrect credentials"));
    }
    const token = jwt.sign({ id: validuser._id }, process.env.jwt_secret);
    const { password: pass, ...rest } = validuser._doc; //because password is in 'doc';
    //imp to understand cookie
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest); //we dont want the password in token we created
  } catch (error) {
    next(error);
  }
};
// now we'll use cookie for authentications by use jwt(json web token) package ,Authentication: When a user logs in to a system, the server generates a JWT containing a set of claims (or pieces of information) about the user, such as their user ID, username, or any other relevant data. This JWT is then sent to the client (typically in the form of an HTTP response).

export const google = async (req, res, next) => {
  try {
    const validuser = await User.findOne({ email: req.body.email });
    if (validuser) {
      const token = jwt.sign({ id: validuser._id }, process.env.jwt_secret);
      const { password: pass, ...rest } = validuser._doc; //because password is in 'doc';
      //imp to understand cookie
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest); //we dont want the password in token we created
    } else {
      const generatedpassword = Math.random().toString(36).slice(-8);
      //when we use google auth we don't get any password we have to generate a new one(random)
      const hashpassword = bcryptjs.hashSync(generatedpassword, 10);
      const newuser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashpassword,
        photo: req.body.photo,
      });
      //username should be with no gaps and must be unique that's why we've converted the username
      await newuser.save();
      const token = jwt.sign({ id: validuser._id }, process.env.jwt_secret);
      const { password: pass, ...rest } = validuser._doc; //because password is in 'doc';
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (err) {
    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('user has been logged out');
  } catch (error) {
    next(error);
  }
};
