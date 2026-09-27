import React from "react";
import useCurrencyFormatter from "../utils/useCurrencyFormatter";
import { Building, Calendar, Info, HOA, SQFT, SQFTLOT } from "./assets/svgs";

import ShowMore from "./ShowMore";
import Map from "../Map/map";

import "./style/home.scss";

const Home = ({ listing }) => {
  const formatter = useCurrencyFormatter();
  const listingPrice = formatter.format(listing?.price || 0);

  const createdTime = (timeString) => {
    if (!timeString) return "Recently listed";
    const time = new Date(timeString);
    if (Number.isNaN(time.getTime())) return "Recently listed";

    const differenceInHours = (new Date() - time) / (1000 * 60 * 60);
    if (differenceInHours < 1) return "Just now";
    return `${Math.floor(differenceInHours)} hours ago`;
  };

  const address = `${listing.address}, ${listing.city}, ${listing.state} ${listing.zipcode}`;
  const keywords = (listing.keyWords || "").split(" ").filter(Boolean);

  return (
    <div className="home-container">
      <div className="left-pane">
        <div className="listing-details-wrapper">
          <div className="top-container">
            <div className="top-container__header">
              <div className="right-header">
                <p className="listing-type-label">{listing.listingType || "For sale"}</p>
                <h1>{listing.title || listingPrice}</h1>
                {listing.title && <p className="listing-price">{listingPrice}</p>}
                <p className="show-address">{address}</p>
              </div>

              <div className="left-header">
                <p>
                  <span>{listing.bedroom || "—"}</span> beds
                </p>
                <p>
                  <span>{listing.bathroom || "—"}</span> baths
                </p>
                <p>
                  <span>{listing.sqft || "—"}</span> sqft
                </p>
              </div>
            </div>
            <div className="est-payment-container">
              <div className="est-payment">
                Est. payment:&nbsp;
                <span>{listing.estPayment ? `$${listing.estPayment}/mo` : "Available after inquiry"}</span>
                <Info />
                <span className="info-link">Learn more</span>
              </div>
            </div>
          </div>

          <div className="listing-info">
            <div className="listing-info__header-menu">
              <ul className="details">
                <li>
                  <Building />
                  {listing.buildingType || "Home"}
                </li>
                <li>
                  <span className="metric-mark">≈</span> {listingPrice}
                  <span>Villow estimate</span>
                </li>
                <li>
                  <Calendar />
                  Built in {listing.builtIn || "—"}
                </li>
                <li>
                  <SQFT />
                  {listing.priceSqft ? `$${listing.priceSqft}/sqft` : "Price per sqft unavailable"}
                </li>
                <li>
                  <SQFTLOT />
                  Lot size unavailable
                </li>
                <li>
                  <HOA />
                  HOA information unavailable
                </li>
              </ul>
            </div>
          </div>

          <div className="overview">
            <h1>What&apos;s special</h1>
            {keywords.length > 0 && (
              <div className="keywords">
                {keywords.map((keyword, idx) => (
                  <p key={`${keyword}-${idx}`}>{keyword}</p>
                ))}
              </div>
            )}

            <p>
              Listed by: <span>{listing.listingBy || "Villow"}</span>
            </p>
            <div>
              <ShowMore text={listing.overview || "No description has been provided for this home yet."} />
            </div>
          </div>

          <div className="line-footer">
            <p>
              <span>{createdTime(listing.createdAt)}</span> on Villow
            </p>
            <span aria-hidden="true">•</span>
            <p>
              <span>{listing.views || 0}</span> views
            </p>
          </div>
        </div>
        <div className="show-page-map-container">
          <Map listingId={listing.id} />
        </div>
      </div>

      <aside className="right-side-container">
        <div className="contact-card">
          <p className="contact-card__eyebrow">Ready to take the next step?</p>
          <h2>Make this home yours.</h2>
          <p>Save the listing to keep it close, then sign in to connect with the listing team.</p>
          <button
            type="button"
            className="contact-card__primary"
            onClick={() => document.querySelector("[data-action='save-listing']")?.click()}
          >
            Save this home
          </button>
          <a className="contact-card__secondary" href="/listings">
            Browse more homes
          </a>
        </div>
      </aside>
    </div>
  );
};

export default Home;