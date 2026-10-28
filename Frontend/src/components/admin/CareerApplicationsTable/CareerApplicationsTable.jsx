import React, { useState } from "react";
import {  MdVisibility,  MdDelete,  MdDownload,  MdClose,  MdPerson,  MdEmail,  MdPhone,  MdWork,} from "react-icons/md";

import "./CareerApplicationsTable.scss";

const CareerApplicationsTable = ({ applications = [], loading = false,
  onView,
  onDelete,
}) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  const getStatusClass = (status = "Pending") =>  status.toLowerCase().replace(/\s+/g, "-");

  const formatDate = (date) => {  if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())   ? "—"
      : parsedDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  const handleView = (application) => {
    setSelectedApplication(application);
    onView?.(application);
  };

  const handleDelete = () => {
    if (!applicationToDelete) return;

    onDelete?.(applicationToDelete);
    setApplicationToDelete(null);
  };

  if (loading) {
    return (
      <div className="career-applications-table__message">
        Loading applications...
      </div>
    );
  }

  return (
    <>
      <div className="career-applications-table__wrapper">
        {applications.length === 0 ? (
          <div className="career-applications-table__empty">
            <MdPerson />
            <h3>No applications received yet</h3>
            <p>
              Applications submitted through the public Career page
              will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="career-applications-table__scroll">
              <table className="career-applications-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Candidate</th>
                    <th>Applied For</th>
                    <th>Applied On</th>
                    <th>Resume</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application, index) => {
                    const candidateName =  application.name ||  application.fullName ||  "Unnamed candidate";
                    const status = application.status || "Pending";

                    return (
                      <tr key={   application._id ||   application.id ||   index }>
                        <td>{index + 1}</td>

                        <td>
                          <div className="career-applications-table__candidate">
                            <strong>{candidateName}</strong>
                            <span>
                              {application.email || "No email provided"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="career-applications-table__job">
                            {application.jobTitle ||  application.job?.title ||  application.job?.name ||  "—"}
                          </span>
                        </td>

                        <td>
                          {formatDate(   application.appliedAt ||  application.createdAt
                          )}
                        </td>

                        <td>
                          {application.resumeUrl ? (
                            <a
                              className="career-applications-table__resume"
                              href={application.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MdDownload />
                              Resume
                            </a>
                          ) : (
                            <span className="career-applications-table__muted">
                              Not provided
                            </span>
                          )}
                        </td>

                        <td>
                          <span
                            className={`career-applications-table__status career-applications-table__status--${getStatusClass(
                              status
                            )}`}
                          >
                            <span className="career-applications-table__status-dot" />
                            {status}
                          </span>
                        </td>

                        <td>
                          <div className="career-applications-table__actions">
                            <button
                              type="button"
                              title="View application"
                              aria-label={`View application from ${candidateName}`}
                              onClick={() => handleView(application)}
                            >
                              <MdVisibility />
                            </button>

                            <button
                              type="button"
                              className="career-applications-table__delete"
                              title="Delete application"
                              aria-label={`Delete application from ${candidateName}`}
                              onClick={() =>
                                setApplicationToDelete(application)
                              }
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

            <div className="career-applications-table__footer">
              Showing {applications.length} application
              {applications.length !== 1 ? "s" : ""}
            </div>
          </>
        )}
      </div>

      {/* VIEW APPLICATION DIALOG */}
      {selectedApplication && (
        <div
          className="career-applications-table__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedApplication(null);
            }
          }}
        >
          <section
            className="career-applications-table__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="career-application-title"
          >
            <header className="career-applications-table__dialog-header">
              <div>
                <h3 id="career-application-title">
                  Application Details
                </h3>
                <p>Review the candidate's submitted information.</p>
              </div>

              <button
                type="button"
                aria-label="Close application details"
                onClick={() => setSelectedApplication(null)}
              >
                <MdClose />
              </button>
            </header>

            <div className="career-applications-table__details">
              <div className="career-applications-table__detail">
                <MdPerson />
                <div>
                  <span>Candidate Name</span>
                  <strong>
                    {selectedApplication.name ||
                      selectedApplication.fullName ||
                      "—"}
                  </strong>
                </div>
              </div>

              <div className="career-applications-table__detail">
                <MdEmail />
                <div>
                  <span>Email Address</span>
                  <strong>{selectedApplication.email || "—"}</strong>
                </div>
              </div>

              <div className="career-applications-table__detail">
                <MdPhone />
                <div>
                  <span>Phone Number</span>
                  <strong>{selectedApplication.phone || "—"}</strong>
                </div>
              </div>

              <div className="career-applications-table__detail">
                <MdWork />
                <div>
                  <span>Applied Position</span>
                  <strong>
                    {selectedApplication.jobTitle ||
                      selectedApplication.job?.title ||
                      selectedApplication.job?.name ||
                      "—"}
                  </strong>
                </div>
              </div>

              <div className="career-applications-table__detail">
                <MdVisibility />
                <div>
                  <span>Application Status</span>
                  <strong>
                    {selectedApplication.status || "Pending"}
                  </strong>
                </div>
              </div>

              {selectedApplication.coverLetter && (
                <div className="career-applications-table__cover-letter">
                  <span>Cover Letter</span>
                  <p>{selectedApplication.coverLetter}</p>
                </div>
              )}

              {selectedApplication.resumeUrl && (
                <a
                  className="career-applications-table__resume-button"
                  href={selectedApplication.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdDownload />
                  View / Download Resume
                </a>
              )}
            </div>

            <footer className="career-applications-table__dialog-footer">
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {applicationToDelete && (
        <div
          className="career-applications-table__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setApplicationToDelete(null);
            }
          }}
        >
          <section
            className="career-applications-table__confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="career-delete-title"
          >
            <div className="career-applications-table__confirm-icon">
              <MdDelete />
            </div>

            <h3 id="career-delete-title">Delete Application?</h3>

            <p>
              Are you sure you want to delete the application from{" "}
              <strong>
                {applicationToDelete.name ||
                  applicationToDelete.fullName ||
                  "this candidate"}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="career-applications-table__confirm-actions">
              <button
                type="button"
                onClick={() => setApplicationToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
              >
                Delete Application
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default CareerApplicationsTable;
