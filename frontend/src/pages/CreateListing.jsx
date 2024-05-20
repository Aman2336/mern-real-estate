import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { ref } from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [imguploaderror, setimguploaderror] = useState(false);
  const [uploading, setuploading] = useState(false);
  const [error, seterror] = useState(false);
  const [files, setfiles] = useState([]);
  const [loading, setloading] = useState(false);

  const [formdata, setformdata] = useState({
    imageURLs: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bathrooms: 1,
    bedrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  console.log(formdata);
  // console.log(files);
  const handleimagesubmit = () => {
    //this function will handle to submit the images at backend
    if (files.length > 0 && files.length + formdata.imageURLs.length < 7) {
      setuploading(true);
      setimguploaderror(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeimage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setformdata({
            ...formdata,
            imageURLs: formdata.imageURLs.concat(urls),
          });
          //so here we add new images to the previous one
          setimguploaderror(false);
          setuploading(false);
        })
        .catch(() => {
          setimguploaderror("image upload failed");
        });
    } else {
      setimguploaderror("you can only upload 6 images per listing");
      setuploading(false);
    }
  };
  const storeimage = async (file) => {
    //this is made async because saving images in backend or DB takes time
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const refstorage = ref(storage, filename);
      const uploadtask = uploadBytesResumable(refstorage, file);
      uploadtask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadtask.snapshot.ref).then((downloadurl) => {
            resolve(downloadurl);
          });
        }
      );
    });
  };
  const handleimgdelete = (index) => {
    setformdata({
      ...formdata,
      imageURLs: formdata.imageURLs.filter((_, i) => i !== index),
    });
  };

  const handlechange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setformdata({
        ...formdata,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setformdata({
        ...formdata,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setformdata({
        ...formdata, //this spread operator is used to keep the previous info.
        [e.target.id]: e.target.value, //reason for adding this '[]' is to derefer the variable name not its value
      });
    }
  };

  const handleformsubmit = async (e) => {
    e.preventDefault();
    try {
      if (formdata.imageURLs.length < 1) {
        return seterror("you must upload one image");
      }
      if (+formdata.regularPrice < +formdata.discountPrice) {
        //'+' is used to specify that these are numbers
        return seterror("discount price must be less than regular price");
      }
      setloading(true);
      seterror(false);

      const res = await fetch("backend/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formdata,
          userRef: currentUser._id,
        }), //this is giving error because this page doesnt know about user hence we have to send a user ref with formdata
      });
      const data = await res.json();
      setloading(false);
      if (data.success === false) {
        seterror(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      seterror(error.message);
      setloading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        onSubmit={handleformsubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            onChange={handlechange}
            value={formdata.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handlechange}
            value={formdata.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handlechange}
            value={formdata.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="sale"
                onChange={handlechange}
                checked={formdata.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="rent"
                onChange={handlechange}
                checked={formdata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="parking"
                onChange={handlechange}
                checked={formdata.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="furnished"
                onChange={handlechange}
                checked={formdata.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                className="w-5"
                type="checkbox"
                id="offer"
                onChange={handlechange}
                checked={formdata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg"
                onChange={handlechange}
                value={formdata.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg"
                onChange={handlechange}
                value={formdata.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000000"
                required
                className="p-3 border-gray-300 rounded-lg"
                onChange={handlechange}
                value={formdata.regularPrice}
              />
              <div className="flex flex-col  items-center">
                <p>Regular Price</p>
                <span className="text-xs">(Rs. / month)</span>
              </div>
            </div>
            {formdata.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="1000000000"
                  required
                  className="p-3 border-gray-300 rounded-lg"
                  onChange={handlechange}
                  value={formdata.discountPrice}
                />
                <div className="flex flex-col  items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">(Rs. / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              the first image will be the cover (max. 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setfiles(e.target.files);
              }}
              className="p-3 border border-grey-700 rounded-lg w-full"
              type="file"
              id="images"
              accept="images/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleimagesubmit}
              className="p-3 text-green-500 border border-green-500 rounded uppercase hover:opacity-95 disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
              {/* here we specify that this is button's type
              because we have created it inside the form as its element
              so when we click on this we wont submit the entire form */}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imguploaderror ? imguploaderror : ""}
          </p>
          {formdata.imageURLs.length > 0 &&
            formdata.imageURLs.map((url, index) => (
              <div
                key={url}
                className="border items-center flex justify-between p-3 "
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleimgdelete(index)}
                  className="p-3 text-red-700 rounded-lg hover:opacity-75"
                >
                  {/* we have made this func as call back because we want to delete after clicking on delete not everytime when we click upload */}
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-blue-500 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-85"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
