import "./SearchFilterSection.scss";

const SearchFilterSection = ({
  filters,
  query,
  updateQuery,
  clearFilters,
}) => {
  return (
    <div className="search-filter">
      <div className="search-filter__header">
        <h2>Filters</h2>

        <button
          type="button"
          onClick={clearFilters}
        >
          Clear All
        </button>
      </div>

      {/* Search */}

      <div className="search-filter__group">
        <label>Search</label>

        <input
          type="text"
          placeholder="Search salon..."
          value={query.search}
          onChange={(e) =>
            updateQuery(
              "search",
              e.target.value
            )
          }
        />
      </div>

      {/* City */}

      <div className="search-filter__group">
        <label>City</label>

        <select
          value={query.city}
          onChange={(e) =>
            updateQuery(
              "city",
              e.target.value
            )
          }
        >
          <option value="">
            All Cities
          </option>

          {filters?.cities?.map(
            (city) => (
              <option
                key={city}
                value={city}
              >
                {city}
              </option>
            )
          )}
        </select>
      </div>

      {/* Business Type */}

      <div className="search-filter__group">
        <label>Business Type</label>

        <select
          value={query.businessType}
          onChange={(e) =>
            updateQuery(
              "businessType",
              e.target.value
            )
          }
        >
          <option value="">
            All
          </option>

          {filters?.businessTypes?.map(
            (type) => (
              <option
                key={type}
                value={type}
              >
                {type.charAt(0).toUpperCase() +
                  type.slice(1)}
              </option>
            )
          )}
        </select>
      </div>

      {/* Rating */}

      <div className="search-filter__group">
        <label>
          Minimum Rating
        </label>

        <select
          value={query.rating}
          onChange={(e) =>
            updateQuery(
              "rating",
              e.target.value
            )
          }
        >
          <option value="">
            All Ratings
          </option>

          {filters?.ratings?.map(
            (rating) => (
              <option
                key={rating}
                value={rating}
              >
                {rating}★ & Above
              </option>
            )
          )}
        </select>
      </div>

      {/* Featured */}

      <div className="search-filter__check">
        <label>
          <input
            type="checkbox"
            checked={
              query.featured
            }
            onChange={(e) =>
              updateQuery(
                "featured",
                e.target.checked
              )
            }
          />

          Featured Only
        </label>
      </div>

      {/* Delivery */}

      <div className="search-filter__check">
        <label>
          <input
            type="checkbox"
            checked={
              query.delivery
            }
            onChange={(e) =>
              updateQuery(
                "delivery",
                e.target.checked
              )
            }
          />

          Home Service Available
        </label>
      </div>

      <button
        className="search-filter__btn"
        type="button"
        onClick={clearFilters}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default SearchFilterSection;