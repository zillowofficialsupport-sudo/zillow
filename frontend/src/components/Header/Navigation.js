import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import ModalContainer from "../Modal/ModalContainer";
import AuthorizedUser from "./AuthorizedUser";
import ModalTabs from "../Modal/ModalTabs";
import ModalWelcomeHeader from "./Welcome";
import SearchBar from "../SearchBar/SearchBar";

import { fetchCurrentUser, getActiveUser } from "../../store/usersReducer";

import zillow from "../assets/Logo-Villow.svg";
import "./Navigation.scss";

const Navigation = ({ isIndex }) => {
  const dispatch = useDispatch();
  const activeUser = useSelector(getActiveUser());

  useEffect(() => {
    if (!activeUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, activeUser]);

  const modalAreaStyling = {
    display: "flex",
    flexDirection: "column",
    padding: "27px 16px 14px 16px",
    borderRadius: "10px",
    width: "456px",
    backgroundColor: "rgb(255 255 255)",
  };


  return (
    <header className="container">
      <nav id="navigation" aria-label="Primary navigation">
        <div className="grid-item left nav-links">
          <Link to="/listings">Buy</Link>
          <Link to="/listings">Rent</Link>
          <Link to="/listings/new">Sell</Link>
        </div>
        <Link to="/" className="brand-link" aria-label="Zillow home">
          <img className="brand-logo" src={zillow} alt="Zillow" />
        </Link>
        <div className="grid-item right nav-links">
          <Link to="/listings/new">List your home</Link>
          <Link to="/listings">Explore</Link>
          {activeUser ? (
            <AuthorizedUser />
          ) : (
            <ModalContainer
              modalAreaStyling={modalAreaStyling}
              ModalWelcomeHeader={ModalWelcomeHeader}
              ModalTabs={ModalTabs}
            />
          )}
        </div>
      </nav>

      {!isIndex && (
        <div className="search_container">
          <div className="hero-copy">
            <p className="eyebrow">A better way to move</p>
            <h1>Find a place that feels like home.</h1>
            <p>Search trusted listings, compare details, and take the next step with confidence.</p>
          </div>
          <SearchBar />
        </div>
      )}
    </header>
  );
};

export default Navigation;
