import React, { useState } from "react";
import useBarberServicesPublic from "../../../hooks/useBarberServicesPublic";
import useSlots from "../../../hooks/useSlots";
import { bookSlot } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

import "./ServiceModal.scss";
const ServiceModal = ({  barber, onClose,  onAdd,}) => {
  const {   services,  loading,} = useBarberServicesPublic(
    barber?._id
  );

  const { slots, getSlots } = useSlots();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] =    useState("");
  const [activeService, setActiveService] =    useState(null);

  const [confirmSlot, setConfirmSlot] = useState(null);
  const [search, setSearch] = useState("");
  if (!barber) return null;
  const handleDateChange = async (date) => {
    const formattedDate = new Date(date)
      .toISOString()
      .split("T")[0];

    setSelectedDate(formattedDate);

    if (!formattedDate || !barber?.userId)
      return;

    await getSlots( formattedDate, barber.userId);
  };

  /* ================= CREATE BOOKING ================= */

  const handleBook = async (slotId) => {
  if (   !selectedDate ||    !barber?.userId ||    !activeService) {
    alert("Select service and date");
    return;
  }
  try {
    const response =  await bookSlot({ slotId, serviceId: activeService, phone: user.phone,});
    const result =  response.data;

    if (result.success) {
      alert("Booking Confirmed!");

      await getSlots(selectedDate,barber.userId);
    } else {
      alert(
        result.message ||"Booking failed"
      );
    }
  } catch (error) {
    alert(error?.response?.data  ?.message ||  "Booking failed"
    );
  }
};

  const availableSlots = slots.filter(
    (slot) =>slot.status === "AVAILABLE"  );

  // FILTER SERVICES
  const filteredServices =
    services.filter((service) =>
      service.title
        ?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* HEADER */}
        <div className="modal-header">
          <h3>  Select Date To Book Your Slot</h3>
          <button className="close-btn" onClick={onClose}> ✕ </button>
        </div>
        <div className="slot-date">
          <input type="date" onChange={(e) =>
              handleDateChange(  e.target.value)
            }
          />
        </div>
        <div className="service-search">
          <input type="text" placeholder="Search services..." value={search}
          onChange={(e) => setSearch( e.target.value)}/>
        </div>
        {loading && <p>Loading...</p>}

        {!loading && services.length === 0 && (
            <p>  No services available. </p>
          )}
        {/* SERVICES */}
        <div className="modal-services">
          {filteredServices.map(
            (service) => (
              <div key={service._id} className="modal-service-item">
         
                {service.imageUrl ? (
                  <img  src={service.imageUrl}   alt={service.title}   className="service-image"/>) : (
                  <div className="service-image placeholder"> No Image</div>
                )}

                <div className="service-info">
                  <h4> {service.title} </h4>
                  <p> ₹{service.price} •{" "} {service.duration}{" "}mins</p>
                  <p className="service-gender">
                    {service.gender ===  "male" &&"Male"}
                    {service.gender ==="female" && "Female"}
                    {service.gender ===  "other" &&  "Other"}
                    {!service.gender && "N/A"}
                  </p>
                </div>

                <div className="service-actions">
                  <button className="add-btn" onClick={() =>
                      onAdd( barber._id, service)}>
                    Add
                  </button>
                  <button
                    className="slot-btn"
                    onClick={() =>setActiveService(  service._id)}>
                    Book Slot
                  </button>
                </div>

                {/* SLOTS */}

                {activeService === service._id && (
                  <div className="slots">
                    {!selectedDate && (
                      <p> Please select a date </p>
                    )}

                    {selectedDate &&
                      availableSlots.length ===0 && (
                        <p> No slots available</p>
                      )}

                    {availableSlots.map(
                      (slot) => (
                        <button key={slot._id} onClick={() =>
                           setConfirmSlot( slot)
                          }>
                          { slot.startTime}{" "}-{" "}{slot.endTime}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* CONFIRM DIALOG */}

        {confirmSlot && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <h4> Confirm Booking</h4>
              <p> Are you sure you want to  book this slot?
              </p>

              <p className="slot-time">
                { confirmSlot.startTime}{" "}-{" "}
                {confirmSlot.endTime}
              </p>

              <div className="confirm-actions">
                <button
                  className="yes-btn"
                  onClick={async () => {
                    const slotId =
                      confirmSlot._id;
                    setConfirmSlot(null);
                    await handleBook(slotId);
                  }}
                >
                  Yes
                </button>

                <button className="no-btn" onClick={() => setConfirmSlot( null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceModal;