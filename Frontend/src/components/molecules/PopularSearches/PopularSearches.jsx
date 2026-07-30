import "./PopularSearches.scss";

const SEARCH_TAGS = [
  "Haircut",
  "Fade",
  "Beard",
  "Hair Spa",
  "Hair Coloring",
  "Keratin",
  "Luxury Salon",
  "Boutique",
  "Kids Haircut",
  "Men's Salon",
  "Women's Salon",
  "Bridal",
  "Styling",
  "Massage",
  "Nail Care",
];

const PopularSearches = ({
  active = "",
  onSelect,
}) => {
  return (
    <div className="popular-searches">
      <h3>Popular Searches</h3>

      <div className="popular-searches__chips">
        {SEARCH_TAGS.map((item) => (
          <button
            key={item}
            className={
              active === item
                ? "chip active"
                : "chip"
            }
            onClick={() =>
              onSelect?.(item)
            }
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearches;