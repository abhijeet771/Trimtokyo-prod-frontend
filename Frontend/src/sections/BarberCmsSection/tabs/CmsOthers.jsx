import { useEffect, useState } from "react";

import {
  Globe,
  Instagram,
  Facebook,
  Youtube,
  MapPinned,
} from "lucide-react";

import { toast } from "sonner";

import useUpdateBarberCms from "../../../hooks/useUpdateBarberCms";

import {
  updateBarberCmsOthers,
} from "../../../services/api";

import "./CmsOthers.scss";

const CmsOthers = ({
  cms,
  refetch,
}) => {
  const [form, setForm] =
    useState({
      website: "",
      instagram: "",
      facebook: "",
      youtube: "",
      googleMaps: "",
    });

  const {
    mutate,
    isPending,
  } = useUpdateBarberCms(
    updateBarberCmsOthers
  );

  useEffect(() => {
    if (cms?.others) {
      setForm({
        website:
          cms.others.website || "",
        instagram:
          cms.others.instagram ||
          "",
        facebook:
          cms.others.facebook ||
          "",
        youtube:
          cms.others.youtube || "",
        googleMaps:
          cms.others.googleMaps ||
          "",
      });
    }
  }, [cms]);

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSave = () => {
  mutate(form, {
    onSuccess: (response) => {
      toast.success(
        response?.message ||
          "Settings updated successfully."
      );

      refetch?.();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to update settings."
      );
    },
  });
};

  return (
    <section className="cms-others">
      <div className="cms-others__header">
        <div>
          <h3>Other Settings</h3>

          <p>
            Manage your social
            media, website and map
            links.
          </p>
        </div>
      </div>

      <div className="others-grid">
        <div className="input-group">
          <label>
            <Globe size={18} />
            Website
          </label>

          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="input-group">
          <label>
            <Instagram size={18} />
            Instagram
          </label>

          <input
            type="text"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="Instagram URL"
          />
        </div>

        <div className="input-group">
          <label>
            <Facebook size={18} />
            Facebook
          </label>

          <input
            type="text"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            placeholder="Facebook URL"
          />
        </div>

        <div className="input-group">
          <label>
            <Youtube size={18} />
            YouTube
          </label>

          <input
            type="text"
            name="youtube"
            value={form.youtube}
            onChange={handleChange}
            placeholder="YouTube Channel URL"
          />
        </div>

        <div className="input-group full">
          <label>
            <MapPinned size={18} />
            Google Maps Link
          </label>

          <input
            type="text"
            name="googleMaps"
            value={form.googleMaps}
            onChange={handleChange}
            placeholder="Paste Google Maps URL"
          />
        </div>
      </div>

      <div className="save-bar">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : "Save Settings"}
        </button>
      </div>
    </section>
  );
};

export default CmsOthers;