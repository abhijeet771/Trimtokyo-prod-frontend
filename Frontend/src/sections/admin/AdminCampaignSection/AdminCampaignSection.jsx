import React, { useEffect, useState } from "react";
import { Plus, X, Search, Megaphone,Trash2, Users, Image as ImageIcon, Link as LinkIcon, LoaderCircle, AlertCircle, Send,
} from "lucide-react";

import useCampaign from "../../../hooks/admin/useAdminCampaign";
import "./AdminCampaignSection.scss";

const INITIAL_FORM_DATA = {
  title: "",
  description: "",
  imageUrl: "",
  targetAudience: "user",
  redirectUrl: "",
};

const AdminCampaignSection = () => {
  const {
    campaigns = [],
    loading,
    fetchCampaigns,
    sendCampaign,
    removeCampaign,
  } = useCampaign();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
  });

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setFormData({ ...INITIAL_FORM_DATA });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      setSubmitting(true);

      await sendCampaign(formData);

      setShowModal(false);
      setFormData({ ...INITIAL_FORM_DATA });

      await fetchCampaigns();
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send campaign. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (campaign) => {
    const confirmed = window.confirm(
      `Delete the campaign "${campaign.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(campaign._id);
      await removeCampaign(campaign._id);
    } catch (err) {
      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete campaign."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const query = search.toLowerCase().trim();

    return (
      !query ||
      campaign.title?.toLowerCase().includes(query) ||
      campaign.description?.toLowerCase().includes(query) ||
      campaign.targetAudience?.toLowerCase().includes(query) ||
      campaign.status?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const normalizedStatus = (status) =>
    (status || "unknown")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

  return (
    <section className="admin-campaign-section">
      {/* Header */}
      <header className="campaign-header">
        <div className="campaign-header__content">
          <div className="campaign-header__eyebrow">
            <Megaphone size={15} />
            <span>MARKETING MANAGEMENT</span>
          </div>

          <h2>Campaigns</h2>

          <p>
            Create and send promotional campaigns to users and barbers.
          </p>
        </div>

        <button
          type="button"
          className="campaign-add-btn"
          onClick={() => {
            setFormError("");
            setShowModal(true);
          }}
        >
          <Plus size={18} />
          <span>Send New Campaign</span>
        </button>
      </header>

      {/* Search */}
      <div className="campaign-toolbar">
        <div className="campaign-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search campaigns..."
            aria-label="Search campaigns"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="campaign-search__clear"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <span className="campaign-result-count">
          {filteredCampaigns.length}{" "}
          {filteredCampaigns.length === 1 ? "campaign" : "campaigns"}
        </span>
      </div>

      {/* Campaign table */}
      <div className="campaign-table-container">
        <table className="campaign-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Audience</th>
              <th>Status</th>
              <th>Sent At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="campaign-table__empty">
                  <div className="campaign-state">
                    <LoaderCircle
                      size={27}
                      className="campaign-spinner"
                    />
                    <span>Loading campaigns...</span>
                  </div>
                </td>
              </tr>
            ) : filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="campaign-table__empty">
                  <div className="campaign-state">
                    <div className="campaign-state__icon">
                      <Megaphone size={25} />
                    </div>

                    <strong>
                      {search
                        ? "No matching campaigns"
                        : "No campaigns found"}
                    </strong>

                    <span>
                      {search
                        ? "Try a different search term."
                        : "Create your first promotional campaign to get started."}
                    </span>

                    {!search && (
                      <button
                        type="button"
                        className="campaign-state__create-btn"
                        onClick={() => setShowModal(true)}
                      >
                        <Plus size={16} />
                        Create campaign
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td>
                    <div className="campaign-info">
                      <div className="campaign-info__image">
                        {campaign.imageUrl ? (
                          <img
                            src={campaign.imageUrl}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <ImageIcon size={22} />
                        )}
                      </div>

                      <div className="campaign-info__content">
                        <h4>{campaign.title || "Untitled campaign"}</h4>
                        <p>
                          {campaign.description || "No description available."}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`campaign-audience campaign-audience--${normalizedStatus(
                        campaign.targetAudience
                      )}`}
                    >
                      <Users size={14} />
                      {campaign.targetAudience || "—"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`campaign-status campaign-status--${normalizedStatus(
                        campaign.status
                      )}`}
                    >
                      <span className="campaign-status__dot" />
                      {campaign.status || "Unknown"}
                    </span>
                  </td>

                  <td>
                    <span className="campaign-date">
                      {formatDate(campaign.sentAt)}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="campaign-delete-btn"
                      onClick={() => handleDelete(campaign)}
                      disabled={deletingId === campaign._id}
                      aria-label={`Delete ${campaign.title || "campaign"}`}
                      title="Delete campaign"
                    >
                      {deletingId === campaign._id ? (
                        <LoaderCircle
                          size={16}
                          className="campaign-spinner"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}

                      <span>
                        {deletingId === campaign._id
                          ? "Deleting..."
                          : "Delete"}
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Send campaign modal */}
      {showModal && (
        <div
          className="campaign-modal"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <section
            className="campaign-modal__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="campaign-modal-title"
          >
            <div className="campaign-modal__header">
              <div className="campaign-modal__title-icon">
                <Megaphone size={21} />
              </div>

              <div className="campaign-modal__heading">
                <h3 id="campaign-modal-title">Send Campaign</h3>
                <p>Configure the content and target audience.</p>
              </div>

              <button
                type="button"
                className="campaign-modal__close"
                onClick={closeModal}
                disabled={submitting}
                aria-label="Close dialog"
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="campaign-form"
              onSubmit={handleSubmit}
            >
              <div className="campaign-form__field">
                <label htmlFor="campaign-title">Campaign title *</label>
                <input
                  id="campaign-title"
                  type="text"
                  name="title"
                  placeholder="Enter campaign title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={180}
                />
              </div>

              <div className="campaign-form__field">
                <label htmlFor="campaign-description">
                  Description *
                </label>
                <textarea
                  id="campaign-description"
                  name="description"
                  placeholder="Describe your promotion..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="campaign-form__field">
                <label htmlFor="campaign-image">Image URL *</label>
                <div className="campaign-form__input-icon">
                  <ImageIcon size={17} />
                  <input
                    id="campaign-image"
                    type="url"
                    name="imageUrl"
                    placeholder="https://example.com/campaign.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="campaign-form__field">
                <label htmlFor="campaign-audience">Target audience *</label>
                <div className="campaign-form__input-icon">
                  <Users size={17} />
                  <select
                    id="campaign-audience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">Users</option>
                    <option value="barber">Barbers</option>
                  </select>
                </div>
              </div>

              <div className="campaign-form__field">
                <label htmlFor="campaign-redirect">Redirect URL *</label>
                <div className="campaign-form__input-icon">
                  <LinkIcon size={17} />
                  <input
                    id="campaign-redirect"
                    type="url"
                    name="redirectUrl"
                    placeholder="https://example.com/offer"
                    value={formData.redirectUrl}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {formError && (
                <div className="campaign-form__error">
                  <AlertCircle size={17} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="campaign-modal__actions">
                <button
                  type="button"
                  className="campaign-cancel-btn"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="campaign-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="campaign-spinner"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Send Campaign
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
};

export default AdminCampaignSection;
