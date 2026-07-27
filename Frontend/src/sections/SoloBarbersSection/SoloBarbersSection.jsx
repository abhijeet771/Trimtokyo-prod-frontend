import "./SoloBarbersSection.scss";

import { useNavigate } from "react-router-dom";

import ServiceCard from "../../components/molecules/ServiceCard/ServiceCard";
import Button from "../../components/atoms/Button/Button";
import useFeaturedBarbers from "../../hooks/useFeaturedBarbers";

const SoloBarbersSection = () => {
  const navigate = useNavigate();

  const {
    featuredBarbers: soloBarbers,
    loading,
    error,
  } = useFeaturedBarbers({
    businessType: "solo",
    limit: 4,
  });

  return (
    <section className="solo-barbers">

      <div className="solo-barbers__container">

        {/* HEADER */}
        <div className="solo-barbers__header">

          <span className="solo-barbers__badge">
            Premium Solo Experts
          </span>

          <h2 className="solo-barbers__title">
            Solo Barbers Near You
          </h2>

          <p className="solo-barbers__subtitle">
            Handpicked independent barbers trained in
            premium styling, grooming, beard design,
            and modern haircuts.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="solo-barbers__state">
            Loading solo barbers...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="solo-barbers__state solo-barbers__state--error">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          soloBarbers.length === 0 && (
            <div className="solo-barbers__state">
              No solo barbers available right now.
            </div>
          )}

        {/* GRID */}
        {!loading &&
          !error &&
          soloBarbers.length > 0 && (
            <div className="solo-barbers__grid">

              {soloBarbers.map(
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

                    badgeText="Javed Habib Trained"

                    redirectTo="/auth"
                  />
                )
              )}

            </div>
          )}

        {/* VIEW ALL */}
        <div className="solo-barbers__view-all">

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/auth")
            }
          >
            Explore Solo Barbers
          </Button>

        </div>

      </div>
    </section>
  );
};

export default SoloBarbersSection;