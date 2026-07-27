import { useState } from "react";
import { toast } from "sonner";

import {
  getCampaigns,
  createCampaign,
  deleteCampaign,
} from "../services/api";

const useCampaign = () => {
  const [campaigns, setCampaigns] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // ================= FETCH =================

  const fetchCampaigns =
    async () => {
      try {
        setLoading(true);

        const res =
          await getCampaigns();

        setCampaigns(
          res.data.data || []
        );
      } catch (err) {
        console.error(
          "Failed to fetch campaigns",
          err
        );

        toast.error(
          "Failed to fetch campaigns"
        );
      } finally {
        setLoading(false);
      }
    };

  // ================= CREATE =================

  const sendCampaign =
    async (payload) => {
      const loadingToast =
        toast.loading(
          "Sending campaign..."
        );

      try {
        const res =
          await createCampaign(
            payload
          );

        await fetchCampaigns();

        toast.dismiss(
          loadingToast
        );

        toast.success(
          "Campaign Sent Successfully"
        );

        return res.data;
      } catch (err) {
        toast.dismiss(
          loadingToast
        );

        toast.error(
          err?.response?.data
            ?.message ||
            "Failed To Send Campaign"
        );

        throw err;
      }
    };

  // ================= DELETE =================

  const removeCampaign =
    async (id) => {
      const loadingToast =
        toast.loading(
          "Deleting campaign..."
        );

      try {
        await deleteCampaign(id);

        setCampaigns((prev) =>
          prev.filter(
            (item) =>
              item._id !== id
          )
        );

        toast.dismiss(
          loadingToast
        );

        toast.success(
          "Campaign Deleted Successfully"
        );
      } catch (err) {
        toast.dismiss(
          loadingToast
        );

        toast.error(
          err?.response?.data
            ?.message ||
            "Failed To Delete Campaign"
        );

        throw err;
      }
    };

  return {
    campaigns,
    loading,
    fetchCampaigns,
    sendCampaign,
    removeCampaign,
  };
};

export default useCampaign;