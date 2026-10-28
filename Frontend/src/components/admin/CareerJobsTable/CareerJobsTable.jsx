import React from "react";
import {  MdEdit,  MdDelete,  MdOpenInNew,  MdWorkOutline,} from "react-icons/md";

import "./CareerJobsTable.scss";

const CareerJobsTable = ({  jobs = [],  loading = false,
  onEdit,  onDelete,  onViewApplications,  onStatusChange,
  updatingJobId = null,  deletingJobId = null,
  pagination,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="career-jobs-table__message">
        Loading job openings...
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="career-jobs-table__empty">
        <MdWorkOutline />
        <h3>No job openings yet</h3>
        <p>New job postings created by the admin will appear here.</p>
      </div>
    );
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  return (
    <div className="career-jobs-table__wrapper">
      <div className="career-jobs-table__scroll">
        <table className="career-jobs-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Job Title</th>
              <th>Department</th>
              <th>Employment</th>
              <th>Location</th>
              <th>Applications</th>
              <th>Status</th>
              <th>Posted On</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job, index) => {
              const jobId = job._id || job.id;
              const status = job.status || "Draft";
              const isUpdating = String(updatingJobId) === String(jobId);
              const isDeleting = String(deletingJobId) === String(jobId);

              return (
                <tr key={jobId || index}>
                  <td>
                    {pagination  ? (pagination.page - 1) * pagination.limit + index + 1  : index + 1}
                  </td>

                  <td>
                    <div className="career-jobs-table__job-title">
                      <strong>{job.title || "Untitled job"}</strong>
                      <span>{job.workplaceType || "On-site"}</span>
                    </div>
                  </td>

                  <td>{job.department || "—"}</td>

                  <td>
                    <span className="career-jobs-table__employment">
                      {job.employmentType || "—"}
                    </span>
                  </td>

                  <td>{job.location || "—"}</td>

                  <td>
                    <button
                      type="button"
                      className="career-jobs-table__application-count"
                      onClick={() => onViewApplications?.(job)}
                      aria-label={`View applications for ${job.title || "this job"}`}
                    >
                      {job.applicationCount ?? job.applicationsCount ?? 0}
                    </button>
                  </td>

                  <td>
                    {onStatusChange ? (
                      <select
                        className={`career-jobs-table__status-select career-jobs-table__status-select--${String(
                          status
                        ).toLowerCase()}`}
                        value={status}
                        disabled={isUpdating || !jobId}
                        aria-label={`Change status for ${job.title || "job"}`}
                        onChange={(event) =>
                          onStatusChange(job, event.target.value)
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Closed">Closed</option>
                      </select>
                    ) : (
                      <span
                        className={`career-jobs-table__status career-jobs-table__status--${String(
                          status
                        ).toLowerCase()}`}
                      >
                        <span className="career-jobs-table__status-dot" />
                        {status}
                      </span>
                    )}
                  </td>

                  <td>{formatDate(job.createdAt)}</td>

                  <td>
                    <div className="career-jobs-table__actions">
                      <button
                        type="button"
                        title="Edit job"
                        aria-label={`Edit ${job.title || "job"}`}
                        onClick={() => onEdit?.(job)}
                        disabled={!jobId || isUpdating || isDeleting}
                      >
                        <MdEdit />
                      </button>

                      <button
                        type="button"
                        title="View applications"
                        aria-label={`View applications for ${job.title || "job"}`}
                        onClick={() => onViewApplications?.(job)}
                      >
                        <MdOpenInNew />
                      </button>

                      <button
                        type="button"
                        className="career-jobs-table__delete"
                        title="Delete job"
                        aria-label={`Delete ${job.title || "job"}`}
                        onClick={() => onDelete?.(job)}
                        disabled={!jobId || isDeleting || isUpdating}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="career-jobs-table__footer">
        <span>
          Showing {jobs.length} job opening{jobs.length !== 1 ? "s" : ""}
          {pagination?.total != null
            ? ` of ${pagination.total}`
            : ""}
        </span>

        {pagination && pagination.totalPages > 1 && (
          <div className="career-jobs-table__pagination">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage || loading}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button type="button"
              disabled={!pagination.hasNextPage || loading}
              onClick={() => onPageChange?.(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerJobsTable;
