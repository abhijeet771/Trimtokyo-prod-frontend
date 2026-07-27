import React, { useEffect, useState } from "react";
import useBarberProfile from "../../hooks/useBarberProfile";
import { BARBER_TEXT } from "../../constants/barber";
import "./BarberProfileSection.scss";

const BarberProfileSection = () => {
  const {
    profile,
    addProfile,
    updateProfile,
    loading,
  } = useBarberProfile();

  const [form, setForm] = useState({
    businessType: "salon",
    shopName: "",
    description: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    profileImage: "",
    registrationDate: "",
    instagramId: "",
    googleMapLink: "",
    slug: "",
    isDeliveryAvailable: true,
    deliveryRadiusKm: 5,
  });

  const [location, setLocation] =
    useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        businessType:
          profile.businessType || "salon",

        shopName:
          profile.shopName || "",

        description:
          profile.description || "",

        phone:
          profile.phone || "",

        address:
          profile.address || "",

        city:
          profile.city || "",

        state:
          profile.state || "",

        profileImage:
          profile.profileImage || "",

        registrationDate:
          profile.registrationDate?.slice(0, 10) ||
          "",

        instagramId:
          profile.instagramId || "",

        googleMapLink:
          profile.googleMapLink || "",

        slug:
          profile.slug || "",

        isDeliveryAvailable:
          profile.isDeliveryAvailable ?? true,

        deliveryRadiusKm:
          profile.deliveryRadiusKm || 5,
      });

      if (profile.location?.coordinates) {
        const [lng, lat] =
          profile.location.coordinates;

        setLocation({
          type: "Point",
          coordinates: [lng, lat],
        });
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          position.coords.latitude;

        const lng =
          position.coords.longitude;

        setLocation({
          type: "Point",
          coordinates: [lng, lat],
        });

        setLocationLoading(false);

        alert(
          "Location captured successfully!"
        );
      },
      () => {
        setLocationLoading(false);

        alert(
          "Unable to retrieve location"
        );
      }
    );
  };

  const handleSubmit = async () => {
    try {
      if (!location) {
        alert(
          "Please detect your shop location first."
        );

        return;
      }

      const payload = {
        ...form,
        deliveryRadiusKm: Number(
          form.deliveryRadiusKm
        ),
        location,
      };

      if (!profile) {
        await addProfile(payload);

        alert(
          "Barber submitted for approval"
        );
      } else {
        await updateProfile(payload);

        alert(
          "Barber updated. Awaiting approval."
        );
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="barber-profile">

      <h3>
        {BARBER_TEXT.profile.title}
      </h3>

      {profile && (
        <div
          className={`status-badge ${profile.status?.toLowerCase()}`}
        >
          Status: {profile.status}
        </div>
      )}

      {profile?.status === "PENDING" && (
        <div className="warning">
          Barber is under review.
          Editing disabled.
        </div>
      )}

      <div className="profile-form">

        {/* BUSINESS TYPE */}

        <select
          name="businessType"
          value={form.businessType}
          onChange={handleChange}
          disabled={
            profile?.status === "PENDING"
          }
        >
          <option value="salon">
            Salon
          </option>

          <option value="solo">
            Solo Barber
          </option>
        </select>

        {/* SHOP NAME */}

        <input
          name="shopName"
          value={form.shopName}
          onChange={handleChange}
          placeholder="Shop Name"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* DESCRIPTION */}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* PHONE */}

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* ADDRESS */}

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* CITY */}

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* STATE */}

        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* PROFILE IMAGE */}

        <input
          name="profileImage"
          value={form.profileImage}
          onChange={handleChange}
          placeholder="Profile Image URL"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* REGISTRATION DATE */}

        <input
          type="date"
          name="registrationDate"
          value={form.registrationDate}
          onChange={handleChange}
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* INSTAGRAM */}

        <input
          name="instagramId"
          value={form.instagramId}
          onChange={handleChange}
          placeholder="Instagram Username or Link"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* GOOGLE MAP */}

        <input
          name="googleMapLink"
          value={form.googleMapLink}
          onChange={handleChange}
          placeholder="Google Maps Link"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* SLUG */}

        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Custom URL Slug"
          disabled={
            profile?.status === "PENDING"
          }
        />

        {/* DELIVERY */}

        <label className="delivery-checkbox">
          <input
            type="checkbox"
            name="isDeliveryAvailable"
            checked={
              form.isDeliveryAvailable
            }
            onChange={handleChange}
            disabled={
              profile?.status ===
              "PENDING"
            }
          />

          Delivery Available
        </label>

        {/* DELIVERY RADIUS */}

        {form.isDeliveryAvailable && (
          <input
            type="number"
            name="deliveryRadiusKm"
            value={form.deliveryRadiusKm}
            onChange={handleChange}
            placeholder="Delivery Radius (KM)"
            disabled={
              profile?.status ===
              "PENDING"
            }
          />
        )}

        {/* LOCATION */}

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={
            profile?.status ===
              "PENDING" ||
            locationLoading
          }
        >
          {locationLoading
            ? "Detecting..."
            : location
            ? "Location Captured ✓"
            : "Detect Shop Location"}
        </button>

        {/* SUBMIT */}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            profile?.status === "PENDING"
          }
        >
          {profile
            ? "Update Barber"
            : "Submit Barber"}
        </button>

      </div>
    </div>
  );
};

export default BarberProfileSection;