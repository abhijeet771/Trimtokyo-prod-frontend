import { useNavigate } from "react-router-dom";
import "./ExploreCategory.scss";

const categories = [
  {
    id: 1,
    name: "Haircut",
    image: "/services/h1.png",
  },
  {
    id: 2,
    name: "Beard Trim",
    image: "/services/h2.png",
  },
  {
    id: 3,
    name: "Hair Styling",
    image: "/services/h3.png",
  },
  {
    id: 4,
    name: "Facial",
    image: "/services/h4.png",
  },
  {
    id: 5,
    name: "Hair Color",
    image: "/services/h5.png",
  },
  {
    id: 6,
    name: "Kids Haircut",
    image: "/services/h6.png",
  },
];

const ExploreCategory = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/search?q=${encodeURIComponent(category)}`);
  };

  return (
    <section className="explore-category">
      <div className="explore-category__container">
        <h2 className="explore-category__title">
          Explore by Category
        </h2>

        <div className="explore-category__list">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="explore-category__card"
              onClick={() => handleCategoryClick(category.name)}
              aria-label={`Explore ${category.name} services`}
            >
              <div className="explore-category__image">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                />
              </div>

              <span className="explore-category__name">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCategory;
