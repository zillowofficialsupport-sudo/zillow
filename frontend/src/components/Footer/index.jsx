import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

const Footer = () => (
  <footer className="footer-container">
    <div className="your-right-container">
      <h1>Everyone deserves a place to feel at home.</h1>
      <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noreferrer">
        Learn about fair housing protections
      </a>
    </div>

    <div className="region-footer-links">
      <ul className="four-links">
        {["Real estate", "Rentals", "Mortgage rates", "Browse homes"].map((label) => (
          <li className="four-links__link" key={label}>
            <button type="button">{label}</button>
            <FontAwesomeIcon icon={faAngleDown} />
          </li>
        ))}
      </ul>
    </div>

    <hr />
    <div className="footer">
      <ul className="language-links">
        <li><a href="/">About Villow</a></li>
        <li><a href="/listings">Browse homes</a></li>
        <li><a href="/listings/new">List a home</a></li>
        <li><a href="https://github.com/M8825" target="_blank" rel="noreferrer">Feedback</a></li>
        <li><a href="https://www.hud.gov/fairhousing" target="_blank" rel="noreferrer">Fair housing</a></li>
        <li><a href="https://github.com/M8825" target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/malkhaz-mamulishvili-703a97208/" target="_blank" rel="noreferrer">LinkedIn</a></li>
      </ul>

      <hr />
      <div className="under-footer">
        <p>
          Villow is committed to making home search clear and accessible. If you find
          an experience that could work better, please contact us and let us know.
        </p>
        <p>
          Listing availability, pricing, and details are provided by independent
          listing teams and may change without notice.
        </p>
      </div>
      <div className="footer-mark" aria-hidden="true">V</div>
    </div>
  </footer>
);

export default Footer;