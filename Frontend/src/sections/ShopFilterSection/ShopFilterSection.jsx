import "./ShopFilterSection.scss";
import { SHOP_FILTERS } from "../../constants/shopfilters";
import {  MapPin,  Star,} from "lucide-react";

const ShopFilterSection = () => {
  return (
    <aside className="shop-filter">

      {/* HEADER */}
      <div className="shop-filter__header">

        <h3>Filters</h3>

        <button>Reset</button>

      </div>

      {/* LOCATION */}
      <div className="shop-filter__section">

        <h4>Location</h4>

        <div className="shop-filter__location">

          <span>
            {SHOP_FILTERS.location}
          </span>

          <MapPin size={18} />

        </div>

      </div>

      {/* TYPES */}
      <div className="shop-filter__section">

        <h4>Type</h4>

        <div className="shop-filter__checkbox-group">

          {SHOP_FILTERS.types.map((type, index) => (
            <label
              className="shop-filter__checkbox"
              key={index}
            >
              <input
                type="checkbox"
                defaultChecked={index === 0}
              />

              <span>{type}</span>

            </label>
          ))}

        </div>

      </div>

      {/* SERVICES */}
      <div className="shop-filter__section">

        <h4>Services</h4>

        <div className="shop-filter__checkbox-group">

          {SHOP_FILTERS.services.map((service, index) => (
            <label
              className="shop-filter__checkbox"
              key={index}
            >
              <input
                type="checkbox"
                defaultChecked={index === 0}
              />

              <span>{service}</span>

            </label>
          ))}

        </div>

        <button className="shop-filter__show-more">
          + Show more
        </button>

      </div>

      {/* PRICE */}
      <div className="shop-filter__section">

        <h4>Price Range</h4>

        <div className="shop-filter__price">

          <input
            type="range"
            min="0"
            max="2000"
          />

          <div className="shop-filter__price-values">
            <span>₹0</span>

            <span>₹2000+</span>
          </div>

        </div>

      </div>

      {/* RATING */}
      <div className="shop-filter__section">

        <h4>Rating</h4>

        <div className="shop-filter__radio-group">

          {SHOP_FILTERS.ratings.map((rating, index) => (
            <label
              className="shop-filter__radio"
              key={index}
            >

              <input
                type="radio"
                name="rating"
                defaultChecked={index === 0}
              />

              <div className="shop-filter__stars">

                <Star size={14} fill="#FDB022" />
                <Star size={14} fill="#FDB022" />
                <Star size={14} fill="#FDB022" />
                <Star size={14} fill="#FDB022" />
                <Star size={14} fill="#FDB022" />

              </div>

              <span>{rating}</span>

            </label>
          ))}

        </div>

      </div>

      {/* AVAILABILITY */}
      <div className="shop-filter__section">

        <h4>Availability</h4>

        <div className="shop-filter__checkbox-group">

          {SHOP_FILTERS.availability.map((item, index) => (
            <label
              className="shop-filter__checkbox"
              key={index}
            >

              <input
                type="checkbox"
                defaultChecked={index === 0}
              />

              <span>{item}</span>

            </label>
          ))}

        </div>

      </div>

      {/* BUTTON */}
      <button className="shop-filter__apply-btn">
        Apply Filters
      </button>

    </aside>
  );
};

export default ShopFilterSection;