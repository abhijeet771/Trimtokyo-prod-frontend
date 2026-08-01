import { useEffect, useState } from "react";
import {  Store,  MapPin,  Phone,  Mail,  Globe,  Clock,} from "lucide-react";
import { toast } from "sonner";
import useUpdateBarberCms from "../../../hooks/useUpdateBarberCms";
import "./CmsDetails.scss";
import {  updateBarberCmsDetails,} from "../../../services/api";

const CmsDetails = ({
  cms,
  refetch,
}) => {
  const [form, setForm] =
    useState({
      salonName: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      openingTime: "",
      closingTime: "",
    });

const {  mutate,  isPending,} = useUpdateBarberCms(  updateBarberCmsDetails);

  useEffect(() => {
    if (cms?.details) {
      setForm({
        salonName:
          cms.details.salonName || "",
        description:
          cms.details.description ||
          "",
        address:
          cms.details.address || "",
        phone:
          cms.details.phone || "",
        email:
          cms.details.email || "",
        website:
          cms.details.website || "",
        openingTime:
          cms.details.openingTime ||
          "",
        closingTime:
          cms.details.closingTime ||
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
            "Details updated successfully."
        );

        refetch?.();
      },

      onError: (error) => {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update details."
        );
      },
    });
  };

  return (
    <section className="cms-details">
      <div className="cms-details__header">
        <div>
          <h3>Salon Details</h3>
          <p>
            Update the information
            displayed on your public
            salon page.
          </p>
        </div>
      </div>

      <div className="details-grid">
        <div className="input-group full">
          <label>
            <Store size={18} />
            Salon Name
          </label>

          <input
            type="text"
            name="salonName"
            value={form.salonName}
            onChange={handleChange}
            placeholder="Enter salon name"
          />
        </div>

        <div className="input-group full">
          <label>Description</label>

          <textarea
            rows="5"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell customers about your salon..."
          />
        </div>

        <div className="input-group">
          <label>
            <MapPin size={18} />
            Address
          </label>

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Salon address"
          />
        </div>

        <div className="input-group">
          <label>
            <Phone size={18} />
            Phone
          </label>

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div className="input-group">
          <label>
            <Mail size={18} />
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="support@email.com"
          />
        </div>

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
            placeholder="https://..."
          />
        </div>

        <div className="input-group">
          <label>
            <Clock size={18} />
            Opening Time
          </label>

          <input
            type="time"
            name="openingTime"
            value={form.openingTime}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>
            <Clock size={18} />
            Closing Time
          </label>

          <input
            type="time"
            name="closingTime"
            value={form.closingTime}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="save-bar">
        <button className="save-btn" onClick={handleSave} disabled={isPending}>
          {isPending  ? "Saving..." : "Save Details"}
        </button>
      </div>
    </section>
  );
};

export default CmsDetails;