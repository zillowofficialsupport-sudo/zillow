import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

import ListingItem from "../ListingItem/ListingItem";

import { getFilter } from "../../store/searchFilters";
import {
  getListings,
  fetchSearchListings,
  clearAllListings,
} from "../../store/listingsReducer";

import "./Listings.scss";

const Listings = () => {
  const dispatch = useDispatch();
  const filter = useSelector(getFilter());
  const listings = useSelector(getListings);

  const [reversed, setReversed] = useState(false);

  // Fetch listings from database based on the search search filters
  // on filter change
  useEffect(() => {
    dispatch(fetchSearchListings());

    // Clean up listings
    return () => {
      dispatch(clearAllListings());
    };
  }, [filter]);

  const listingStyling = {
    flexBasis: "calc(50% - 8px)",
    maxWidth: "calc(50% - 8px)",
  };

  const handleClick = (e) => {
    e.preventDefault();
    setReversed(!reversed);
  };

  return (
    <>
      <div className="index-container">
        <div className="listing-container-header">
          <div>
            <p className="listing-container-header__eyebrow">Explore listings</p>
            <h1>Homes for sale</h1>
          </div>
          <button
            className={`sort-button ${reversed ? "is-reversed" : ""}`}
            type="button"
            onClick={handleClick}
            aria-label={`Sort listings ${reversed ? "oldest first" : "newest first"}`}
          >
            <span>{reversed ? "Oldest" : "Newest"}</span>
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
        <div className="listings-container">
          {listings.length === 0 ? (
            <div className="listings-empty-state">
              <h2>No homes found</h2>
              <p>Try a different location or adjust your filters.</p>
            </div>
          ) : (
            (reversed ? [...listings].reverse() : listings).map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing}
                    listingStyling={listingStyling}
                  />
                ))
          )}
        </div>
      </div>
    </>
  );
};

export default Listings;
