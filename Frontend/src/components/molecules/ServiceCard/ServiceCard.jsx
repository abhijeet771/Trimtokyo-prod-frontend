import "./ServiceCard.scss";

import {  FaStar,  FaMapMarkerAlt,  FaCheckCircle,  FaClock,} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({  _id,  shopName,  profileImage,  city,  avgRating,  totalReviews,  startingPrice,
  listingType,
  isDeliveryAvailable,
  badgeText = "Featured",
  redirectTo = "/shop",
}) => {
  const navigate = useNavigate();

  return (
    <div className="service-card">

      <div className="service-card__image-wrapper">
        <img src={profileImage} alt={shopName} className="service-card__image" />
        <div className="service-card__badge"> {badgeText} </div>

      </div>
      <div className="service-card__content">
        <div className="service-card__top">
          <div>
            <h3 className="service-card__title"> {shopName} </h3>
            <div className="service-card__location">
              <FaMapMarkerAlt />
              <span>{city}</span>
            </div>
          </div>
          <div className="service-card__rating">
            <FaStar />
            <span>  {avgRating?.toFixed(1) || "0.0"}  </span>
          </div>
        </div>
        <p className="service-card__reviews">  {totalReviews || 0} reviews </p>
        <div className="service-card__tags">

          <span className="service-card__tag">
            {listingType === "salon" ? "Salon" : "Barber"}
          </span>
          {isDeliveryAvailable && (
            <span className="service-card__tag service-card__tag--delivery">
              <FaCheckCircle />  Use your Custom Hairstyle </span>
          )}
        </div>
        <div className="service-card__footer">
          <div>
            <p className="service-card__price-label">   Starting From  </p>
            <h4 className="service-card__price">
              ₹{startingPrice || 0}
            </h4>
          </div>
          <button className="service-card__btn"  onClick={() =>   navigate(redirectTo)}>
            <FaClock />  See Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;