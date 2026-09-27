import React from "react";
import { Link } from "react-router-dom";

import Navigation from "../Header/Navigation";

import "./NotFound.scss";

const NotFound = () => (
  <>
    <Navigation isIndex />
    <main className="not-found">
      <div className="not-found__mark" aria-hidden="true">Z</div>
      <p className="not-found__eyebrow">Page not found</p>
      <h1>That page has moved.</h1>
      <p className="not-found__message">
        The home you’re looking for may have been removed or the address may be incorrect.
      </p>
      <Link className="not-found__link" to="/">
        Return to Zillow
      </Link>
    </main>
  </>
);

export default NotFound;