import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginstart,
  loginfailure,
  loginsuccess
} from "../redux/user/userslice.js";
import OAuth from "../components/OAuth.jsx";


const Login = () => {
  const [formdata, setformdata] = useState({});
  //hook form change in data and for submitting that data
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [error, seterror] = useState(null);
  // const [loading, setloading] = useState(false);
  const {loading,error} = useSelector((state)=>state.user);

  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value, //here spread is use to add or update the current object
    });
  };
  const handlesubmit = async (e) => {
    e.preventDefault(); //to prevent refreshing the page everytime we submit the form
    try {
      dispatch(loginstart());
      const res = await fetch("/backend/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      //here we created a proxy for post request
      const data = await res.json();
      if (data.success == false) {
        dispatch(loginfailure(data.message));
        return;
      }
      dispatch(loginsuccess(data))
      navigate("/");
    } catch (error) {
      dispatch(error.message);
    }
  };
  console.log(formdata);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-medium my-8">Login</h1>
      <form onSubmit={handlesubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handlechange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handlechange}
        />
        <button
          disabled={loading}
          className="bg-gray-600 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? "loading..." : "Login"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-600">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default Login;
