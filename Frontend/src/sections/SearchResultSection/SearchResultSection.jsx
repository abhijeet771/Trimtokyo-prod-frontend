import { useState } from "react";
import "./SearchResultSection.scss";

import { useNavigate } from "react-router-dom";

import {
  Star,
  MapPin,
  Scissors,
  Clock3,
  Truck,
  ArrowRight,
  ChevronDown,
  IndianRupee,
} from "lucide-react";

const INITIAL_SERVICE_COUNT = 3;

const SearchResultSection = ({
  loading,
  barbers = [],
  pagination,
  query,
  updateQuery,
}) => {
  const navigate = useNavigate();

  // Track expanded services separately for each shop.
  const [expandedShops, setExpandedShops] = useState({});

  const toggleServices = (barberId) => {
    setExpandedShops((prev) => ({
      ...prev,
      [barberId]: !prev[barberId],
    }));
  };

  const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
      return "Price unavailable";
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="search-results">
      {/* HEADER */}
      <div className="search-results__header">
        <div>
          <h2>Available Barbers</h2>
          <p>
            Showing {pagination?.total ?? barbers.length} results
          </p>
        </div>

        <select
          aria-label="Sort search results"
          value={query.sort}
          onChange={(event) =>
            updateQuery("sort", event.target.value)
          }
        >
          <option value="featured">Featured</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
      </div>

      {/* RESULTS */}
      {loading ? (
        <div className="search-results__loading">
          Loading barbers...
        </div>
      ) : barbers.length === 0 ? (
        <div className="search-results__empty">
          No barbers found. Try changing your search or filters.
        </div>
      ) : (
        <div className="search-results__list">
          {barbers.map((barber) => {
            const services = Array.isArray(barber.matchingServices)
              ? barber.matchingServices
              : [];

            const isExpanded = Boolean(expandedShops[barber._id]);

            const visibleServices = isExpanded
              ? services
              : services.slice(0, INITIAL_SERVICE_COUNT);

            const remainingServices =
              services.length - INITIAL_SERVICE_COUNT;

            return (
              <article
                className="search-card"
                key={barber._id}
              >
                {/* SHOP IMAGE */}
                <div className="search-card__image-wrapper">
                  {barber.coverImage || barber.profileImage ? (
                    <img
                      src={
                        barber.coverImage || barber.profileImage
                      }
                      alt={barber.shopName || "Barber shop"}
                      className="search-card__image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="search-card__image-placeholder">
                      <Scissors size={34} />
                    </div>
                  )}

                  {barber.isFeatured && (
                    <span className="search-card__featured">
                      Featured
                    </span>
                  )}
                </div>

                {/* SHOP CONTENT */}
                <div className="search-card__content">
                  <div className="search-card__top">
                    <div className="search-card__title-area">
                      <h3>{barber.shopName}</h3>

                      <div className="search-card__rating">
                        <Star
                          size={16}
                          fill="#facc15"
                          color="#facc15"
                        />

                        <strong>
                          {Number(barber.avgRating) > 0
                            ? Number(barber.avgRating).toFixed(1)
                            : "New"}
                        </strong>

                        <span>
                          ({barber.totalReviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SHOP INFORMATION */}
                  <div className="search-card__details">
                    <div className="search-card__detail">
                      <MapPin size={16} />

                      <span>
                        {[barber.address, barber.city]
                          .filter(Boolean)
                          .filter(
                            (value, index, array) =>
                              array.indexOf(value) === index
                          )
                          .join(", ") || "Location unavailable"}
                      </span>
                    </div>

                    <div className="search-card__detail">
                      <Scissors size={16} />

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
                      <Clock3 size={16} />

                      <span>
                        {barber.openingTime && barber.closingTime
                          ? `${barber.openingTime} - ${barber.closingTime}`
                          : "Hours unavailable"}
                      </span>
                    </div>
                  </div>

                  {/* MATCHING SERVICES */}
                  <div className="search-card__matching-services">
                    <div className="search-card__services-heading">
                      <Scissors size={17} />
                      <h4>
                        {query.search
                          ? "Matching Services"
                          : "Available Services"}
                      </h4>

                      {barber.matchingServiceCount > 0 && (
                        <span className="search-card__service-count">
                          {barber.matchingServiceCount}
                        </span>
                      )}
                    </div>

                    {services.length > 0 ? (
                      <>
                        <div className="search-card__service-list">
                          {visibleServices.map((service) => (
                            <div
                              className="search-card__service-row"
                              key={service._id}
                            >
                              <div className="search-card__service-info">
                                <span className="search-card__service-name">
                                  {service.title}
                                </span>

                                {service.duration != null && (
                                  <span className="search-card__service-duration">
                                    <Clock3 size={12} />
                                    {service.duration} min
                                  </span>
                                )}
                              </div>

                              <span className="search-card__service-price">
                                <IndianRupee size={14} />
                                {Number(service.price).toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </div>
                          ))}
                        </div>

                        {services.length > INITIAL_SERVICE_COUNT && (
                          <button
                            type="button"
                            className="search-card__show-services"
                            onClick={() =>
                              toggleServices(barber._id)
                            }
                          >
                            {isExpanded
                              ? "Show less"
                              : `+ ${remainingServices} more service${
                                  remainingServices === 1 ? "" : "s"
                                }`}

                            <ChevronDown
                              size={15}
                              className={
                                isExpanded ? "is-expanded" : ""
                              }
                            />
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="search-card__no-services">
                        {query.search
                          ? "No matching service details available."
                          : "Service details are not available in these results."}
                      </p>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="search-card__footer">
                    <div className="search-card__services">
                      {barber.isDeliveryAvailable && (
                        <span className="search-card__service">
                          <Truck size={15} />
                          Home Service
                        </span>
                      )}
                    </div>

                    
<button
  type="button"
  className="search-card__btn"
  disabled={!barber.slug}
  onClick={() => {
    if (!barber.slug) return;
    navigate(`/salon/${encodeURIComponent(barber.slug)}`);
  }}
>
  <span>View Details</span>
  <ArrowRight size={17} />
</button>

                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResultSection;
