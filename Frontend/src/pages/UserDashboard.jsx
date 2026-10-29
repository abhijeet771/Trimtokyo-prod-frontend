
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Shopheader from "../sections/User/Shopheader/Shopheader";
import UserSideBar from "../components/User/UserSideBar/UserSideBar";

import UserOverviewSection from "../sections/User/UserOverviewSection/UserOverviewSection";
import UserCartSection from "../sections/User/UserCartSection/UserCartSection";
import UserOrderSection from "../sections/User/UserOrderSection/UserOrderSection";
import UserSlotBookingSection from "../sections/User/UserSlotBookingSection/UserSlotBookingSection";
import UserProfileSection from "../sections/User/UserProfileSection/UserProfileSection";
import UserHelpSection from "../sections/User/UserHelpSection/UserHelpSection";
import UserNotificationSection from "../sections/User/UserNotificationSection/UserNotificationSection";
import UserSettingsSection from "../sections/User/UserSettingsSection/UserSettingsSection";
import UserSupportSection from "../sections/User/UserSupportSection/UserSupportSection";
import UserRefferalSection from "../sections/User/UserRefferalSection/UserRefferalSection";

import AppointmentsSection from "../sections/User/AppointmentsSection/AppointmentsSection";
import SlotBookingDetailsSection from "../sections/User/SlotBookingDetailsSection/SlotBookingDetailsSection";

import ViewOrderDialog from "../components/User/ViewOrderDialog/ViewOrderDialog";

import { useCart } from "../context/CartContext";
import { getMyOrders } from "../services/order.service.js";
import { createBooking } from "../services/slotBooking.service";

import "./UserDashboard.scss";

const ALLOWED_SECTIONS = [
  "overview",
  "cart",
  "orders",
  "slot-bookings",
  "appointments",
  "profile",
  "help",
  "notifications",
  "referrals",
  "settings",
  "support",
];

const getSlotId = (slot) => {
  if (!slot || typeof slot !== "object") return "";

  return String(slot._id || slot.slotId || slot.id || "");
};

const getSlotValue = (slot) => {
  if (!slot) return "";

  if (typeof slot === "string") return slot;

  if (slot.label || slot.timeSlot || slot.time) {
    return slot.label || slot.timeSlot || slot.time;
  }

  const start = slot.startTime || slot.start || slot.from;
  const end = slot.endTime || slot.end || slot.to;

  return [start, end].filter(Boolean).join(" - ");
};

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [activeSection, setActiveSection] = useState(
    location.state?.activeSection || "cart"
  );

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Appointment flow state
  const [bookingDraft, setBookingDraft] = useState(
    location.state?.bookingDraft || null
  );

  const [selectedDate, setSelectedDate] = useState(
    location.state?.bookingDraft?.date || ""
  );

  // Keep the full slot object, not just its display label.
  const [selectedSlot, setSelectedSlot] = useState(
    location.state?.bookingDraft?.slot || null
  );

  const [selectedService, setSelectedService] = useState(
    location.state?.bookingDraft?.service || null
  );

  const [selectedShop, setSelectedShop] = useState(
    location.state?.bookingDraft?.shop || null
  );

  const [appointmentStep, setAppointmentStep] = useState(
    location.state?.appointmentStep || 1
  );

  const {
    cartItems,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // Booking data will be fetched through the booking API separately.
  const [bookings, setBookings] = useState([]);

  // Handle navigation state from other pages.
  useEffect(() => {
    const navigationState = location.state;

    if (!navigationState) return;

    const requestedSection = navigationState.activeSection;
    const incomingDraft = navigationState.bookingDraft;

    if (
      requestedSection &&
      ALLOWED_SECTIONS.includes(requestedSection)
    ) {
      setActiveSection(requestedSection);
    }

    if (requestedSection === "appointments") {
      if (incomingDraft) {
        setBookingDraft(incomingDraft);
        setSelectedService(incomingDraft.service || null);
        setSelectedShop(incomingDraft.shop || null);
        setSelectedDate(incomingDraft.date || "");
        setSelectedSlot(incomingDraft.slot || null);
        setAppointmentStep(
          navigationState.appointmentStep || 1
        );
      } else {
        setBookingDraft(null);
        setSelectedDate("");
        setSelectedSlot(null);
        setSelectedService(null);
        setSelectedShop(null);
        setAppointmentStep(1);
      }
    }

    // Clear navigation state after processing it.
    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [
    location.key,
    location.pathname,
    location.state,
    navigate,
  ]);

  // Fetch orders when the Orders section is opened.
  useEffect(() => {
    if (activeSection !== "orders") return;

    let isMounted = true;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const response = await getMyOrders();
        const result = response?.data;

        if (result?.success === false) {
          throw new Error(
            result?.message || "Failed to fetch orders."
          );
        }

        const orderData =
          result?.data?.orders ??
          result?.data ??
          result?.orders ??
          [];

        if (isMounted) {
          setOrders(
            Array.isArray(orderData) ? orderData : []
          );
        }
      } catch (error) {
        if (isMounted) {
          setOrdersError(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to load your orders."
          );
        }
      } finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [activeSection]);

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  const handleViewBookingDetails = (booking) => {
    console.log("Selected booking:", booking);
  };

  const handleDateTimeContinue = ({
    date,
    slot,
    slotId,
    service,
    shop,
  }) => {
    const resolvedSlotId = slotId || getSlotId(slot);

    if (!date || !slot || !resolvedSlotId) {
      console.error(
        "Date, slot, or slot ID is missing.",
        { date, slot, slotId }
      );
      return;
    }

    const resolvedService = service || selectedService;
    const resolvedShop = shop || selectedShop;

    setSelectedDate(date);
    setSelectedSlot(slot);

    if (resolvedService) {
      setSelectedService(resolvedService);
    }

    if (resolvedShop) {
      setSelectedShop(resolvedShop);
    }

    setBookingDraft((previousDraft) => ({
      ...(previousDraft || {}),
      ...(resolvedShop ? { shop: resolvedShop } : {}),
      ...(resolvedService
        ? { service: resolvedService }
        : {}),
      date,
      slot,
      slotId: String(resolvedSlotId),
    }));

    setAppointmentStep(3);
  };

  const handleBookAppointment = async (bookingDetails) => {
    const service = bookingDetails?.service || selectedService;
    const shop = bookingDetails?.shop || selectedShop;
    const slot = bookingDetails?.slot || selectedSlot;

    const serviceId =
      bookingDetails?.serviceId ||
      service?._id ||
      service?.serviceId ||
      service?.id;

    const slotId =
      bookingDetails?.slotId ||
      bookingDraft?.slotId ||
      getSlotId(slot);

    const barberProfileId =
      bookingDetails?.barberProfileId ||
      shop?.barberProfileId ||
      shop?.barberId ||
      shop?._id ||
      shop?.id ||
      service?.barberProfileId ||
      service?.barberId;

    if (!serviceId) {
      throw new Error(
        "Service ID is missing. Please select the service again."
      );
    }

    if (!slotId) {
      throw new Error(
        "Slot ID is missing. Please select an available time slot again."
      );
    }

    if (!barberProfileId) {
      throw new Error(
        "Barber profile ID is missing. Please return to the salon and select the service again."
      );
    }

    if (!bookingDetails?.phone) {
      throw new Error("Customer phone number is required.");
    }

    const payload = {
      slotId: String(slotId),
      serviceId: String(serviceId),
      barberProfileId: String(barberProfileId),
      name: bookingDetails.name,
      phone: bookingDetails.phone,
      email: bookingDetails.email || "",
      address: bookingDetails.address || "",
      notes: bookingDetails.notes || "",
      date: bookingDetails.date || selectedDate,
      timeSlot:
        bookingDetails.timeSlot || getSlotValue(slot),
    };

    try {
      const response = await createBooking(payload);
      const responseData = response?.data;

      if (responseData?.success === false) {
        throw new Error(
          responseData?.message ||
            "Failed to book appointment."
        );
      }

      const savedBooking =
        responseData?.booking ||
        responseData?.data?.booking ||
        responseData?.data ||
        responseData;

      if (!savedBooking) {
        throw new Error(
          "The server did not return booking details."
        );
      }

      setBookings((previous) => [
        savedBooking,
        ...previous,
      ]);

      return {
        success: true,
        booking: savedBooking,
        data: responseData,
        message:
          responseData?.message ||
          "Appointment booked successfully.",
      };
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to book your appointment. Please try again."
      );
    }
  };

  const handleOpenAppointments = () => {
    setBookingDraft(null);
    setSelectedDate("");
    setSelectedSlot(null);
    setSelectedService(null);
    setSelectedShop(null);
    setAppointmentStep(1);
    setActiveSection("appointments");
  };

  const handleBackToDateTime = () => {
    setAppointmentStep(1);
  };

  const renderCartSection = () => (
    <UserCartSection
      cartItems={cartItems}
      onRemoveItem={removeItem}
      onUpdateQuantity={updateQuantity}
      onClearCart={clearCart}
    />
  );

  const renderAppointmentsSection = () => (
    <div className="user-dashboard-page__appointments">
      {appointmentStep === 1 && (
        <AppointmentsSection
          bookingDraft={bookingDraft}
          onContinue={handleDateTimeContinue}
        />
      )}

      {appointmentStep === 3 && (
        <>
          <button
            type="button"
            className="user-dashboard-page__back-button"
            onClick={handleBackToDateTime}
          >
            ← Back to date and time
          </button>

          <SlotBookingDetailsSection
            bookingDraft={{
              ...(bookingDraft || {}),
              date: selectedDate,
              slot: selectedSlot,
              slotId:
                bookingDraft?.slotId ||
                getSlotId(selectedSlot),
              service: selectedService,
              shop: selectedShop,
            }}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            selectedService={selectedService}
            selectedShop={selectedShop}
            onBookAppointment={handleBookAppointment}
          />
        </>
      )}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <UserOverviewSection />;

      case "cart":
        return renderCartSection();

      case "orders":
        return (
          <>
            {ordersError && (
              <p
                className="user-dashboard-page__error"
                role="alert"
              >
                {ordersError}
              </p>
            )}

            <UserOrderSection
              orders={orders}
              loading={ordersLoading}
              onViewDetails={handleViewOrderDetails}
            />
          </>
        );

      case "slot-bookings":
        return (
          <UserSlotBookingSection
            bookings={bookings}
            onViewDetails={handleViewBookingDetails}
          />
        );

      case "appointments":
        return renderAppointmentsSection();

      case "profile":
        return <UserProfileSection />;

      case "help":
        return <UserHelpSection />;

      case "referrals":
        return <UserRefferalSection />;

      case "notifications":
        return <UserNotificationSection />;

      case "settings":
        return <UserSettingsSection />;

      case "support":
        return <UserSupportSection />;

      default:
        return renderCartSection();
    }
  };

  return (
    <div
      className={`user-dashboard-page ${
        sidebarCollapsed
          ? "user-dashboard-page--sidebar-collapsed"
          : ""
      }`}
    >
      <Shopheader />

      <div className="user-dashboard-page__layout">
        <UserSideBar
          collapsed={sidebarCollapsed}
          onCollapseChange={setSidebarCollapsed}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="user-dashboard-page__content">
          {renderSection()}
        </main>
      </div>

      {selectedOrder && (
        <ViewOrderDialog
          order={selectedOrder}
          onClose={handleCloseOrderDetails}
        />
      )}
    </div>
  );
};

export default UserDashboard;
