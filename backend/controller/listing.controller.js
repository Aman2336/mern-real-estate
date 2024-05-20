import User from "../models/user.model.js";
import { errorhandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js";

export const createlisting = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
};

export const deletelisting = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorhandler(403, "listing not found "));
  }

  if (req.user.id !== listing.userRef) {
    return next(
      errorhandler(401, "you can delete listing of your own account")
    );
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatelisting = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorhandler(403, "listing not found "));
  }

  if (req.user.id !== listing.userRef) {
    return next(
      errorhandler(401, "you can update listing of your own account")
    );
  }

  try {
    const updatedlisting = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      // $set: {
      //   username: req.body.username,
      //   email: req.body.email,
      //   password: req.body.password,
      //   photo: req.body.photo,
      // },
      //here we use set because there might be a chance the info that is neede to be changed is incomplete like in model only pass. has to change
      //hence set will check which data is going to change and act on that data only and ignore the unchanged one as it is
      { new: true }
    );
    res.status(200).json(updatedlisting);
  } catch (error) {
    next(error);
  }
};

export const getlisting = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorhandler(403, "listing not found "));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getlistings = async (req, res, next) => {
  //this searching of api route is the more imp/difficult/complicated part of the project
  //as wen want every aspect/attr. for a listing to be searched according as per the user
  try {
    //basically we just want to parse the URL/query to determine what the user wants to search
    const limit = parseInt(req.query.limit) || 9;
    const startindex = parseInt(req.query.startindex) || 0;
    let offer = req.query.offer;

    //basically when the user is int the home page by default
    // the offer and other properties will be undefined hence we check for them and return the specified results
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }

    let searchterm = req.query.searchterm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      //here regex is built in mongodb where its enables searching on every word of searchterm
      //here options 'i' means considere both upper case and lower case
      name: { $regex: searchterm, $options: "i" },
      offer,
      type,
      furnished,
      parking,
    }).sort({ [sort]: order }).limit(limit).skip(startindex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
