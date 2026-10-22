import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, X, Search, Store } from "lucide-react";

import "./SearchPage.scss";

import HeaderSection from "../sections/HomePage/HeaderSection/HeaderSection";
import MainFooter from "../components/website/MainFooter/MainFooter";

import SearchFilterSection from "../sections/SearchFilterSection/SearchFilterSection";
import SearchResultSection from "../sections/SearchResultSection/SearchResultSection";
import useShopSearch from "../hooks/website/useShopSearch";

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
  { label: "Name: A to Z", value: "name_asc" },
  { label: "Name: Z to A", value: "name_desc" },
];

const SearchPage = () => {
  const search = useShopSearch();

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  const {
    barbers = [],
    loading = false,
    query = {},
    updateQuery,
  } = search;

  const selectedSort = query.sort || "featured";

  const handleSortChange = (value) => {
    updateQuery?.("sort", value);
    setShowMobileSort(false);
  };

  const closeMobileFilters = () => setShowMobileFilters(false);

  return (
    <div className="search-page">
      {/* Existing header: intentionally unchanged */}
      <HeaderSection />

      <main className="search-page__container">
        {/* Desktop filters */}
        <aside className="search-page__filters">
          <SearchFilterSection {...search} />
        </aside>

        {/* Search results */}
        <section className="search-page__results">
          <div className="search-page__results-toolbar">
            <div className="search-page__results-heading">
              <div className="search-page__results-icon">
                <Store size={19} />
              </div>

              <div>
                <h1 className="search-page__results-title">
                  Find your next grooming spot
                </h1>

                <p className="search-page__results-subtitle">
                  {loading
                    ? "Finding the best shops for you..."
                    : `${search.pagination?.total ?? barbers.length} ${
                        (search.pagination?.total ?? barbers.length) === 1
                          ? "shop"
                          : "shops"
                      } found`}
                </p>
              </div>
            </div>

            <label className="search-page__desktop-sort">
              <span>Sort by</span>

              <select
                value={selectedSort}
                onChange={(event) => handleSortChange(event.target.value)}
                aria-label="Sort search results"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Mobile toolbar */}
          <div className="search-page__mobile-toolbar">
            <button
              type="button"
              className="search-page__filter-btn"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal size={17} />
              <span>Filters</span>
            </button>

            <button
              type="button"
              className="search-page__sort-btn"
              onClick={() => setShowMobileSort(true)}
            >
              <ArrowUpDown size={17} />
              <span>Sort</span>
            </button>
          </div>

          <SearchResultSection {...search} />
        </section>
      </main>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div
          className="search-page__filter-overlay"
          onClick={closeMobileFilters}
        >
          <section
            className="search-page__filter-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Search filters"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="search-page__filter-sheet-header">
              <div>
                <span className="search-page__sheet-eyebrow">
                  PERSONALIZE YOUR SEARCH
                </span>
                <h2>Filters</h2>
              </div>

              <button
                type="button"
                onClick={closeMobileFilters}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="search-page__filter-sheet-content">
              <SearchFilterSection {...search} />
            </div>

            <div className="search-page__filter-sheet-footer">
              <button
                type="button"
                className="search-page__filter-done"
                onClick={closeMobileFilters}
              >
                Show {search.pagination?.total ?? barbers.length} results
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Mobile sort drawer */}
      {showMobileSort && (
        <div
          className="search-page__sort-overlay"
          onClick={() => setShowMobileSort(false)}
        >
          <section
            className="search-page__sort-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Sort search results"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="search-page__sort-sheet-header">
              <h2>Sort results</h2>

              <button
                type="button"
                onClick={() => setShowMobileSort(false)}
                aria-label="Close sorting options"
              >
                <X size={20} />
              </button>
            </div>

            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`search-page__sort-option ${
                  selectedSort === option.value
                    ? "search-page__sort-option--active"
                    : ""
                }`}
                onClick={() => handleSortChange(option.value)}
              >
                <span>{option.label}</span>

                {selectedSort === option.value && (
                  <span className="search-page__sort-check">✓</span>
                )}
              </button>
            ))}
          </section>
        </div>
      )}

      {/* Existing footer: intentionally unchanged */}
      <MainFooter />
    </div>
  );
};

export default SearchPage;