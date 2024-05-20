import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorhandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
export const test = (req, res) => {
  res.json({
    message: "test backend",
  });
};
export const updateuser = async (req, res, next) => {
  //first here we compare whether the id we recieve from verify user is correct or not(i.e matches with parameter id)
  if (req.user.id !== req.params.id) {
    return next(errorhandler(407, "you can update ur own account"));
  }
  try {
    if (req.body.password) {
      //if request for updating password
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    //now update the user pass
    const updateduser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          photo: req.body.photo,
        },
        //here we use set because there might be a chance the info that is neede to be changed is incomplete like in model only pass. has to change
        //hence set will check which data is going to change and act on that data only and ignore the unchanged one as it is
      },
      { new: true }
    );
    const { password, ...rest } = updateduser._doc;
    res.status(202).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteuser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorhandler(405, "you can delete only ur own account"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");

    res.status(200).json({ message: "user has been deleted!!" });
  } catch (error) {
    next(error);
  }
};

export const getuserlistings = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorhandler(405, "you can view only ur own account"));
  } else {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error); //middleware
    }
  }
};
export const getuser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorhandler(404, "user not found"));
    }

    const { password: pass, ...rest } = user._doc;
    //for security reasons we re changing password or sperating it from response
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};
