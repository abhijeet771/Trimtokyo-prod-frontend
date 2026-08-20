import "./SearchResultSection.scss";

import { useNavigate } from "react-router-dom";

import {
  Star,
  MapPin,
  Scissors,
  Clock3,
  Truck,
  ArrowRight,
} from "lucide-react";

const SearchResultSection = ({
  loading,
  barbers,
  pagination,
  query,
  updateQuery,
}) => {
  const navigate = useNavigate();

  return (
    <div className="search-results">

      {/* =================================
          HEADER
      ================================= */}

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
            updateQuery("sort", e.target.value)
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


      {/* =================================
          RESULTS
      ================================= */}

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

              <article
                className="search-card"
                key={barber._id}
              >

                {/* =================================
                    IMAGE
                ================================= */}

                <div className="search-card__image-wrapper">

                  <img
                    src={
                      barber.coverImage ||
                      barber.profileImage
                    }
                    alt={barber.shopName}
                    className="search-card__image"
                  />

                  {barber.isFeatured && (
                    <span className="search-card__featured">
                      Featured
                    </span>
                  )}

                </div>


                {/* =================================
                    CONTENT
                ================================= */}

                <div className="search-card__content">

                  {/* TOP */}

                  <div className="search-card__top">

                    <div className="search-card__title-area">

                      <h3>
                        {barber.shopName}
                      </h3>

                      <div className="search-card__rating">

                        <Star
                          size={16}
                          fill="#facc15"
                          color="#facc15"
                        />

                        <strong>
                          {barber.avgRating || "—"}
                        </strong>

                        <span>
                          ({barber.totalReviews || 0})
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* =================================
                      INFORMATION
                  ================================= */}

                  <div className="search-card__details">

                    <div className="search-card__detail">

                      <MapPin />

                      <span>
                        {barber.address || "Location unavailable"}
                      </span>

                    </div>


                    <div className="search-card__detail">

                      <Scissors />

                      <span>
                        {barber.businessType
                          ? barber.businessType
                              .charAt(0)
                              .toUpperCase() +
                            barber.businessType.slice(1)
                          : "Salon"}
                      </span>

                    </div>


                    <div className="search-card__detail">

                      <Clock3 />

                      <span>
                        {barber.openingTime &&
                        barber.closingTime
                          ? `${barber.openingTime} - ${barber.closingTime}`
                          : "Hours unavailable"}
                      </span>

                    </div>

                  </div>


                  {/* =================================
                      FOOTER
                  ================================= */}

                  <div className="search-card__footer">

                    <div className="search-card__services">

                      {barber.isDeliveryAvailable && (
                        <span className="search-card__service">

                          <Truck />

                          Home Service

                        </span>
                      )}

                    </div>


                    <button
                      type="button"
                      className="search-card__btn"
                      onClick={() =>
                        navigate(
                          `/barber/${barber.slug}`
                        )
                      }
                    >
                      <span>
                        View Details
                      </span>

                      <ArrowRight />

                    </button>

                  </div>

                </div>

              </article>

            ))
          )}

        </div>
      )}

    </div>
  );
};

export default SearchResultSection;