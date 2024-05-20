import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { loginsuccess } from "../redux/user/userslice.js";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const handlegoogleclick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const res = await fetch("backend/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(loginsuccess(data));
      navigate("/")

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={handlegoogleclick}
      type="button"
      className="bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
}

//firebase for google authentication
