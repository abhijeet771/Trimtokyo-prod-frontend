import { useState } from "react";
import "./SearchPage.scss";

import HeaderSection from "../sections/HeaderSection/HeaderSection";
import MainFooter from "../components/organisms/MainFooter/MainFooter";

import SearchFilterSection from "../sections/SearchFilterSection/SearchFilterSection";
import SearchResultSection from "../sections/SearchResultSection/SearchResultSection";
import useShopSearch from "../hooks/useShopSearch";

const SearchPage = () => {
  const search = useShopSearch();

  const [showMobileFilters, setShowMobileFilters] =
    useState(false);

  return (
    <div className="search-page">
      <HeaderSection />

      <main className="search-page__container">

        {/* Desktop Filters */}
        <aside className="search-page__filters">
          <SearchFilterSection {...search} />
        </aside>

        {/* Results */}
        <section className="search-page__results">

          {/* Mobile Filter Bar */}
          <div className="search-page__mobile-toolbar">
            <button
              type="button"
              className="search-page__filter-btn"
              onClick={() => setShowMobileFilters(true)}
            >
              <span>☷</span>
              Filters
            </button>

            <button
              type="button"
              className="search-page__sort-btn"
            >
              <span>⇅</span>
              Sort
            </button>
          </div>

          <SearchResultSection {...search} />
        </section>
      </main>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div
          className="search-page__filter-overlay"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="search-page__filter-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-page__filter-sheet-header">
              <h2>Filters</h2>

              <button
                type="button"
                onClick={() =>
                  setShowMobileFilters(false)
                }
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            <div className="search-page__filter-sheet-content">
              <SearchFilterSection {...search} />
            </div>
          </div>
        </div>
      )}

      <MainFooter />
    </div>
  );
};

export default SearchPage;