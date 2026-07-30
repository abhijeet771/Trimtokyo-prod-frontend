import {
  Star,
  MapPin,
  IndianRupee,
  Clock,
  ChevronRight,
} from "lucide-react";

import "./SearchCard.scss";

const SearchCard = ({
  image = "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200",
  name = "Trim Tokyo Premium",
  rating = 4.8,
  reviews = 523,
  categories = [
    "Haircut",
    "Beard",
    "Spa",
  ],
  address = "Mumbai, Maharashtra",
  price = 299,
  open = true,
  onClick,
}) => {
  return (
    <div
      className="search-card"
      onClick={onClick}
    >
      <div className="search-card__image">
        <img
          src={image}
          alt={name}
        />

        <span
          className={`status ${
            open ? "open" : "closed"
          }`}
        >
          {open ? "Open" : "Closed"}
        </span>
      </div>

      <div className="search-card__body">
        <div className="top">
          <h3>{name}</h3>

          <div className="rating">
            <Star
              size={16}
              fill="currentColor"
            />

            <span>
              {rating}
            </span>

            <small>
              ({reviews})
            </small>
          </div>
        </div>

        <div className="categories">
          {categories.map(
            (item) => (
              <span key={item}>
                {item}
              </span>
            )
          )}
        </div>

        <div className="info">
          <div>
            <MapPin size={16} />

            {address}
          </div>

          <div>
            <IndianRupee
              size={16}
            />

            From ₹{price}
          </div>

          <div>
            <Clock size={16} />

            9:00 AM - 9:00 PM
          </div>
        </div>

        <button
          className="view-btn"
        >
          View Profile

          <ChevronRight
            size={18}
          />
        </button>
      </div>
    </div>
  );
};

export default SearchCard;