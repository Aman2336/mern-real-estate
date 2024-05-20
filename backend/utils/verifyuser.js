import { errorhandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyuser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorhandler(401, "unauthorized"));
  }

  jwt.verify(token, process.env.jwt_secret, (err, user) => {
    if (err) return next(errorhandler(403, "forbidden"));

    req.user = user;
    //here we got the id of the user in the props (user) and we re sending it to the route user routes and then we'll call update user function
    next();
  });
};

//this function is used to verify user before updating its data
// so as in sign up or login where we create user cookie for its authentication here we also used
//that cookie to verify user to do that we have to install a package of node that is cookie parser which is
// used to parse the cookie attached to the client req object
