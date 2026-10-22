import { useState } from "react";
import {
  Headset,
  Send,
  Search,
  LifeBuoy,
  CalendarDays,
  ChevronDown,
  MessageSquareText,
  ClipboardList,
  CircleCheck,
} from "lucide-react";

import {
  HELP_ISSUE_TYPES,
  HELP_PRIORITY_OPTIONS,
  HELP_PRIORITY_CLASS,
  HELP_STATUS_CLASS,
  INITIAL_HELP_REQUESTS,
} from "../../../constants/userHelpConstants";

import "./UserHelpSection.scss";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const createEmptyForm = () => ({
  issue: "",
  issueType: "",
  description: "",
  priority: "Medium",
});

const UserHelpSection = () => {
  const [formData, setFormData] = useState(createEmptyForm);
  const [requests, setRequests] = useState(INITIAL_HELP_REQUESTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSuccessMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.issue.trim()) {
      nextErrors.issue = "Please enter an issue title.";
    } else if (formData.issue.trim().length < 4) {
      nextErrors.issue = "Issue title must contain at least 4 characters.";
    }

    if (!formData.issueType) {
      nextErrors.issueType = "Please select an issue type.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Please describe your issue.";
    } else if (formData.description.trim().length < 10) {
      nextErrors.description =
        "Description must contain at least 10 characters.";
    }

    if (!formData.priority) {
      nextErrors.priority = "Please select a priority.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const newRequest = {
      id: `TT-${Date.now().toString().slice(-6)}`,
      issue: formData.issue.trim(),
      issueType: formData.issueType,
      description: formData.description.trim(),
      priority: formData.priority,
      status: "Open",
      createdAt: new Date().toISOString(),
    };

    setRequests((previous) => [newRequest, ...previous]);
    setFormData(createEmptyForm());
    setErrors({});
    setSuccessMessage(
      `Support request ${newRequest.id} was added successfully.`
    );

    setStatusFilter("All");
    setSearchQuery("");
  };

  const filteredRequests = requests.filter((request) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      request.id.toLowerCase().includes(query) ||
      request.issue.toLowerCase().includes(query) ||
      request.issueType.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="user-help-section">
      {/* Page heading */}
      <header className="user-help-section__header">
        <div className="user-help-section__heading">
          <span className="user-help-section__eyebrow">
            CUSTOMER SUPPORT
          </span>

          <h1>Help Center</h1>

          <p>
            Contact our admin team and track the progress of your support
            requests.
          </p>
        </div>

        <div className="user-help-section__header-icon">
          <Headset size={25} />
        </div>
      </header>

      {/* Contact admin form */}
      <section className="user-help-section__form-card">
        <div className="user-help-section__card-heading">
          <div className="user-help-section__card-icon">
            <MessageSquareText size={20} />
          </div>

          <div>
            <h2>Contact Admin</h2>
            <p>Describe your issue and our support team will review it.</p>
          </div>
        </div>

        {successMessage && (
          <div
            className="user-help-section__success"
            role="status"
          >
            <CircleCheck size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form
          className="user-help-section__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="user-help-section__form-grid">
            {/* Issue title */}
            <div className="user-help-section__field">
              <label htmlFor="help-issue">
                Issue Title <span>*</span>
              </label>

              <input
                id="help-issue"
                type="text"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                placeholder="e.g. Booking confirmation not received"
                maxLength={120}
                aria-invalid={Boolean(errors.issue)}
                aria-describedby={
                  errors.issue ? "help-issue-error" : undefined
                }
              />

              {errors.issue && (
                <span
                  className="user-help-section__error"
                  id="help-issue-error"
                >
                  {errors.issue}
                </span>
              )}
            </div>

            {/* Issue type */}
            <div className="user-help-section__field">
              <label htmlFor="help-issue-type">
                Issue Type <span>*</span>
              </label>

              <div className="user-help-section__select-wrap">
                <select
                  id="help-issue-type"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  className={
                    formData.issueType
                      ? ""
                      : "user-help-section__select-placeholder"
                  }
                  aria-invalid={Boolean(errors.issueType)}
                >
                  {HELP_ISSUE_TYPES.map((option) => (
                    <option
                      key={option.value || "placeholder"}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown size={17} />
              </div>

              {errors.issueType && (
                <span className="user-help-section__error">
                  {errors.issueType}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="user-help-section__field user-help-section__field--full">
              <label htmlFor="help-description">
                Description <span>*</span>
              </label>

              <textarea
                id="help-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain the issue and include any details that may help us resolve it..."
                rows={4}
                maxLength={1500}
                aria-invalid={Boolean(errors.description)}
              />

              <div className="user-help-section__field-bottom">
                {errors.description ? (
                  <span className="user-help-section__error">
                    {errors.description}
                  </span>
                ) : (
                  <span>
                    Please provide enough detail to help us investigate.
                  </span>
                )}

                <span>
                  {formData.description.length}/1500
                </span>
              </div>
            </div>

            {/* Priority */}
            <div className="user-help-section__field">
              <label htmlFor="help-priority">
                Priority <span>*</span>
              </label>

              <div className="user-help-section__select-wrap">
                <select
                  id="help-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.priority)}
                >
                  {HELP_PRIORITY_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown size={17} />
              </div>

              <span className="user-help-section__field-hint">
                Choose High for urgent issues affecting your booking or
                payment.
              </span>
            </div>
          </div>

          <div className="user-help-section__form-footer">
            <p>
              <LifeBuoy size={15} />
              Your request will appear in the history below.
            </p>

            <button
              type="submit"
              className="user-help-section__submit"
            >
              Submit Issue
              <Send size={16} />
            </button>
          </div>
        </form>
      </section>

      {/* Support request history */}
      <section className="user-help-section__history">
        <div className="user-help-section__history-heading">
          <div className="user-help-section__history-title">
            <div className="user-help-section__card-icon">
              <ClipboardList size={20} />
            </div>

            <div>
              <h2>Support Request History</h2>
              <p>Review your submitted issues and their current status.</p>
            </div>
          </div>

          <span className="user-help-section__history-count">
            {filteredRequests.length}{" "}
            {filteredRequests.length === 1 ? "request" : "requests"}
          </span>
        </div>

        {/* Table controls */}
        <div className="user-help-section__table-toolbar">
          <label className="user-help-section__search">
            <Search size={17} />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search issues..."
              aria-label="Search support requests"
            />
          </label>

          <label className="user-help-section__status-filter">
            <span>Status:</span>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </label>
        </div>

        <div className="user-help-section__table-wrap">
          <table className="user-help-section__table">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Issue</th>
                <th>Issue Type</th>
                <th>Priority</th>
                <th>Submitted</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <span className="user-help-section__request-id">
                        {request.id}
                      </span>
                    </td>

                    <td>
                      <div className="user-help-section__issue-cell">
                        <strong>{request.issue}</strong>
                        <span>{request.description}</span>
                      </div>
                    </td>

                    <td>{request.issueType}</td>

                    <td>
                      <span
                        className={`user-help-section__priority user-help-section__priority--${
                          HELP_PRIORITY_CLASS[request.priority] || "medium"
                        }`}
                      >
                        <span />
                        {request.priority}
                      </span>
                    </td>

                    <td>
                      <span className="user-help-section__date">
                        <CalendarDays size={14} />
                        {formatDate(request.createdAt)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`user-help-section__status user-help-section__status--${
                          HELP_STATUS_CLASS[request.status] || "open"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="user-help-section__empty">
                      <ClipboardList size={27} />
                      <strong>No support requests found</strong>
                      <span>
                        Try changing your search or status filter.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="user-help-section__table-footer">
          Showing {filteredRequests.length}{" "}
          {filteredRequests.length === 1 ? "request" : "requests"}
        </div>
      </section>
    </section>
  );
};

export default UserHelpSection;
