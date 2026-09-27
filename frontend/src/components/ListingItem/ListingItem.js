import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import ListingIndexItemHeart from "./ListingHeart";
import ShowListing from "../ShowListing/index";

import { addFavorite, removeFavorite } from "../../store/listingsReducer";
import { getActiveUser } from "../../store/usersReducer";

import "./ListingItem.scss";

const ListingItem = ({ listing, listingStyling, thumbnailStyling }) => {
	const dispatch = useDispatch();
  const history = useHistory();
	const currentUser = useSelector(getActiveUser());
  const [isListingClicked, setIsListingClicked] = useState(false);

	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
	});

	const price = formatter.format(listing.price);

	const handleFavoriteClick = (e, listingId) => {
		e.preventDefault();
		e.stopPropagation();

    if (!currentUser) return;

		if (listing.favorite) {
			dispatch(removeFavorite(currentUser.id, listingId));
		} else {
			dispatch(addFavorite(currentUser.id, listingId));
		}
	};

	const handleClickItem = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      history.push(`/listings/${listing.id}`);
      setIsListingClicked(true);
      return;
    }

    setIsListingClicked(false);
	}

  const photoUrl = listing.photoUrls?.[0] || listing.photos?.[0]?.image_url;
  const keyword = listing.keyWords?.split(" ").filter(Boolean).slice(0, 3).join(" ");
  const buildingType = listing.buildingType || "Home";
  const listingBy = listing.listingBy || listing.listing_by || "Villow";

	return (
		<>
			{ isListingClicked ? <ShowListing listing={listing} handleClickItem={handleClickItem}/> : null }
			<li
        className="listing_item"
        style={listingStyling}
        onClick={handleClickItem}
        tabIndex="0"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") handleClickItem(event);
        }}
      >
				<div className="listing_item__content_box">
					<div
						className="listing_item__thumbnail"
						style={{
							...thumbnailStyling,
							backgroundImage: photoUrl ? `url(${photoUrl})` : "none",
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
						}}
					>
						{!photoUrl && <div className="listing_item__thumbnail__fallback">Villow home</div>}
						{keyword && <div className="listing_item__thumbnail__keyword">{keyword}</div>}
						<button
              className="listing_item__thumbnail__favorite"
              type="button"
              onClick={(e) => handleFavoriteClick(e, listing.id)}
              aria-label={listing.favorite ? "Remove from saved homes" : "Save this home"}
              aria-pressed={Boolean(listing.favorite)}
            >
							<ListingIndexItemHeart isFavorite={listing.favorite} />
						</button>
					</div>

					<div className="listing_item__info">
						<h2>{price}</h2>
						<div className="listing_item__info__details">
							<p>
								<span className="listing_item__info__details__bold_span">
									{listing.bedroom}
								</span>{" "}
								bd{" "}
								<span className="listing_item__info__details__light_span">
									|
								</span>
							</p>
							<p>
								<span className="listing_item__info__details__bold_span">
									{listing.bathroom}
								</span>{" "}
								ba{" "}
								<span className="listing_item__info__details__light_span">
									|
								</span>
							</p>
							<p>
								<span className="listing_item__info__details__bold_span">
									{listing.sqft}
								</span>{" "}
								sqft{" "}
								<span className="listing_item__info__details__light_span">
									|
								</span>
							</p>
							<p>
								{buildingType} for {listing.listingType || "Sale"}
							</p>
						</div>
						<p className="listing_item__info__details__address">
							{`${listing.address} ${listing.city}, ${listing.state} ${listing.zipcode}`}
						</p>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<p className="listing_item__info__details__listing_by">
								{" "}
								LISTING BY: {listingBy.toUpperCase()}
							</p>
						</div>
					</div>
				</div>
				{/* </Link> */}
			</li>
		</>
	);
};

export default ListingItem;
