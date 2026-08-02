import "./SearchResultSection.scss";
import { useNavigate } from "react-router-dom";
import {  Star,  MapPin,  Scissors,  Clock3,  Truck,} from "lucide-react";


const SearchResultSection = (

{  loading,  barbers,  pagination,  query,  updateQuery,}) => 
{const navigate = useNavigate();
  return (
    <div className="search-results">
      <div className="search-results__header">
        <div>
          <h2>Available Barbers</h2>

          <p>
            Showing {pagination?.total || 0} results
          </p>
        </div>

        <select
          value={query.sort}
          onChange={(e) =>
            updateQuery(
              "sort",
              e.target.value
            )
          }
        >
          <option value="featured">
            Featured
          </option>

          <option value="rating">
            Highest Rated
          </option>

          <option value="newest">
            Newest
          </option>

          <option value="name_asc">
            Name (A-Z)
          </option>

          <option value="name_desc">
            Name (Z-A)
          </option>
        </select>
      </div>

      {loading ? (
        <div className="search-results__loading">
          Loading barbers...
        </div>
      ) : (
        <div className="search-results__list">
          {barbers.length === 0 ? (
            <div className="search-results__empty">
              No barbers found.
            </div>
          ) : (
            barbers.map((barber) => (
              <div
                className="search-card"
                key={barber._id}
              >
                <img
                  src={
                    barber.coverImage ||
                    barber.profileImage
                  }
                  alt={barber.shopName}
                />

                <div className="search-card__content">
                  <div className="search-card__top">
                    <div>
                      <h3>
                        {barber.shopName}
                      </h3>

                      <span>
                        <Star
                          size={16}
                          fill="#facc15"
                          color="#facc15"
                        />

                        {barber.avgRating} (
                        {barber.totalReviews})
                      </span>
                    </div>

                    {barber.isFeatured && (
                      <span className="badge">
                        Featured
                      </span>
                    )}
                  </div>

                  <p>
                    <MapPin size={16} />

                    {barber.address}
                  </p>

                  <p>
                    <Scissors size={16} />

                    {barber.businessType}
                  </p>

                  <p>
                    <Clock3 size={16} />

                    {barber.openingTime} -{" "}
                    {barber.closingTime}
                  </p>

                  <div className="search-card__bottom">
                    {barber.isDeliveryAvailable && (
                      <span>
                        <Truck size={16} />

                        Home Service
                      </span>
                    )}

                    <button
                      type="button"
                       onClick={() =>
                       navigate(`/barber/${barber.slug}`)
                       }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultSection;