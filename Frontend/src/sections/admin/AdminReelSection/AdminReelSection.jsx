import React, { useEffect, useMemo } from "react";
import { Plus, Search, Pencil, Trash2,Film, LoaderCircle,} from "lucide-react";

import ReelModal from "../../../components/admin/ReelModal/ReelModal";
import useReel from "../../../hooks/useReel";
import { REEL_SEARCH_PLACEHOLDER, TABLE_COLUMNS,} from "../../../constants/reel";

import "./AdminReelSection.scss";

const AdminReelSection = () => {
  const { loading, reels = [], search, setSearch, modalOpen, modalMode, selectedReel, formData,
    updateField, updateVideo, createReel, editReel, openCreateModal, openEditModal,
    closeModal, removeReel, fetchReels, } = useReel();

  // Fetch reels on initial mount.
  useEffect(() => {
    fetchReels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search reels by title.
  const filteredReels = useMemo(() => {
    const query = (search || "").toLowerCase().trim();

    return reels.filter((reel) =>
      (reel.title || "").toLowerCase().includes(query)
    );
  }, [reels, search]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="admin-reel-section">
      {/* Header */}
      <header className="admin-reel-section__header">
        <div className="admin-reel-section__heading">
          <div className="admin-reel-section__eyebrow">
            <Film size={15} />
            <span>CONTENT MANAGEMENT</span>
          </div>

          <h2>Reels</h2>
          <p>Manage homepage reels from one place.</p>
        </div>

        <button
          type="button"
          className="admin-reel-section__add-btn"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          <span>Add New Reel</span>
        </button>
      </header>

      {/* Search toolbar */}
      <div className="admin-reel-section__toolbar">
        <div className="admin-reel-section__search">
          <Search size={18} />

          <input
            type="search"
            placeholder={REEL_SEARCH_PLACEHOLDER}
            aria-label="Search reels by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="admin-reel-section__clear-search"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        <span className="admin-reel-section__result-count">
          {filteredReels.length}{" "}
          {filteredReels.length === 1 ? "reel" : "reels"}
        </span>
      </div>

      {/* Reels table */}
      <div className="admin-reel-section__table-wrapper">
        <table className="admin-reel-section__table">
          <thead>
            <tr>
              {TABLE_COLUMNS.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={TABLE_COLUMNS.length}
                  className="admin-reel-section__empty"
                >
                  <div className="admin-reel-section__state">
                    <LoaderCircle
                      size={25}
                      className="admin-reel-section__spinner"
                    />
                    <span>Loading reels...</span>
                  </div>
                </td>
              </tr>
            ) : filteredReels.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_COLUMNS.length}
                  className="admin-reel-section__empty"
                >
                  <div className="admin-reel-section__state">
                    <div className="admin-reel-section__empty-icon">
                      <Film size={25} />
                    </div>

                    <strong>
                      {search ? "No matching reels" : "No reels yet"}
                    </strong>

                    <span>
                      {search
                        ? "Try another search term."
                        : "Add a reel to get started."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredReels.map((reel) => (
                <tr key={reel._id}>
                  <td>
                    <div className="admin-reel-section__video">
                      <video
                        src={reel.videoUrl}
                        width="90"
                        height="140"
                        controls
                        preload="none"
                        aria-label={`${reel.title || "Reel"} video preview`}
                      />
                    </div>
                  </td>

                  <td>
                    <div className="admin-reel-section__title-cell">
                      <strong>{reel.title || "Untitled reel"}</strong>
                    </div>
                  </td>

                  <td>
                    <p className="admin-reel-section__description">
                      {reel.description || "—"}
                    </p>
                  </td>

                  <td>
                    <span className="admin-reel-section__views">
                      {Number(reel.views || 0).toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td>
                    <span className="admin-reel-section__date">
                      {formatDate(reel.createdAt)}
                    </span>
                  </td>

                  <td>
                    <div className="admin-reel-section__actions">
                      <button
                        type="button"
                        className="admin-reel-section__action-btn admin-reel-section__action-btn--edit"
                        onClick={() => openEditModal(reel)}
                        aria-label={`Edit ${reel.title || "reel"}`}
                        title="Edit reel"
                      >
                        <Pencil size={16} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="admin-reel-section__action-btn admin-reel-section__action-btn--delete"
                        onClick={() => removeReel(reel._id)}
                        aria-label={`Delete ${reel.title || "reel"}`}
                        title="Delete reel"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Existing reel modal */}
      {modalOpen && (
        <ReelModal
          mode={modalMode}
          reel={selectedReel}
          formData={formData}
          updateField={updateField}
          updateVideo={updateVideo}
          createReel={createReel}
          editReel={editReel}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default AdminReelSection;
