import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formdata, setformdata] = useState({});
  //hook form change in data and for submitting that data
  const navigate = useNavigate();
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value, //here spread is use to add or update the current object
    });
  };
  const handlesubmit = async (e) => {
    e.preventDefault(); //to prevent refreshing the page everytime we submit the form
    try {
      setloading(true);
      const res = await fetch("/backend/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      //here we created a proxy for post request
      const data = await res.json();
      if (data.success == false) {
        seterror(data.message);
        setloading(false);
        return;
      }
      setloading(false);
      seterror(null);
      navigate("/login");
    } catch (error) {
      seterror(error.message);
      setloading(false);
    }
  };
  console.log(formdata);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-medium my-8">Sign Up</h1>
      <form onSubmit={handlesubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handlechange}
        />
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
          {loading ? "loading..." : "Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/login"}>
          <span className="text-blue-600">Login</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
