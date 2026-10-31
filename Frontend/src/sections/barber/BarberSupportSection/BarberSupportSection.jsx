import React, { useState } from "react";
import {  Ticket,  Search,  Paperclip,  Upload,  CheckCircle2,  AlertCircle,} from "lucide-react";

import {  SUPPORT_TABS,  SUPPORT_KPIS,SUPPORT_CATEGORIES,SUPPORT_PRIORITIES,  SUPPORT_FORM_INITIAL_STATE,} from "../../../constants/barberSupport";
import useBarberSupport from "../../../hooks/barber/useBarberSupport";
import useBarberSupportStats from "../../../hooks/barber/useBarberSupportStats";
import BarberSupportTicketsTable from "../BarberSupportTicketsTable/BarberSupportTicketsTable";
import "./BarberSupportSection.scss";

const BarberSupportSection = () => {
  const [activeTab, setActiveTab] = useState("raise");
  const [formData, setFormData] = useState(
    SUPPORT_FORM_INITIAL_STATE
  );
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { createTicket, actionLoading, error: ticketError, fetchTickets, } = useBarberSupport();
  const { stats, loading: statsLoading, refreshStats, } = useBarberSupportStats();

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setMessage("");
    setMessageType("");

    if (name === "attachment") { const file = files?.[0];

      if (file && !file.type.startsWith("image/")) {
        setMessageType("error");
        setMessage("Please select a valid image file.");
        event.target.value = "";
        return;
      }

      if (file && file.size > 5 * 1024 * 1024) {
        setMessageType("error");
        setMessage("Image size must be 5 MB or less.");
        event.target.value = "";
        return;
      }

      setFormData((previous) => ({ ...previous,attachment: file || null,}));
      return;
    }

    setFormData((previous) => ({...previous,[name]: value,}));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (!formData.title.trim() ||!formData.category ||!formData.description.trim() ||!formData.priority) {
      setMessageType("error");
      setMessage("Please complete all required fields.");
      return;
    }

    try {
      await createTicket({
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        priority: formData.priority.toUpperCase(),
      });

      await Promise.all([ fetchTickets({ page: 1 }),refreshStats(),]);
      setMessageType("success");
      setMessage("Support ticket created successfully.");
      setFormData(SUPPORT_FORM_INITIAL_STATE);

      const fileInput = document.getElementById("support-attachment");

      if (fileInput) {fileInput.value = "";}
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message ||ticketError ||"Failed to create support ticket. Please try again.");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage("");
    setMessageType("");

    if (tab === "tickets") {fetchTickets().catch(() => {});}
  };

  const handleClearForm = () => {
    setFormData(SUPPORT_FORM_INITIAL_STATE);
    setMessage("");
    setMessageType("");
    const fileInput = document.getElementById("support-attachment");
    if (fileInput) {fileInput.value = "";}
  };

const getKpiValue = (kpi) => {
  const label = `${kpi.id || ""} ${kpi.label || ""}`.toLowerCase();

  if ( label.includes("raised") || label.includes("total")) {
    return stats.totalTickets;
  }

  if (label.includes("progress")) {
    return stats.inProgressTickets;
  }

  if (label.includes("resolv") || label.includes("closed")) {
    return stats.resolvedTickets;
  }

  if (label.includes("open")) {
    return stats.openTickets;
  }

  return 0;
};

  return (
    <section className="barber-support">
      {/* Page heading */}
      <header className="barber-support__header">
        <div className="barber-support__heading-icon">
          <Ticket size={26} />
        </div>

        <div>
          <span className="barber-support__eyebrow">
            BARBER WORKSPACE
          </span>

          <h1>Help &amp; Support</h1>

          <p>Raise a support ticket and get help with your shop.</p>
        </div>
      </header>

      {/* Support tabs */}
      <div className="barber-support__tabs" role="tablist" aria-label="Support sections">
        {SUPPORT_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`support-tab-${tab.value}`}
            aria-selected={activeTab === tab.value}
            aria-controls={`support-panel-${tab.value}`}
            className={`barber-support__tab ${
              activeTab === tab.value ? "is-active" : ""
            }`}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.value === "raise" ? (<Ticket size={18} />) : (<Search size={18} />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Raise a Ticket */}
      {activeTab === "raise" && (
        <div
          className="barber-support__tab-content"
          id="support-panel-raise"
          role="tabpanel"
          aria-labelledby="support-tab-raise"
        >
          {/* KPI cards */}
          <div className="barber-support__kpi-grid">
            {SUPPORT_KPIS.map((kpi) => {
              const Icon = kpi.icon;

              return (
                <article key={kpi.id} className="barber-support__kpi-card">
                  <div className={`barber-support__kpi-icon barber-support__kpi-icon--${kpi.accent}`}>
                    <Icon size={23} />
                  </div>

                  <div className="barber-support__kpi-info">
                    <span>{kpi.label}</span>

                    <strong>
                      {statsLoading ? "…" : getKpiValue(kpi)}
                    </strong>

                    <p>{kpi.description}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Ticket form */}
          <section className="barber-support__form-panel">
            <div className="barber-support__form-heading">
              <div>
                <h2>Raise a Support Ticket</h2>
                <p>
                  Describe your issue so our support team can
                  assist you.
                </p>
              </div>

              <span className="barber-support__required-note">
                * Required
              </span>
            </div>

            <form className="barber-support__form" onSubmit={handleSubmit}>
              {/* Ticket title */}
              <div className="barber-support__field">
                <label htmlFor="support-title">
                  Ticket Title <span>*</span>
                </label>

                <input id="support-title" name="title" type="text"
                  placeholder="Briefly describe your issue"
                  value={formData.title} onChange={handleChange}
                  maxLength={150}
                  required
                />
              </div>

              {/* Issue category */}
              <div className="barber-support__field">
                <label htmlFor="support-category">
                  Issue Category <span>*</span>
                </label>

                <select id="support-category" name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {SUPPORT_CATEGORIES.map((category) => (
                    <option key={category.value || "default"} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="barber-support__field">
                <label htmlFor="support-description">
                  Description <span>*</span>
                </label>

                <textarea id="support-description" name="description"
                  placeholder="Explain the issue and any steps you've already tried..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  maxLength={2000}
                  required
                />

                <span className="barber-support__field-hint">
                  {formData.description.length}/2000 characters
                </span>
              </div>

              {/* Priority */}
              <div className="barber-support__field">
                <label htmlFor="support-priority">
                  Priority <span>*</span>
                </label>

                <select id="support-priority" name="priority"
                  value={formData.priority}
                  onChange={handleChange} required
                >
                  {SUPPORT_PRIORITIES.map((priority) => (
                    <option key={priority.value || "default"} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>

                {formData.priority && (
                  <span
                    className={`barber-support__priority-hint barber-support__priority-hint--${formData.priority}`}
                  >
                    {formData.priority.toLowerCase() === "high"
                      ? "Urgent attention requested"
                      : formData.priority.toLowerCase() === "medium"
                      ? "Normal attention requested"
                      : "Non-urgent request"}
                  </span>
                )}
              </div>

              {/* Image attachment — UI only for now */}
              <div className="barber-support__field">
                <label htmlFor="support-attachment">
                  Attachment (Image)
                </label>

                <label className="barber-support__upload" htmlFor="support-attachment">
                  <span className="barber-support__upload-icon">
                    <Upload size={22} />
                  </span>

                  <span className="barber-support__upload-text">
                    <strong>
                      {formData.attachment ? formData.attachment.name : "Click to upload an image"}
                    </strong>

                    <small>
                      PNG, JPG or WEBP · Maximum 5 MB
                    </small>
                  </span>

                  <Paperclip size={19} className="barber-support__upload-clip"/>
                </label>

                <input
                  id="support-attachment"
                  className="barber-support__file-input"
                  name="attachment"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleChange}
                />

                <small>
                  Image attachments are not uploaded yet.
                </small>
              </div>

              {/* Feedback */}
              {message && (
                <div className={`barber-support__message barber-support__message--${messageType}`} role="status">
                  {messageType === "success" ? (
                    <CheckCircle2 size={19} />) : (<AlertCircle size={19} />)}

                  <span>{message}</span>
                </div>
              )}

              {/* Form actions */}
              <div className="barber-support__form-actions">
                <button type="button"
                  className="barber-support__reset-button" onClick={handleClearForm}
                  disabled={actionLoading}
                >
                  Clear Form
                </button>

                <button type="submit"
                  className="barber-support__submit-button"
                  disabled={actionLoading}>
                  <Ticket size={18} />
                  {actionLoading ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* My Tickets */}
      {activeTab === "tickets" && (
        <div className="barber-support__tab-content"
          id="support-panel-tickets"
          role="tabpanel"
          aria-labelledby="support-tab-tickets">
          <BarberSupportTicketsTable />
        </div>
      )}
    </section>
  );
};

export default BarberSupportSection;
