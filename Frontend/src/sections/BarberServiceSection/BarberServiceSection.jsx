import React, { useState, useEffect } from "react";
import {  Scissors,  UserRound,  Users,  Clock,Plus,} from "lucide-react";

import useBarberServices from "../../hooks/barber/useBarberServices";
import useBarberProfile from "../../hooks/barber/useBarberProfile";
import "./BarberServiceSection.scss";

const SERVICES_PER_PAGE = 5;
const INITIAL_FORM = {  title: "",  price: "",  duration: "",  description: "",  gender: "",imageUrl: "",};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const BarberServiceSection = () => {
  const {services = [], loading, error, createService,} = useBarberServices();
  const { profile } = useBarberProfile();
  const [form, setForm] = useState(INITIAL_FORM);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const isApproved = profile?.status === "APPROVED";
  const totalServices = services.length;
  const menServices = services.filter((service) => service.gender?.toLowerCase() === "male").length;
  const womenServices = services.filter((service) => service.gender?.toLowerCase() === "female").length;

  const averageDuration =
    totalServices > 0
      ? Math.round(services.reduce(
            (total, service) => total + (Number(service.duration) || 0),0) / totalServices
        )
      : 0;

  const totalPages = Math.ceil(totalServices / SERVICES_PER_PAGE);
  const indexOfLast = currentPage * SERVICES_PER_PAGE;
  const indexOfFirst = indexOfLast - SERVICES_PER_PAGE;
  const currentServices = services.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    } else if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value,}));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    if ( !form.title.trim() || form.price === "" || form.duration === "" || !form.gender)
    {
      alert("Please fill all required fields.");
      return;
    }

    if (Number(form.price) < 0 || Number(form.duration) <= 0) {
      alert("Enter a valid price and duration.");
      return;
    }

    if (!isApproved) {
      alert("Barber must be approved before adding services.");
      return;
    }

    try {
      setSubmitting(true);
      await createService({ ...form,
        title: form.title.trim(),
        price: Number(form.price),
        duration: Number(form.duration),
      });

      alert("Service submitted for approval.");

      setForm(INITIAL_FORM);
      setCurrentPage(1);
    } catch (err) {
      alert( err.response?.data?.message || "Something went wrong while creating the service.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="barber-services__loading">
        Loading services...
      </div>
    );
  }

  const kpis = [
    { label: "Total Services", value: totalServices, icon: Scissors, accent: "purple", },
    { label: "Men's Services", value: menServices, icon: UserRound, accent: "blue",},
    { label: "Women's Services", value: womenServices, icon: Users, accent: "pink", },
    { label: "Average Service Time", value: `${averageDuration} min`, icon: Clock, accent: "orange",},
  ];

  return (
    <section className="barber-services">
      {/* Header */}
      <header className="barber-services__header">
        <div>
          <h1>Manage Services</h1>
          <p>Manage your services, prices and durations.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="barber-services__kpis">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <article key={kpi.label} className="barber-services__kpi-card">
              <div className={`barber-services__kpi-icon barber-services__kpi-icon--${kpi.accent}`}>
                <Icon size={21} />
              </div>

              <div className="barber-services__kpi-content">
                <span>{kpi.label}</span>
                <strong>{kpi.value}</strong>
              </div>
            </article>
          );
        })}
      </div>

      {/* Error / approval notice */}
      {error && (
        <div className="barber-services__message barber-services__message--error">
          {typeof error === "string" ? error : error.message || "Unable to load services."}
        </div>
      )}

      {!isApproved && (
        <div className="barber-services__message barber-services__message--warning">
          Barber must be approved before adding services.
        </div>
      )}

      {/* Add Service Form */}
      <section className="barber-services__panel">
        <div className="barber-services__panel-header">
          <div>
            <h2>Add New Service</h2>
            <p>Enter the details of the service you offer.</p>
          </div>
        </div>

        <form className="barber-services__form" onSubmit={handleSubmit}>
          <div className="barber-services__field">
            <label htmlFor="service-title">Service Title *</label>
            <input
              id="service-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Classic Haircut"
              maxLength={120}
              required
            />
          </div>

          <div className="barber-services__field">
            <label htmlFor="service-price">Price (₹) *</label>
            <input
              id="service-price"
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="barber-services__field">
            <label htmlFor="service-duration">
              Duration (minutes) *
            </label>
            <input
              id="service-duration"
              type="number"
              name="duration"
              min="1"
              step="1"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 30"
              required
            />
          </div>

          <div className="barber-services__field">
            <label htmlFor="service-gender">Service For *</label>
            <select
              id="service-gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Men</option>
              <option value="female">Women</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="barber-services__field barber-services__field--full">
            <label htmlFor="service-description">Description</label>
            <textarea
              id="service-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the service"
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="barber-services__field barber-services__field--full">
            <label htmlFor="service-image">Image URL</label>
            <input
              id="service-image"
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="barber-services__form-actions">
            <button
              type="submit"
              className="barber-services__add-button"
              disabled={!isApproved || submitting}
            >
              <Plus size={18} />
              {submitting ? "Adding Service..." : "Add Service"}
            </button>
          </div>
        </form>
      </section>

      {/* Services Table */}
      <section className="barber-services__panel">
        <div className="barber-services__panel-header">
          <div>
            <h2>All Services</h2>
            <p>
              {totalServices} {totalServices === 1 ? "service" : "services"} available
            </p>
          </div>
        </div>

        {totalServices === 0 ? (
          <div className="barber-services__empty">
            <Scissors size={30} />
            <p>No services added yet.</p>
          </div>
        ) : (
          <>
            <div className="barber-services__table-wrapper">
              <table className="barber-services__table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Gender</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {currentServices.map((service) => (
                    <tr key={service._id}>
                      <td>
                        <div className="barber-services__service-name">
                          {service.imageUrl ? (
                            <img
                              src={service.imageUrl} alt="" className="barber-services__service-image" loading="lazy"/>
                          ) : (
                            <div className="barber-services__service-image barber-services__service-image--placeholder">
                              <Scissors size={17} />
                            </div>
                          )}

                          <strong>{service.title}</strong>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`barber-services__gender barber-services__gender--${(
                            service.gender || "other"
                          ).toLowerCase()}`}>
                          {service.gender ? service.gender.charAt(0).toUpperCase() + service.gender.slice(1) : "Other"}
                        </span>
                      </td>

                      <td className="barber-services__price">
                        {formatCurrency(service.price)}
                      </td>

                      <td>
                        <span className="barber-services__duration">
                          <Clock size={14} />
                          {service.duration} min
                        </span>
                      </td>

                      <td className="barber-services__description">
                        {service.description?.trim() || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="barber-services__pagination">
                <span>
                  Showing {indexOfFirst + 1}–
                  {Math.min(indexOfLast, totalServices)} of {totalServices}
                </span>

                <div className="barber-services__pagination-controls">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => prev - 1)
                    }>
                    Previous
                  </button>

                  <span>
                    {currentPage} / {totalPages}
                  </span>

                  <button type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => prev + 1)
                    }>
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
};

export default BarberServiceSection;
