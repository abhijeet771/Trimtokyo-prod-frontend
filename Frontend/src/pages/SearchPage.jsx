import "./SearchPage.scss";

import HeaderSection from "../sections/HeaderSection/HeaderSection";
import MainFooter from "../components/organisms/MainFooter/MainFooter";

import SearchFilterSection from "../sections/SearchFilterSection/SearchFilterSection";
import SearchResultSection from "../sections/SearchResultSection/SearchResultSection";

import useShopSearch from "../hooks/useShopSearch";

const SearchPage = () => {
  const search = useShopSearch();

  return (
    <div className="search-page">
      <HeaderSection />

      <main className="search-page__container">
        <aside className="search-page__filters">
          <SearchFilterSection {...search} />
        </aside>

        <section className="search-page__results">
          <SearchResultSection {...search} />
        </section>
      </main>

      <MainFooter />
    </div>
  );
};

export default SearchPage;