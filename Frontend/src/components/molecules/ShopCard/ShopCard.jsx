import React from "react";
import { FaInstagram, FaMapMarkerAlt, FaStar, FaRegStar } from "react-icons/fa";
import "./ShopCard.scss";

const ShopCard = ({ barber, onBook, onViewDetails }) => {
  console.log(barber.avgRating);
  const openInstagram = () => {
    if (!barber.instagramId) return;

    const username = barber.instagramId.replace("@", "");
    window.open(`https://instagram.com/${username}`, "_blank");
  };

  const openMap = () => {
    if (!barber.googleMapLink) return;

    window.open(barber.googleMapLink, "_blank");
  };

  return (
    <div className="shop-card">
      <div className="shop-card__image">
        <img src={barber.profileImage || "/fallback.jpg"}  alt={barber.shopName} />
        {barber.avgRating >= 4.5 && ( <span className="badge">Top Rated</span> )}
      </div>

      <div className="shop-card__content">
        <h4 className="title">{barber.shopName}</h4>

        <div className="meta">
          <span className="rating">

            {[1, 2, 3, 4, 5].map((star) =>
              star <= Math.round(barber.avgRating || 0) ? (
                <FaStar key={star} />   ) : (
                <FaRegStar key={star} />
              )
            )}

            {/* ⭐ NUMBER */}
            <span className="rating-number">
              {barber.avgRating?.toFixed(1) || "0.0"}
            </span>

            {/* ⭐ TOTAL REVIEWS (optional) */}
            {barber.totalReviews ? (
              <span className="reviews">
                ({barber.totalReviews})
              </span>
            ) : null}

          </span>
          <span className="city">{barber.city}</span>
        </div>

        <p className="description"> {barber.description} </p>
        <div className="shop-card__actions">
          {barber.instagramId && (
            <FaInstagram  className="icon instagram" onClick={openInstagram}  title="Open Instagram"/>
          )}

          {barber.googleMapLink && (
            <FaMapMarkerAlt className="icon map" onClick={openMap}  title="View Location" />
          )}
        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="price">   From ₹{barber.startingPrice || 0}          </div>

          <div className="buttons">
            <button  className="book-btn"  onClick={(e) => {  e.stopPropagation();  onBook(barber);}}>
              Book Now
            </button>
            <button  className="details-btn"  onClick={(e) => { e.stopPropagation(); onViewDetails?.(barber); }}>
              See Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;