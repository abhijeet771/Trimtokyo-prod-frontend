import "./SearchFilterSection.scss";

import {
  SlidersHorizontal,
  Search,
  MapPin,
  Scissors,
  Star,
  BadgeCheck,
  House,
  RotateCcw,
} from "lucide-react";

const SearchFilterSection = ({
  filters,
  query,
  updateQuery,
  clearFilters,
}) => {
  return (
    <aside className="search-filter">
      {/* HEADER */}
      <div className="search-filter__header">
        <div className="search-filter__heading">
          <SlidersHorizontal size={18} />
          <h2>Filters</h2>
        </div>

        <button
          type="button"
          className="search-filter__clear"
          onClick={clearFilters}
        >
          <RotateCcw size={14} />
          Clear All
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-filter__group">
        <label htmlFor="search-filter-keyword">
          <Search size={16} />
          Search
        </label>

        <input
          id="search-filter-keyword"
          type="text"
          placeholder="Search salon or service..."
          value={query.search}
          onChange={(event) =>
            updateQuery("search", event.target.value)
          }
        />
      </div>

      {/* CITY */}
      <div className="search-filter__group">
        <label htmlFor="search-filter-city">
          <MapPin size={16} />
          City
        </label>

        <select
          id="search-filter-city"
          value={query.city}
          onChange={(event) =>
            updateQuery("city", event.target.value)
          }
        >
          <option value="">All Cities</option>

          {filters?.cities?.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* BUSINESS TYPE */}
      <div className="search-filter__group">
        <label htmlFor="search-filter-business-type">
          <Scissors size={16} />
          Business Type
        </label>

        <select
          id="search-filter-business-type"
          value={query.businessType}
          onChange={(event) =>
            updateQuery("businessType", event.target.value)
          }
        >
          <option value="">All Types</option>

          {filters?.businessTypes?.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* RATING */}
      <div className="search-filter__group">
        <label htmlFor="search-filter-rating">
          <Star size={16} />
          Minimum Rating
        </label>

        <select
          id="search-filter-rating"
          value={query.rating}
          onChange={(event) =>
            updateQuery("rating", event.target.value)
          }
        >
          <option value="">All Ratings</option>

          {filters?.ratings?.map((rating) => (
            <option key={rating} value={rating}>
              {rating}★ &amp; Above
            </option>
          ))}
        </select>
      </div>

      {/* FEATURED */}
      <div className="search-filter__check">
        <label>
          <input
            type="checkbox"
            checked={Boolean(query.featured)}
            onChange={(event) =>
              updateQuery("featured", event.target.checked)
            }
          />

          <BadgeCheck size={17} className="search-filter__check-icon" />
          <span>Featured Shops Only</span>
        </label>
      </div>

      {/* HOME SERVICE */}
      <div className="search-filter__check">
        <label>
          <input
            type="checkbox"
            checked={Boolean(query.delivery)}
            onChange={(event) =>
              updateQuery("delivery", event.target.checked)
            }
          />

          <House size={17} className="search-filter__check-icon" />
          <span>Home Service Available</span>
        </label>
      </div>
    </aside>
  );
};

export default SearchFilterSection;
