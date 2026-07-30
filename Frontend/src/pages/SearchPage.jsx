import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PopularSearches from "../components/molecules/PopularSearches/PopularSearches";
import SearchCard from "../components/organisms/SearchCard/SearchCard";

import "./SearchPage.scss";

const BARBERS = [
  {
    id: 1,
    name: "Trim Tokyo Premium",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200",
    rating: 4.9,
    reviews: 520,
    categories: [
      "Haircut",
      "Beard",
      "Hair Spa",
    ],
    address: "Mumbai",
    price: 299,
    open: true,
    slug: "trim-tokyo-premium",
  },
  {
    id: 2,
    name: "Barber Kings",
    image:
      "https://images.unsplash.com/photo-1503951458645-643d53bfd90f?w=1200",
    rating: 4.8,
    reviews: 312,
    categories: [
      "Fade",
      "Haircut",
    ],
    address: "Delhi",
    price: 349,
    open: true,
    slug: "barber-kings",
  },
  {
    id: 3,
    name: "Luxury Hair Studio",
    image:
      "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=1200",
    rating: 4.7,
    reviews: 261,
    categories: [
      "Luxury Salon",
      "Keratin",
    ],
    address: "Bangalore",
    price: 499,
    open: false,
    slug: "luxury-hair-studio",
  },
  {
    id: 4,
    name: "Classic Barber",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200",
    rating: 4.6,
    reviews: 170,
    categories: [
      "Haircut",
      "Styling",
    ],
    address: "Pune",
    price: 250,
    open: true,
    slug: "classic-barber",
  },
  {
    id: 5,
    name: "Style Boutique",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200",
    rating: 4.8,
    reviews: 411,
    categories: [
      "Boutique",
      "Hair Coloring",
    ],
    address: "Hyderabad",
    price: 599,
    open: true,
    slug: "style-boutique",
  },
];



const SearchPage = () => {
const navigate = useNavigate();
  const [keyword, setKeyword] =
    useState("");

  const [activeSearch, setActiveSearch] =
    useState("");

  const filteredBarbers =
    useMemo(() => {
      return BARBERS.filter(
        (barber) => {
          const search =
            keyword.toLowerCase();

          const matchesKeyword =
            barber.name
              .toLowerCase()
              .includes(search) ||
            barber.categories.some(
              (category) =>
                category
                  .toLowerCase()
                  .includes(search)
            );

          const matchesChip =
            !activeSearch ||
            barber.categories.includes(
              activeSearch
            );

          return (
            matchesKeyword &&
            matchesChip
          );
        }
      );
    }, [
      keyword,
      activeSearch,
    ]);

  return (
    <section className="search-page">
      <div className="search-hero">
        <h1>
          Find Your Perfect Barber
        </h1>

        <p>
          Discover trusted salons,
          premium barbers and
          grooming experts near you.
        </p>

        <div className="search-box">
          <Search size={20} />

          <input
            type="text"
            placeholder="Search hairstyle, beard, salon..."
            value={keyword}
            onChange={(e) =>
              setKeyword(
                e.target.value
              )
            }
          />
        </div>
      </div>

      <PopularSearches
        active={activeSearch}
        onSelect={
          setActiveSearch
        }
      />

      <div className="results-header">
        <h2>
          {filteredBarbers.length} Results
        </h2>
      </div>

      <div className="search-grid">
        {filteredBarbers.map(
          (barber) => (
            <SearchCard
  key={barber.id}
  {...barber}
  onClick={() =>
    navigate(`/barber/${barber.slug}`)
  }
/>
          )
        )}
      </div>
    </section>
  );
};

export default SearchPage;