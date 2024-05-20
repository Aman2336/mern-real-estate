import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateuserfailure,
  updateuserstart,
  updateusersuccess,
  deleteuserfailure,
  deleteuserstart,
  deleteusersuccess,
  signoutfailure,
  signoutstart,
  signoutsuccess,
} from "../redux/user/userslice.js";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
// import { current } from "@reduxjs/toolkit";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setfile] = useState(undefined);
  const [fileperc, setfileperc] = useState(0);
  const [formdata, setformdata] = useState({});
  const fileref = useRef(null);
  const [fileerror, setfileerror] = useState(false);
  const [updatesuccess, setupdatesuccess] = useState(false);
  const [showlisterror, setshowlisterror] = useState(false);
  const [userlistings, setuserlistings] = useState([]);

  const dispatch = useDispatch();
  console.log(formdata);
  useEffect(() => {
    if (file) {
      handlefileupload(file);
    }
  }, [file]);

  const handlefileupload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const refstorage = ref(storage, filename);
    const uploadtask = uploadBytesResumable(refstorage, file);
    //track of upload in %
    uploadtask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfileperc(Math.round(progress));
      },
      (error) => {
        setfileerror(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadtask.snapshot.ref).then((downloadurl) =>
          setformdata({ ...formdata, photo: downloadurl })
        );
      }
    );
  };

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value });
    //here we are getting the changed data in our form data so that we can send this to our backend
    // to update the user info in database
  };

  const handlesubmit = async (e) => {
    //the stored info in form data is now going to send in the backend using the same method we used in login
    e.preventDefault(); //prevents refereshing the page
    try {
      dispatch(updateuserstart());
      const res = await fetch(`/backend/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateuserfailure(data.message));
        return;
      }
      dispatch(updateusersuccess(data));
      setupdatesuccess(true);
    } catch (err) {
      dispatch(updateuserfailure(err.message));
    }
  };

  const handledelete = async () => {
    try {
      dispatch(deleteuserstart());
      const res = await fetch(`/backend/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteuserfailure(data));
        return;
      }
      dispatch(deleteusersuccess(data));
    } catch (error) {
      dispatch(deleteuserfailure(error.message));
    }
  };

  const handlesignout = async () => {
    try {
      dispatch(signoutstart());
      const res = await fetch("backend/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutfailure(data.message));
        return;
      }
      dispatch(signoutsuccess(data));
    } catch (error) {
      dispatch(signoutfailure(error.message));
    }
  };

  const handleshowlistings = async () => {
    try {
      setshowlisterror(false);
      const res = await fetch(`/backend/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setshowlisterror(true);
        return;
      }
      setuserlistings(data);
    } catch (error) {
      setshowlisterror(true);
    }
  };
  const handledeletelisting = async (listingid) => {
    try {
      const res = await fetch(`/backend/listing/delete/${listingid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      //here we are using this state because after deleting we want to show those listings that exists otherwise it will give error
      
      setuserlistings((prev) =>
        prev.filter((listing) => listing._id !== listingid)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-medium text-center my-7">Profile</h1>
      <form onSubmit={handlesubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            setfile(e.target.files[0]);
          }}
          type="file"
          ref={fileref}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => {
            fileref.current.click();
          }}
          src={formdata.photo || currentUser.photo}
          alt="profile"
          className="self-center mt-2 rounded-full h-24 w-24 object-cover cursor-pointer"
        />
        <p className="text-center">
          {fileerror ? (
            <span className="text-blue-700">Error occured</span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className="text-green-700">{`Uploading ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className="text-green-700">Upload Complete</span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handlechange}
        />
        <input
          id="email"
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handlechange}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handlechange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          {loading ? "loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover : opacity-95"
          to={"/create-listing"}
        >
          Create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handledelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handlesignout} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5 text-center">{error ? error : ""}</p>
      <p className="text-green-700 mt-5 text-center">
        {updatesuccess ? "Profile updated successfully" : ""}
      </p>
      <button onClick={handleshowlistings} className="text-blue-700 w-full">
        Show Listings
      </button>
      <p className="text-red-600 mt-5">
        {showlisterror ? "error showing listings" : ""}
      </p>
      {userlistings && userlistings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-xl font-semibold">
            Your Listings
          </h1>
          {userlistings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex gap-4 justify-between items-center"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageURLs[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="flex-1 text-slate-700 font-semibold  hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col">
                <button
                  onClick={() => handledeletelisting(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
