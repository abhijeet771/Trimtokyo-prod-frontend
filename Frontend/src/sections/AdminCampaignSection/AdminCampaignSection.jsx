import React, {
  useEffect,
  useState,
} from "react";

import useCampaign from "../../hooks/useCampaign";

import "./AdminCampaignSection.scss";

const AdminCampaignSection = () => {
  const {
    campaigns,
    loading,
    fetchCampaigns,
    sendCampaign,
    removeCampaign,
  } = useCampaign();

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      imageUrl: "",
      targetAudience: "user",
      redirectUrl: "",
    });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // ================= SEND CAMPAIGN =================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await sendCampaign(
          formData
        );

        setShowModal(false);

        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          targetAudience:
            "user",
          redirectUrl: "",
        });
      } catch (err) {
        alert(
          err.response?.data
            ?.message ||
            "Failed to send campaign"
        );
      }
    };

  return (
    <div className="admin-campaign-section">
      {/* ================= HEADER ================= */}

      <div className="campaign-header">
        <div>
          <h2>Campaigns</h2>

          <p>
            Create and send
            promotional campaigns
            to users and barbers.
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() =>
            setShowModal(true)
          }
        >
          + Send New Campaign
        </button>
      </div>

      {/* ================= TABLE ================= */}

      {loading && (
        <p>Loading campaigns...</p>
      )}

      {!loading &&
        campaigns.length ===
          0 && (
          <p>
            No campaigns found
          </p>
        )}

      {!loading &&
        campaigns.length >
          0 && (
          <div className="table-container">
            <table className="campaign-table">
              <thead>
                <tr>
                  <th>Title</th>

                  <th>
                    Audience
                  </th>

                  <th>Status</th>

                  <th>
                    Sent At
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {campaigns.map(
                  (campaign) => (
                    <tr
                      key={
                        campaign._id
                      }
                    >
                      <td>
                        <div className="campaign-info">
                          <img
                            src={
                              campaign.imageUrl
                            }
                            alt={
                              campaign.title
                            }
                          />

                          <div>
                            <h4>
                              {
                                campaign.title
                              }
                            </h4>

                            <p>
                              {
                                campaign.description
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        {
                          campaign.targetAudience
                        }
                      </td>

                      <td>
                        <span className="status">
                          {
                            campaign.status
                          }
                        </span>
                      </td>

                      <td>
                        {new Date(
                          campaign.sentAt
                        ).toLocaleString()}
                      </td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            removeCampaign(
                              campaign._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="campaign-modal">
          <div className="campaign-modal__content">
            <h3>
              Send Campaign
            </h3>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <input
                type="text"
                name="title"
                placeholder="Campaign Title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                required
              />

              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={
                  formData.imageUrl
                }
                onChange={
                  handleChange
                }
                required
              />

              <select
                name="targetAudience"
                value={
                  formData.targetAudience
                }
                onChange={
                  handleChange
                }
              >
                <option value="user">
                  Users
                </option>

                <option value="barber">
                  Barbers
                </option>
              </select>

              <input
                type="text"
                name="redirectUrl"
                placeholder="Redirect URL"
                value={
                  formData.redirectUrl
                }
                onChange={
                  handleChange
                }
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button type="submit">
                  Send Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaignSection;