import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  FaBath,
  FaChair,
  FaParking,
  FaBed,
  FaMapMarkerAlt,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact.jsx";
export default function Listing() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  SwiperCore.use([Navigation]);
  const [listing, setlisting] = useState(null);
  const [loading, setloading] = useState(true); //after the data is loaded we set this to false
  const [error, seterror] = useState(false);
  const [copied, setcopied] = useState(false);
  const [contact, setcontact] = useState(false);
  
  useEffect(() => {
    const fetchlisting = async () => {
      try {
        setloading(true);
        const res = await fetch(`/backend/listing/get/${params.listingid}`);
        const data = await res.json();
        if (data.success === false) {
          seterror(true);
          setloading(false);
          return;
        }
        setlisting(data);
        setloading(false);
        seterror(false);
      } catch (error) {
        seterror(true);
        setloading(false);
      }
    };

    fetchlisting();
  }, [params.listingid]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">loading....</p>}
      {error && (
        <p className="text-center my-7 text-2xl">something went wrong!</p>
      )}
      {listing && console.log(listing)}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageURLs.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setcopied(true);
                setTimeout(() => {
                  setcopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100">
              Link copied!
            </p>
          )}
          {listing && (
            <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
              <p className=" text-2xl font-semibold">
                {listing.name}- Rs.{" "}
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}
                {listing.type === "rent" && "/month"}
              </p>
              <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
                <FaMapMarkerAlt className="text-green-700" />
                {listing.address}
              </p>
              <div className="flex gap-4">
                <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
                {listing.offer && (
                  <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    Rs.{+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>
              <p className="text-slate-800">
                <span className="font-semibold text-black">Description - </span>
                {listing.description}
              </p>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaBed className="text-lg" />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds `
                    : `${listing.bedrooms} bed `}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaBath className="text-lg" />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths `
                    : `${listing.bathrooms} bath `}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaParking className="text-lg" />
                  {listing.parking ? "Parking spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaChair className="text-lg" />
                  {listing.furnished ? "Furnished" : "Not furnished"}
                </li>
              </ul>
              {currentUser &&
                listing.userRef !== currentUser._id &&
                !contact && (
                  // here we are checking whether this listing is belong to current user if yes we wont show the button
                  <button
                    onClick={() => setcontact(true)}
                    className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                  >
                    Contact Landlord
                  </button>
                )}
                {contact && <Contact listing ={listing}/>}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
