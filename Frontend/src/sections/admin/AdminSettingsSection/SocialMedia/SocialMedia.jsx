import React, { useEffect, useState } from "react";
import {  Search,  Plus,  Pencil,  Trash2,  ChevronLeft,  ChevronRight,  Instagram,  Facebook,  Youtube,  Linkedin,  AtSign,  LoaderCircle,
  RefreshCw,  CheckCircle2,AlertCircle,} from "lucide-react";

import  useSocialMedia  from "../../../../hooks/admin/useSocialMedia";
import  useCreateSocialMedia  from "../../../../hooks/admin/useCreateSocialMedia";
import  useUpdateSocialMedia  from "../../../../hooks/admin/useUpdateSocialMedia";
import  useDeleteSocialMedia  from "../../../../hooks/admin/useDeleteSocialMedia";

import SocialMediaDialog from "./SocialMediaDialog";
import "./SocialMedia.scss";

const ITEMS_PER_PAGE = 10;

const platformIcons = {  Instagram,  Facebook,  YouTube: Youtube,LinkedIn: Linkedin,  X: AtSign,  TikTok: AtSign,  Other: AtSign,};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong. Please try again.";

export default function SocialMedia() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch social media accounts from the backend.
  const {
    socialMedia = [],
    pagination = {},
    loading: fetching,
    error: fetchError,
    refresh,
  } = useSocialMedia({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm.trim(),
    status: statusFilter,
  });

  // CRUD hooks.
  const {
    addSocialMedia,
    loading: creating,
  } = useCreateSocialMedia();

  const {
    editSocialMedia,
    loading: updating,
  } = useUpdateSocialMedia();

  const {
    removeSocialMedia,
    loading: deleting,
  } = useDeleteSocialMedia();

  const saving = creating || updating;
  const busy = saving || deleting;

  const totalItems = Number(
    pagination.total ?? pagination.totalItems ?? 0
  );

  const totalPages = Math.max(
    1,
    Number(
      pagination.totalPages ??
        Math.ceil(totalItems / ITEMS_PER_PAGE)
    )
  );

  const safePage = Math.min(currentPage, totalPages);

  // Keep the selected page valid if records are deleted or filtered.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openAddDialog = () => {
    setSelectedAccount(null);
    setDialogMode("add");
    setActionError("");
    setSuccessMessage("");
    setDialogOpen(true);
  };

  const openEditDialog = (account) => {
    setSelectedAccount(account);
    setDialogMode("edit");
    setActionError("");
    setSuccessMessage("");
    setDialogOpen(true);
  };

  const openDeleteDialog = (account) => {
    setSelectedAccount(account);
    setDialogMode("delete");
    setActionError("");
    setSuccessMessage("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (busy) return;

    setDialogOpen(false);
    setSelectedAccount(null);
    setActionError("");
  };

  const handleSaveAccount = async (formData) => {
    setActionError("");
    setSuccessMessage("");

    try {
      const payload = {
        platform: formData.platform.trim(),
        handle: formData.handle.trim(),
        followers: Number(formData.followers),
        following: Number(formData.following),
        posts: Number(formData.posts),
        status: formData.status,
      };

      if (dialogMode === "edit") {
        if (!selectedAccount?._id) {
          throw new Error("Cannot update this account: its ID is missing.");
        }

        await editSocialMedia(selectedAccount._id, payload);
        setSuccessMessage("Social media account updated successfully.");
      } else {
        await addSocialMedia(payload);
        setCurrentPage(1);
        setSuccessMessage("Social media account created successfully.");
      }

      setDialogOpen(false);
      setSelectedAccount(null);

      await refresh();
    } catch (error) {
      setActionError(getErrorMessage(error));
      throw error;
    }
  };

  const handleDeleteAccount = async (accountToDelete) => {
    if (!accountToDelete?._id) {
      const error = new Error(
        "Cannot delete this account: its ID is missing."
      );
      setActionError(error.message);
      throw error;
    }

    setActionError("");
    setSuccessMessage("");

    try {
      await removeSocialMedia(accountToDelete._id);

      setDialogOpen(false);
      setSelectedAccount(null);
      setSuccessMessage("Social media account deleted successfully.");

      await refresh();
    } catch (error) {
      setActionError(getErrorMessage(error));
      throw error;
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    setActionError("");
    setSuccessMessage("");
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
    setActionError("");
    setSuccessMessage("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCurrentPage(1);
    setActionError("");
    setSuccessMessage("");
  };

  const firstItem = socialMedia.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;

  const lastItem = totalItems > 0 ? Math.min(firstItem + socialMedia.length - 1, totalItems) : socialMedia.length;

  const pageNumbers = Array.from( { length: totalPages },(_, index) => index + 1).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - safePage) <= 1
  );

  return (
    <section className="social-media-management">
      <div className="social-media-management__header">
        <button
          type="button"
          className="social-media-management__add-button"
          onClick={openAddDialog}
          disabled={busy}
        >
          <Plus size={18} />
          <span>Add Account</span>
        </button>
      </div>

      {successMessage && (
        <div className="social-media-management__notice social-media-management__notice--success" role="status">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {actionError && !dialogOpen && (
        <div
          className="social-media-management__notice social-media-management__notice--error"
          role="alert"
        >
          <AlertCircle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      <div className="social-media-management__toolbar">
        <div className="social-media-management__search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search platform, handle, status..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search social media accounts"
          />
        </div>

        <div className="social-media-management__filter">
          <label htmlFor="social-media-status-filter">
            Status
          </label>

          <select
            id="social-media-status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <button
          type="button"
          className="social-media-management__refresh-button"
          onClick={refresh}
          disabled={fetching || busy}
          aria-label="Refresh social media accounts"
          title="Refresh"
        >
          {fetching ? (
            <LoaderCircle className="social-media-management__spinner" size={18} />
          ) : (
            <RefreshCw size={18} />
          )}
        </button>
      </div>

      {fetchError && (
        <div
          className="social-media-management__notice social-media-management__notice--error"
          role="alert"
        >
          <AlertCircle size={18} />
          <span>
            {typeof fetchError === "string"
              ? fetchError
              : getErrorMessage(fetchError)}
          </span>

          <button type="button" onClick={refresh}>
            Retry
          </button>
        </div>
      )}

      <div className="social-media-management__table-card">
        <div className="social-media-management__table-wrapper">
          <table className="social-media-management__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Platform</th>
                <th>Handle / Username</th>
                <th>Followers</th>
                <th>Following</th>
                <th>Posts</th>
                <th>Status</th>
                <th>Updated At</th>
                <th className="social-media-management__actions-heading">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={9}>
                    <div className="social-media-management__loading">
                      <LoaderCircle
                        size={24}
                        className="social-media-management__spinner"
                      />
                      <span>Loading social media accounts...</span>
                    </div>
                  </td>
                </tr>
              ) : socialMedia.length > 0 ? (
                socialMedia.map((account, index) => {
                  const PlatformIcon =
                    platformIcons[account.platform] || AtSign;

                  const isActive = account.status === "ACTIVE";

                  return (
                    <tr key={account._id}>
                      <td className="social-media-management__row-number">
                        {(safePage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      <td>
                        <div className="social-media-management__platform">
                          <span className="social-media-management__platform-icon">
                            <PlatformIcon size={17} />
                          </span>

                          <span>{account.platform}</span>
                        </div>
                      </td>

                      <td>
                        <span className="social-media-management__handle">
                          {account.handle}
                        </span>
                      </td>

                      <td className="social-media-management__number">
                        {formatNumber(account.followers)}
                      </td>

                      <td className="social-media-management__number">
                        {formatNumber(account.following)}
                      </td>

                      <td className="social-media-management__number">
                        {formatNumber(account.posts)}
                      </td>

                      <td>
                        <span
                          className={`social-media-management__status ${
                            isActive
                              ? "social-media-management__status--active"
                              : "social-media-management__status--inactive"
                          }`}
                        >
                          <span className="social-media-management__status-dot" />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="social-media-management__date">
                        {formatDate(account.updatedAt)}
                      </td>

                      <td>
                        <div className="social-media-management__actions">
                          <button
                            type="button"
                            className="social-media-management__action-button social-media-management__action-button--edit"
                            onClick={() => openEditDialog(account)}
                            aria-label={`Edit ${account.platform} account`}
                            title="Edit account"
                            disabled={busy}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="social-media-management__action-button social-media-management__action-button--delete"
                            onClick={() => openDeleteDialog(account)}
                            aria-label={`Delete ${account.platform} account`}
                            title="Delete account"
                            disabled={busy}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="social-media-management__empty">
                      <div className="social-media-management__empty-icon">
                        <Search size={23} />
                      </div>

                      <h4>No accounts found</h4>

                      <p>
                        {searchTerm || statusFilter
                          ? "No social media accounts match your current search or filter."
                          : "No social media accounts have been added yet."}
                      </p>

                      {searchTerm || statusFilter ? (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="social-media-management__clear-filters"
                        >
                          Clear filters
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={openAddDialog}
                          className="social-media-management__clear-filters"
                        >
                          Add your first account
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="social-media-management__pagination">
          <p>
            Showing <strong>{firstItem}–{lastItem}</strong> of{" "}
            <strong>{totalItems}</strong> accounts
          </p>

          <div className="social-media-management__pagination-controls">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={fetching || safePage <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
            </button>

            {pageNumbers.reduce((items, page, index, pages) => {
              if (index > 0 && page - pages[index - 1] > 1) {
                items.push(
                  <span
                    className="social-media-management__pagination-ellipsis"
                    key={`ellipsis-${page}`}
                  >
                    …
                  </span>
                );
              }

              items.push(
                <button
                  type="button"
                  key={page}
                  className={
                    safePage === page
                      ? "social-media-management__page-button social-media-management__page-button--active"
                      : "social-media-management__page-button"
                  }
                  onClick={() => setCurrentPage(page)}
                  disabled={fetching}
                  aria-label={`Page ${page}`}
                  aria-current={safePage === page ? "page" : undefined}
                >
                  {page}
                </button>
              );

              return items;
            }, [])}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={fetching || safePage >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <SocialMediaDialog
        isOpen={dialogOpen}
        mode={dialogMode}
        socialMediaData={selectedAccount}
        onClose={closeDialog}
        onSave={handleSaveAccount}
        onConfirmDelete={handleDeleteAccount}
        saving={saving}
        deleting={deleting}
      />
    </section>
  );
}
