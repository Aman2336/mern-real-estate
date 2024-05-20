import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  //here we use concepts of props in which we we pass arguments as props to get the contact component attribute in Listing.jsx
  const [landlord, setlandlord] = useState(null);
  const [message, setmessage] = useState("");

  useEffect(() => {
    const fetchlandlord = async () => {
      try {
        if (!listing?.userRef) return;
        const res = await fetch(`/backend/user/${listing.userRef}`);
        const data = await res.json();
        setlandlord(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchlandlord();
  }, [listing?.userRef]);

  Contact.propTypes = {
    listing: PropTypes.shape({
      userRef: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  };
  const onchange = (e) => {
    setmessage(e.target.value);
  };
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg mt-2"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onchange}
            placeholder="Enter your message here"
          ></textarea>

            <Link
              to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
              className="bg-slate-600 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            >
              Send message
            </Link>

        </div>
      )}
    </>
  );
}
