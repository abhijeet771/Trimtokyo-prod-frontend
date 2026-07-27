import { useState } from "react";
import "./BookingSection.scss";

import useShopBarbers from "../../hooks/useShopBarbers";
import useCart from "../../hooks/useCart";
import useSearch from "../../hooks/useSearch";
import useFilter from "../../hooks/useFilter";
import useSort from "../../hooks/useSort";

import ShopCard from "../../components/molecules/ShopCard/ShopCard";
import ServiceModal from "../../components/organisms/ServiceModal/ServiceModal";
import CartPanel from "../../components/organisms/CartPanel/CartPanel";
import ReviewOverlay from "../../components/organisms/ReviewOverlay/ReviewOverlay";

import {
  SlidersHorizontal,
  LayoutGrid,
  Rows3,
} from "lucide-react";

const BookingSection = ({
  search = "",
  city = "",
  sort = "",
  filter = "",
}) => {
  const {
    barbers,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
  } = useShopBarbers({ city, search, sort });

  const cart = useCart();

  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [showCart, setShowCart] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const searched = useSearch(barbers, search);
  const filtered = useFilter(searched, filter);
  const processedBarbers = useSort(filtered, sort);

  const handleBook = (barber) => {
    setSelectedBarber(barber);
    setSelectedService(null);
  };

  const handleCloseModal = () => {
    setSelectedBarber(null);
    setSelectedService(null);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleAddToCart = (barberId, service) => {
    cart.addToCart(barberId, service);
    setShowCart(true);
  };

  const handleViewDetails = (barber) => {
    setSelectedBarber(barber);
    setShowReview(true);
  };

  const handleOverlayBook = (barber) => {
    setShowReview(false);
    setSelectedBarber(barber);
  };

  if (loading) {
    return (
      <section className="bookings">
        <div className="bookings__loading">
          Loading barbers...
        </div>
      </section>
    );
  }

  return (
    <section className="bookings">

      {/* TOP TOOLBAR */}
      <div className="bookings__toolbar">

        <div className="bookings__toolbar-left">

          <h2>
            Available Shops
          </h2>

          <p>
            {processedBarbers.length} results found
          </p>

        </div>

        <div className="bookings__toolbar-right">

          <button className="toolbar-btn">
            <SlidersHorizontal size={18} />

            <span>Sort</span>
          </button>

          <button className="toolbar-icon active">
            <LayoutGrid size={18} />
          </button>

          <button className="toolbar-icon">
            <Rows3 size={18} />
          </button>

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* GRID */}
      <div className="bookings__grid">

        {processedBarbers.length === 0 ? (
          <div className="bookings__empty">
            No barbers found.
          </div>
        ) : (
          processedBarbers.map((barber) => (
            <ShopCard
              key={barber._id}
              barber={barber}
              onBook={() => handleBook(barber)}
              onViewDetails={handleViewDetails}
            />
          ))
        )}

      </div>

      {/* PAGINATION */}
      <div className="bookings__pagination">

        <button
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>

        {Array.from(
          { length: totalPages },
          (_, i) => (
            <button
              key={i}
              className={
                currentPage === i + 1
                  ? "active"
                  : ""
              }
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            goToPage(currentPage + 1)
          }
        >
          Next
        </button>

      </div>

      {/* SERVICE MODAL */}
      {selectedBarber && !showReview && (
        <ServiceModal
          barber={selectedBarber}
          selectedService={selectedService}
          onSelectService={handleServiceSelect}
          onClose={handleCloseModal}
          onAdd={handleAddToCart}
        />
      )}

      {/* CART */}
      {showCart && (
        <CartPanel
          cart={cart}
          onClose={() => setShowCart(false)}
        />
      )}

      {/* REVIEW */}
      {showReview && selectedBarber && (
        <ReviewOverlay
          barberId={selectedBarber._id}
          onClose={() => setShowReview(false)}
          onBook={() =>
            handleOverlayBook(selectedBarber)
          }
        />
      )}

    </section>
  );
};

export default BookingSection;