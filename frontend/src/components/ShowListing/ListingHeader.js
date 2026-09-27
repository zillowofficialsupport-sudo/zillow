import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CloseModalFunction } from "../Modal/ModalContainer";
import zillow from "../assets/Logo-Villow.svg";
import { BackArrow, Heart, Share } from "./assets/svgs";
import { addFavorite, removeFavorite } from "../../store/listingsReducer";
import { getActiveUser } from "../../store/usersReducer";

import "./style/ListingHeader.scss";

const ListingHeader = ({ listing }) => {
	const closeModal = useContext(CloseModalFunction);
  const dispatch = useDispatch();
  const currentUser = useSelector(getActiveUser());
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(Boolean(listing.favorite));

  const handleSave = () => {
    if (!currentUser) return;
    if (saved) {
      dispatch(removeFavorite(currentUser.id, listing.id));
    } else {
      dispatch(addFavorite(currentUser.id, listing.id));
    }
    setSaved(!saved);
  };

  const handleShare = async () => {
    const shareData = {
      title: listing.title || "Home on Zillow",
      text: `${listing.address}, ${listing.city}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch (error) {
      if (error.name !== "AbortError") setShared(false);
    }
  };

	return (
		<header className="listing_header">
			<button className="back-to-listing" type="button" onClick={() => closeModal()}>
				<BackArrow /> <span>Back to search</span>
			</button>
			<div
				className="grid-item middle"
				style={{ width: "125px", height: "45px" }}
			>
				<img src={zillow} alt="Zillow" style={{ marginTop: "5px" }} />
			</div>
			<div className="listing_header__actions">
				<button
          type="button"
          data-action="save-listing"
          onClick={handleSave}
          aria-pressed={saved}
        >
					<Heart /> Save
				</button>
				<button type="button" onClick={handleShare}>
					<Share /> {shared ? "Link copied" : "Share"}
				</button>
			</div>
		</header>
	);
};

export default ListingHeader;
