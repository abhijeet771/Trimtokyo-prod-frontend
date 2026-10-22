
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Trash2, RefreshCw, CalendarDays } from "lucide-react";

import useBarberSlots from "../../hooks/barber/useBarberSlots";
import "./BarberGeneratedSlots.scss";

const PAGE_SIZE = 6;

const BarberGeneratedSlots = () => {
  const {
    slots,
    loading,
    deletingId,
    error,
    fetchBarberSlots,
    deleteBarberSlot,
    clearError,
  } = useBarberSlots();

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const refreshSlots = useCallback(async () => {
    await fetchBarberSlots();
  }, [fetchBarberSlots]);

  // Load slots when the generated-slots component mounts.
  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  const getSlotDate = (slot) => {
    const value = slot.date || slot.startDate || slot.startTime;

    if (!value) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
      return String(value);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value).slice(0, 10);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStartTime = (slot) => {
    if (slot.startTime || slot.start) {
      return slot.startTime || slot.start;
    }

    if (slot.startDate) {
      return new Date(slot.startDate).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return "—";
  };

  const getEndTime = (slot) => {
    if (slot.endTime || slot.end) {
      return slot.endTime || slot.end;
    }

    if (slot.endDate) {
      return new Date(slot.endDate).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return "—";
  };

  const filteredSlots = useMemo(() => {
    const query = search.trim().toLowerCase();

    return slots.filter((slot) => {
      const date = getSlotDate(slot);
      const start = String(getStartTime(slot)).toLowerCase();
      const end = String(getEndTime(slot)).toLowerCase();

      const matchesSearch =
        !query ||
        date.toLowerCase().includes(query) ||
        start.includes(query) ||
        end.includes(query);

      const matchesDate = !selectedDate || date === selectedDate;

      return matchesSearch && matchesDate;
    });
  }, [slots, search, selectedDate]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSlots.length / PAGE_SIZE)
  );

  const paginatedSlots = filteredSlots.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDate]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (slot) => {
    const slotId = slot._id || slot.id;

    if (!slotId) {
      window.alert("This slot has no ID, so it cannot be deleted.");
      return;
    }

    if (slot.status?.toUpperCase() !== "AVAILABLE") {
      window.alert("Only available slots can be deleted.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this generated slot?"
    );

    if (!confirmed) return;

    const result = await deleteBarberSlot(slotId);

    if (result?.success) {
      clearError?.();
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedDate("");
    setCurrentPage(1);
  };

  return (
    <section className="generated-slots">
      <div className="generated-slots__header">
        <div>
          <h3>Generated Slots</h3>
          <p>View and manage the availability slots you have created.</p>
        </div>

        <button
          type="button"
          className="generated-slots__refresh"
          onClick={refreshSlots}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="generated-slots__summary">
        <div className="generated-slots__summary-icon">
          <CalendarDays size={20} />
        </div>

        <div>
          <span>Total slots</span>
          <strong>{slots.length}</strong>
        </div>
      </div>

      <div className="generated-slots__filters">
        <label className="generated-slots__search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search date or time..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <input
          className="generated-slots__date-filter"
          type="date"
          aria-label="Filter slots by date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
        />

        {(search || selectedDate) && (
          <button
            type="button"
            className="generated-slots__clear-filter"
            onClick={handleClearFilters}
          >
            Clear filters
          </button>
        )}
      </div>

      {error && (
        <div className="generated-slots__error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="generated-slots__state">
          Loading generated slots...
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="generated-slots__empty">
          <CalendarDays size={34} />
          <h4>No generated slots found</h4>
          <p>
            {slots.length === 0
              ? "Create availability slots to see them here."
              : "Try changing your search or date filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="generated-slots__table-wrap">
            <table className="generated-slots__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Start time</th>
                  <th>End time</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedSlots.map((slot) => {
                  const slotId = slot._id || slot.id;
                  const start = getStartTime(slot);
                  const end = getEndTime(slot);

                  const toMinutes = (time) => {
                    if (!/^\d{2}:\d{2}$/.test(time)) return null;

                    const [hours, minutes] = time.split(":").map(Number);
                    return hours * 60 + minutes;
                  };

                  const explicitDuration =
                    slot.duration ??
                    slot.durationMinutes ??
                    slot.slotDuration;

                  const calculatedDuration =
                    toMinutes(start) !== null && toMinutes(end) !== null
                      ? toMinutes(end) - toMinutes(start)
                      : null;

                  const duration =
                    explicitDuration ?? calculatedDuration;

                  const status = slot.status?.toUpperCase() || "AVAILABLE";
                  const isBooked = status === "BOOKED";
                  const isAvailable = status === "AVAILABLE";

                  return (
                    <tr key={slotId}>
                      <td>{formatDate(getSlotDate(slot))}</td>
                      <td>{start}</td>
                      <td>{end}</td>

                      <td>
                        {duration != null ? `${duration} min` : "—"}
                      </td>

                      <td>
                        <span
                          className={`generated-slots__status ${
                            isBooked ? "is-booked" : "is-available"
                          }`}
                        >
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="generated-slots__delete"
                          onClick={() => handleDelete(slot)}
                          disabled={
                            String(deletingId) === String(slotId) ||
                            !isAvailable
                          }
                          title={
                            !isAvailable
                              ? "Only available slots can be deleted"
                              : "Delete slot"
                          }
                        >
                          <Trash2 size={15} />
                          {String(deletingId) === String(slotId)
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="generated-slots__pagination">
            <span>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filteredSlots.length)} of{" "}
              {filteredSlots.length}
            </span>

            <div>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                {" "}
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default BarberGeneratedSlots;
