import "./ShopBannerSection.scss";
import { SHOP_TEXT } from "../../constants/shop";

import {  Scissors,  Cat, Sparkles,
  Smile,
  Brush,
  Baby,
  House,
  Search,
  ChevronDown,
} from "lucide-react";

const categories = [
  {
    icon: <Scissors size={24} />,
    title: "Haircut",
  },
  {
    icon: <Cat size={24} />,
    title: "Beard",
  },
  {
    icon: <Sparkles size={24} />,
    title: "Hair Spa",
  },
  {
    icon: <Smile size={24} />,
    title: "Facial",
  },
  {
    icon: <Brush size={24} />,
    title: "Hair Color",
  },
  {
    icon: <Baby size={24} />,
    title: "Kids",
  },
  {
    icon: <House size={24} />,
    title: "Home Service",
  },
];

const ShopBannerSection = ({
  search,
  setSearch,
  city,
  setCity,
  sort,
  setSort,
  filter,
  setFilter,
}) => {
  return (
    <section className="shop-banner">
      <div className="shop-banner__container">

        {/* TOP */}
        <div className="shop-banner__top">

          {/* LEFT */}
          <div className="shop-banner__content">

            <div className="shop-banner__breadcrumb">
              <span>Home</span>

              <span className="divider">›</span>

              <span>Shop</span>
            </div>

            <h1 className="shop-banner__title">
              Find the best barbers & salons
            </h1>

            <p className="shop-banner__subtitle">
              Book from 120+ verified professionals in Purnea
            </p>

          </div>

          {/* RIGHT */}
          <div className="shop-banner__categories">

            {categories.map((item, index) => (
              <div
                className="shop-banner__category-card"
                key={index}
              >
                <div className="shop-banner__category-icon">
                  {item.icon}
                </div>

                <span>{item.title}</span>
              </div>
            ))}

          </div>

        </div>

        {/* FILTERS */}
        <div className="shop-banner__filters">

          {/* SEARCH */}
          <div className="shop-banner__search-wrapper">
            <Search size={18} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search salon, barber or service..."
              className="shop-banner__search"
            />
          </div>

          {/* LOCATION */}
          <div className="shop-banner__select-wrapper">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="shop-banner__select"
            >
              <option value="">All Locations</option>
              <option value="Purnia">Purnia</option>
              <option value="Katihar">Katihar</option>
              <option value="Banmankhi">Banmankhi</option>
            </select>

            <ChevronDown size={18} />
          </div>

          {/* TYPES */}
          <div className="shop-banner__select-wrapper">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="shop-banner__select"
            >
              <option value="">All Types</option>
              <option value="unisex">Unisex</option>
              <option value="gents">Gents</option>
            </select>

            <ChevronDown size={18} />
          </div>

          {/* SERVICES */}
          <div className="shop-banner__select-wrapper">
            <select className="shop-banner__select">
              <option value="">All Services</option>
              <option value="haircut">Haircut</option>
              <option value="spa">Hair Spa</option>
              <option value="facial">Facial</option>
            </select>

            <ChevronDown size={18} />
          </div>

          {/* SORT */}
          <div className="shop-banner__select-wrapper">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="shop-banner__select"
            >
              <option value="">Sort by Popularity</option>
              <option value="a-z">A → Z</option>
              <option value="z-a">Z → A</option>
            </select>

            <ChevronDown size={18} />
          </div>

          {/* BUTTON */}
          <button className="shop-banner__button">
            Search
          </button>

        </div>

      </div>
    </section>
  );
};

export default ShopBannerSection;