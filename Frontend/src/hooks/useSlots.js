import { useState } from "react";
import {
  getSlots as getSlotsAPI,
  createSlots as createSlotsAPI,
  bookSlot as bookSlotAPI,
} from "../services/api";

const useSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSlots = async (date, barberId) => {
    try {
      if (!date || !barberId) return;

      setLoading(true);

      const res = await getSlotsAPI(date, barberId);

      const slotData = res.data?.slots || [];

      setSlots(slotData);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const createSlots = async (form) => {
    try {
      setLoading(true);
      await createSlotsAPI(form);
      return true;
    } catch (err) {
      console.error("Error creating slots:", err.response?.data || err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔥 UPDATED WITH DEBUG LOGS
  const bookSlot = async ({ slotId, serviceId, phone }) => {
    try {
      // ✅ LOG WHAT YOU ARE SENDING
      console.log("BOOK REQUEST PAYLOAD:", {
        slotId,
        serviceId,
        phone,
      });

      if (!slotId || !serviceId || !phone) {
        console.error("❌ Missing booking data:", {
          slotId,
          serviceId,
          phone,
        });
        throw new Error("Missing booking data");
      }

      const res = await bookSlotAPI({
        slotId,
        serviceId,
        phone,
      });

      // ✅ LOG SUCCESS RESPONSE
      console.log("✅ Booking success response:", res.data);

      return true;
    } catch (err) {
      // ✅ SHOW ACTUAL BACKEND ERROR
      console.error("❌ Error booking slot:", err.response?.data || err);

      return false;
    }
  };

  return {
    slots,
    loading,
    getSlots,
    createSlots,
    bookSlot,
  };
};

export default useSlots;