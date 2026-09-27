import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import ModalContainer from "../Modal/ModalContainer";
import ListingHeader from "./ListingHeader";
import Gallery from "./gallery";
import Home from "./Home";
import { fetchListing, getListing } from "../../store/listingsReducer";

import "./style/index.scss";

const ShowListing = ({ listing: listingProp, handleClickItem }) => {
  const { listingId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const listingFromStore = useSelector(getListing(listingId));
  const listing = listingProp || listingFromStore;

  useEffect(() => {
    if (listingId && !listingProp && !listingFromStore) {
      dispatch(fetchListing(listingId));
    }
  }, [dispatch, listingId, listingProp, listingFromStore]);

	const modalAreaStyling = {
		display: "flex",
		flexDirection: "column",
		width: "min(1248px, calc(100vw - 24px))",
		height: "100vh",
		maxHeight: "100vh",
		backgroundColor: "#ffffff",
		borderRadius: "18px",
		padding: "0 clamp(16px, 3vw, 34px)",
		overflowY: "auto",
	};

  if (!listing) {
    return (
      <div className="listing-loading-state" role="status">
        Loading home details…
      </div>
    );
  }

	return (
			<>
				<ModalContainer
					modalAreaStyling={modalAreaStyling}
					listingId={listing.id}
					handleClickItem={handleClickItem || (() => history.push("/listings"))}
				>
					<ListingHeader listing={listing} />
					<Gallery listing={listing} />
					<Home listing={listing} />
				</ModalContainer>
			</>
	);
};

export default ShowListing;
