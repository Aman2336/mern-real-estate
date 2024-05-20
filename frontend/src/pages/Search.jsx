import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
export default function Search() {
  const [loading, setloading] = useState(false);
  const [listings, setlistings] = useState([]);
  const [showmore, setshowmore] = useState(false);
  const [sidebardata, setsidebardata] = useState({
    searchterm: "",
    type: "all",
    parking: false,
    offer: false,
    furnished: false,
    sort: "created_at",
    order: "desc",
  });
  const navigate = useNavigate();

  // console.log(sidebardata);
  console.log(listings);
  const handlechange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      //this basically helps to check the type and retaining the rest info as it is '...'
      setsidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchterm") {
      setsidebardata({ ...sidebardata, searchterm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setsidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
      //these value can be string or boolean hence we checked for both and,
      //[e.target.id] is basically because we have offer ,furnished and parking of same type
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setsidebardata({ ...sidebardata, sort, order });
    }
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams();
    urlparams.set("searchterm", sidebardata.searchterm);
    urlparams.set("type", sidebardata.type);
    urlparams.set("parking", sidebardata.parking);
    urlparams.set("offer", sidebardata.offer);
    urlparams.set("furnished", sidebardata.furnished);
    urlparams.set("sort", sidebardata.sort);
    urlparams.set("order", sidebardata.order);
    const searchquery = urlparams.toString();
    navigate(`/search?${searchquery}`);
  };

  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const searchtermfromurl = urlparams.get("searchterm");
    const typefromurl = urlparams.get("type");
    const parkingfromurl = urlparams.get("parking");
    const offerfromurl = urlparams.get("offer");
    const furnishedfromurl = urlparams.get("furnished");
    const sortfromurl = urlparams.get("sort");
    const orderfromurl = urlparams.get("order");

    if (
      searchtermfromurl ||
      typefromurl ||
      parkingfromurl ||
      offerfromurl ||
      furnishedfromurl ||
      sortfromurl ||
      orderfromurl
    ) {
      setsidebardata({
        //because here url is string we re using ""
        searchterm: searchtermfromurl || "",
        type: typefromurl || "all",
        offer: offerfromurl === "true" ? true : false,
        parking: parkingfromurl === "true" ? true : false,
        furnished: furnishedfromurl === "true" ? true : false,
        sort: sortfromurl || "created_at",
        order: orderfromurl || "desc",
      });
    }

    const fetchlistings = async () => {
      setshowmore(false);
      setloading(true);
      const searchquery = urlparams.toString();
      const res = await fetch(`/backend/listing/get?${searchquery}`);
      const data = await res.json();
      if (data.length > 8) {
        setshowmore(true);
      } else {
        setshowmore(false);
      }
      setlistings(data);
      setloading(false);
    };

    fetchlistings();
  }, [location.search]);

  const onshowmoreclick = async () => {
    const n = listings.length;
    const startindex = n;
    const urlparams = new URLSearchParams(location.search);
    urlparams.set("startindex", startindex);
    const searchquery = urlparams.toString();
    const res = await fetch(`/backend/listing/get?${searchquery}`);
    const data = await res.json();
    if (data.length < 9) {
      setshowmore(false);
    }

    setlistings([...listings, ...data]);
    //here we want to add new array into prev array
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handlesubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search term :
            </label>
            <input
              className="border rounded-lg p-3 w-full "
              type="text"
              id="searchterm"
              placeholder="search"
              value={sidebardata.searchterm}
              onChange={handlechange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">type:</label>
            <div className="flex gap-2">
              <input
                onChange={handlechange}
                checked={sidebardata.type === "all"}
                type="checkbox"
                id="all"
                className="w-5"
              />
              <span>rent & sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.type === "rent"}
              />
              <span>rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.type === "sale"}
              />
              <span>sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.offer === true}
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.parking === true}
              />
              <span>parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.furnished === true}
              />

              <span>furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">sort :</label>
            <select
              onChange={handlechange}
              defaultValue={"created_at_desc"}
              className="border rounded-lg p-3"
              id="sort_order"
            >
              <option value="regularPrice_desc">price high to low</option>
              <option value="regularPrice_asc">price low to high</option>
              <option value="createdAt_desc">latest</option>
              <option value="createdAt_asc">oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg text-2xl uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Results :{" "}
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-800">No listings found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-800 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showmore && (
            <button
              className="text-green-700 hover:underline p-7 text-center w-full"
              onClick={onshowmoreclick}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
