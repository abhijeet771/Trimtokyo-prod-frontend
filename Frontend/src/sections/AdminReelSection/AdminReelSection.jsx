import React, { useEffect, useMemo } from "react";
import ReelModal from "../../components/organisms/ReelModal/ReelModal";
import useReel from "../../hooks/useReel";
import {  REEL_SEARCH_PLACEHOLDER,  TABLE_COLUMNS,} from "../../constants/reel";
import "./AdminReelSection.scss";

const AdminReelSection = () => {
  const {    loading,    reels,    search,    setSearch,    modalOpen,    modalMode,    selectedReel,    formData,    updateField,    updateVideo,
    createReel,
    editReel,
    openCreateModal,
    openEditModal,
    closeModal,
    removeReel,
    fetchReels,
  } = useReel();

  /* ===========================
     FETCH REELS
  =========================== */

  useEffect(() => {    fetchReels();  }, []);

  /* ===========================
     SEARCH
  =========================== */

  const filteredReels = useMemo(() => {
    return reels.filter((reel) =>
      reel.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [reels, search]);

  return (
    <section className="admin-reel-section">
      <div className="admin-reel-section__header">
        <div>
          <h2>Reels</h2>
          <p>
            Manage homepage reels from here.
          </p>
        </div>
        <button
          className="admin-reel-section__add-btn"
          onClick={openCreateModal}
        >
          + Add New Reel
        </button>
      </div>

      <div className="admin-reel-section__toolbar">
        <input
          type="text"
          placeholder={REEL_SEARCH_PLACEHOLDER}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <div className="admin-reel-section__table-wrapper">
        <table className="admin-reel-section__table">
          <thead>
            <tr>
              {TABLE_COLUMNS.map((column) => (
                <th key={column}>
                  {column}
                </th>
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
                  Loading...
                </td>
              </tr>
            ) : filteredReels.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_COLUMNS.length}
                  className="admin-reel-section__empty"
                >
                  No reels found.
                </td>
              </tr>
            ) : (
              filteredReels.map((reel) => (
                <tr key={reel._id}>
                  <td>
                    <video
                      src={reel.videoUrl}
                      width="90"
                      height="140"
                      controls
                    />
                  </td>

                  <td>{reel.title}</td>

                  <td>{reel.description}</td>

                  <td>{reel.views ?? 0}</td>

                  <td>
                    {new Date(
                      reel.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() =>
                          openEditModal(reel)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          removeReel(reel._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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