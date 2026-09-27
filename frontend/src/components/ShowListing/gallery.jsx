import React, { useEffect, useState } from "react";

import "./style/gallery.scss";

const Gallery = ({ listing }) => {
  const photos = listing?.photoUrls?.length
    ? listing.photoUrls
    : [null];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const address = `${listing.address}, ${listing.city}`;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % photos.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, photos.length]);

  const renderPhoto = (photo, alt) =>
    photo ? (
      <img alt={alt} src={photo} />
    ) : (
      <div className="gallery-placeholder" aria-label="No property photos available">
        <span>Villow home</span>
      </div>
    );

  return (
    <>
      <div className="gallery" aria-label="Property photo gallery">
        <button
          className="gallery-item large"
          type="button"
          onClick={() => {
            setActiveIndex(0);
            setIsOpen(true);
          }}
          aria-label="Open property photos"
        >
          {renderPhoto(photos[0], `${address} exterior`)}
        </button>
        {photos.slice(1, 5).map((photo, idx) => (
          <button
            className={`gallery-item small small-${idx + 1}`}
            type="button"
            key={`${photo || "placeholder"}-${idx}`}
            onClick={() => {
              setActiveIndex(idx + 1);
              setIsOpen(true);
            }}
            aria-label={`Open property photo ${idx + 2}`}
          >
            {renderPhoto(photo, `${address} photo ${idx + 2}`)}
          </button>
        ))}
        {photos.length > 5 && (
          <button
            className="gallery-count"
            type="button"
            onClick={() => setIsOpen(true)}
          >
            View all {photos.length} photos
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Property photos"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="gallery-lightbox__close"
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close photo viewer"
          >
            ×
          </button>
          <button
            className="gallery-lightbox__arrow gallery-lightbox__arrow--previous"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <div className="gallery-lightbox__content" onClick={(event) => event.stopPropagation()}>
            {renderPhoto(photos[activeIndex], `${address} photo ${activeIndex + 1}`)}
            <p>{activeIndex + 1} of {photos.length}</p>
          </div>
          <button
            className="gallery-lightbox__arrow gallery-lightbox__arrow--next"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex((index) => (index + 1) % photos.length);
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
};

export default Gallery;
