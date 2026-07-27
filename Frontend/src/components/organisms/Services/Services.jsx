import "./Services.scss";

import { useNavigate } from "react-router-dom";
import ServiceCard from "../../molecules/ServiceCard/ServiceCard";
import Button from "../../atoms/Button/Button";
import { SERVICES_CONTENT } from "../../../constants/services";
import useFeaturedBarbers from "../../../hooks/useFeaturedBarbers";

const Services = () => {
  const navigate = useNavigate();

  const {
    badge,
    title,
    subtitle,
    buttonText,
    emptyText,
  } = SERVICES_CONTENT;

  const {
    featuredBarbers,
    loading,
    error,
  } = useFeaturedBarbers({
    businessType: "salon",
    limit: 6,
  });

  const handleNavigateToShop =
    () => {
      navigate("/shop");
    };

  return (
    <section className="services">

      <div className="services__container">

        {/* HEADER */}
        <div className="services__header">

          <span className="services__badge">
            {badge}
          </span>

          <h2 className="services__title">
            {title}
          </h2>

          <p className="services__subtitle">
            {subtitle}
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="services__state">
            Loading featured salons...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="services__state services__state--error">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          featuredBarbers.length === 0 && (
            <div className="services__state">
              {emptyText}
            </div>
          )}

        {/* GRID */}
        {!loading &&
          !error &&
          featuredBarbers.length > 0 && (
            <div className="services__grid">

              {featuredBarbers.map(
                (barber) => (
                  <ServiceCard
                    key={barber._id}

                    _id={barber._id}

                    shopName={
                      barber.shopName
                    }

                    profileImage={
                      barber.profileImage
                    }

                    city={barber.city}

                    avgRating={
                      barber.avgRating
                    }

                    totalReviews={
                      barber.totalReviews
                    }

                    startingPrice={
                      barber.startingPrice
                    }

                    businessType={
                      barber.businessType
                    }

                    isDeliveryAvailable={
                      barber.isDeliveryAvailable
                    }
                  />
                )
              )}

            </div>
          )}

        {/* VIEW ALL */}
        <div className="services__view-all">

          <Button
            variant="secondary"
            onClick={
              handleNavigateToShop
            }
          >
            {buttonText}
          </Button>

        </div>

      </div>
    </section>
  );
};

export default Services;