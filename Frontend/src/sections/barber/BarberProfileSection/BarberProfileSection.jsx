import React, { useEffect, useState } from "react";
import { MapPin, Save, LoaderCircle } from "lucide-react";
import useBarberProfile from "../../../hooks/barber/useBarberProfile";
import { BARBER_TEXT } from "../../../constants/barber";
import "./BarberProfileSection.scss";

const BarberProfileSection = () => {
  const { profile, addProfile, updateProfile, loading } =
    useBarberProfile();

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

  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        businessType: profile.businessType || "salon",
        shopName: profile.shopName || "",
        description: profile.description || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        profileImage: profile.profileImage || "",
        registrationDate: profile.registrationDate?.slice(0, 10) || "",
        instagramId: profile.instagramId || "",
        googleMapLink: profile.googleMapLink || "",
        slug: profile.slug || "",
        isDeliveryAvailable: profile.isDeliveryAvailable ?? true,
        deliveryRadiusKm: profile.deliveryRadiusKm ?? 5,
      });

      if (profile.location?.coordinates) {
        const [lng, lat] = profile.location.coordinates;
        setLocation({ type: "Point", coordinates: [lng, lat] });
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({
          type: "Point",
          coordinates: [longitude, latitude],
        });

        setLocationLoading(false);
        alert("Location captured successfully!");
      },
      () => {
        setLocationLoading(false);
        alert("Unable to retrieve location");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    try {
      if (!location) {
        alert("Please detect your shop location first.");
        return;
      }

      setSaving(true);

      const payload = {
        ...form,
        deliveryRadiusKm: Number(form.deliveryRadiusKm),
        location,
      };

      if (!profile) {
        await addProfile(payload);
        alert("Barber submitted for approval");
      } else {
        await updateProfile(payload);
        alert("Barber updated. Awaiting approval.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="barber-profile__loading">Loading...</div>;
  }

  const disabled = profile?.status === "PENDING";

  return (
    <div className="barber-profile">
      <div className="barber-profile__header">
        <h3>{BARBER_TEXT.profile.title}</h3>

        {profile && (
          <span
            className={`barber-profile__status barber-profile__status--${profile.status?.toLowerCase()}`}
          >
            {profile.status}
          </span>
        )}
      </div>

      {disabled && (
        <div className="barber-profile__warning">
          Barber is under review. Editing disabled.
        </div>
      )}

      <form className="barber-profile__form" onSubmit={handleSubmit}>
        <div className="barber-profile__grid">
          <div className="barber-profile__field">
            <label htmlFor="businessType">Business Type</label>
            <select
              id="businessType"
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              disabled={disabled}
            >
              <option value="salon">Salon</option>
              <option value="solo">Solo Barber</option>
            </select>
          </div>

          <div className="barber-profile__field">
            <label htmlFor="shopName">Shop Name</label>
            <input
              id="shopName"
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              placeholder="Shop Name"
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field barber-profile__field--full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field">
            <label htmlFor="profileImage">Profile Image URL</label>
            <input
              id="profileImage"
              name="profileImage"
              type="url"
              value={form.profileImage}
              onChange={handleChange}
              placeholder="Profile Image URL"
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field barber-profile__field--full">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field">
            <label htmlFor="registrationDate">Registration Date</label>
            <input
              id="registrationDate"
              type="date"
              name="registrationDate"
              value={form.registrationDate}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field">
            <label htmlFor="instagramId">Instagram</label>
            <input
              id="instagramId"
              name="instagramId"
              value={form.instagramId}
              onChange={handleChange}
              placeholder="Instagram Username or Link"
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field">
            <label htmlFor="googleMapLink">Google Maps Link</label>
            <input
              id="googleMapLink"
              name="googleMapLink"
              type="url"
              value={form.googleMapLink}
              onChange={handleChange}
              placeholder="Google Maps Link"
              disabled={disabled}
            />
          </div>

          <div className="barber-profile__field">
            <label htmlFor="slug">Custom URL Slug</label>
            <input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="Custom URL Slug"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="barber-profile__delivery">
          <label className="barber-profile__checkbox">
            <input
              type="checkbox"
              name="isDeliveryAvailable"
              checked={form.isDeliveryAvailable}
              onChange={handleChange}
              disabled={disabled}
            />
            <span>Delivery Available</span>
          </label>

          {form.isDeliveryAvailable && (
            <div className="barber-profile__field barber-profile__radius">
              <label htmlFor="deliveryRadiusKm">
                Delivery Radius (KM)
              </label>
              <input
                id="deliveryRadiusKm"
                type="number"
                name="deliveryRadiusKm"
                min="1"
                value={form.deliveryRadiusKm}
                onChange={handleChange}
                placeholder="Delivery Radius (KM)"
                disabled={disabled}
              />
            </div>
          )}
        </div>

        <div className="barber-profile__location">
          <div className="barber-profile__location-info">
            <MapPin size={19} />
            <span>
              {location
                ? "Shop location captured"
                : "Shop location not detected"}
            </span>
          </div>

          <button
            type="button"
            className="barber-profile__location-button"
            onClick={handleDetectLocation}
            disabled={disabled || locationLoading}
          >
            {locationLoading ? "Detecting..." : location ? "Refresh Location" : "Detect Shop Location"}
          </button>
        </div>

        <div className="barber-profile__footer">
          <button
            type="submit"
            className="barber-profile__submit"
            disabled={disabled || saving || locationLoading}
          >
            <Save size={17} />
            {saving ? (
              <>
                <LoaderCircle size={17} className="barber-profile__spinner" />
                Saving...
              </>
            ) : profile ? (
              "Update Barber"
            ) : (
              "Submit Barber"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BarberProfileSection;
