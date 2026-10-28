import React, { useState } from "react";
import {
  MdWork,
  MdPeople,
  MdAccessTime,
  MdCheckCircle,
  MdAdd,
  MdDescription,
} from "react-icons/md";

import CareerDialog from "../../../components/admin/CareerDialog/CareerDialog.jsx";
import CareerJobsTable from "../../../components/admin/CareerJobsTable/CareerJobsTable.jsx";
import CareerApplicationsTable from "../../../components/admin/CareerApplicationsTable/CareerApplicationsTable.jsx";

import {
  useAdminCareer,
  useAdminCareerStats,
} from "../../../hooks/admin/useAdminCareer.js";

import "./AdminCareerSection.scss";

const AdminCareerSection = () => {
  const [activeTab, setActiveTab] = useState("openings");
  const [isCareerDialogOpen, setIsCareerDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [actionError, setActionError] = useState("");
  const [updatingJobId, setUpdatingJobId] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);

  const {
    jobs,
    pagination,
    loading: jobsLoading,
    error: jobsError,
    createCareer,
    updateCareer,
    deleteCareer,
    changeCareerStatus,
    changePage,
    refreshCareers,
  } = useAdminCareer();

  const {
    stats: careerStats,
    refreshStats,
  } = useAdminCareerStats();

  // Application APIs will be integrated separately.
  const applications = [];
  const applicationsLoading = false;

  const stats = [
    {
      id: "openings",
      label: "Total Job Openings",
      value: careerStats?.total ?? jobs.length,
      description: "All non-deleted job postings",
      icon: MdWork,
      color: "green",
    },
    {
      id: "applications",
      label: "Total Applications",
      value: applications.length,
      description: "From all job openings",
      icon: MdPeople,
      color: "blue",
    },
    {
      id: "active",
      label: "Active Openings",
      value:
        careerStats?.active ??
        jobs.filter((job) => job.status?.toLowerCase() === "active").length,
      description: "Currently accepting applications",
      icon: MdAccessTime,
      color: "orange",
    },
    {
      id: "hired",
      label: "Hired Candidates",
      value: applications.filter(
        (application) => application.status?.toLowerCase() === "hired"
      ).length,
      description: "Successfully hired",
      icon: MdCheckCircle,
      color: "purple",
    },
  ];

  const refreshCareerData = async () => {
    await Promise.all([refreshCareers(), refreshStats()]);
  };

  const handleOpenCreateDialog = () => {
    setActionError("");
    setEditingJob(null);
    setIsCareerDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCareerDialogOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = async (jobData) => {
    setActionError("");

    try {
      if (editingJob?._id) {
        await updateCareer(editingJob._id, jobData);
      } else {
        await createCareer(jobData);
      }

      handleCloseDialog();
      await refreshCareerData();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save job posting.";

      setActionError(message);

      // Let CareerDialog display the API error and remain open.
      throw error;
    }
  };

  const handleEditJob = (job) => {
    setActionError("");
    setEditingJob(job);
    setIsCareerDialogOpen(true);
  };

  const handleDeleteJob = async (job) => {
    const confirmed = window.confirm(
      `Delete the job opening "${job.title}"?`
    );

    if (!confirmed) return;

    setActionError("");
    setDeletingJobId(job._id);

    try {
      await deleteCareer(job._id);
      await refreshCareerData();
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete job posting."
      );
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleCareerStatusChange = async (job, status) => {
    if (!job?._id || job.status === status) return;

    setActionError("");
    setUpdatingJobId(job._id);

    try {
      await changeCareerStatus(job._id, status);
      await refreshCareerData();
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update job status."
      );
    } finally {
      setUpdatingJobId(null);
    }
  };

  const handleViewApplications = (job) => {
    setActiveTab("applications");
    console.log("View applications for:", job);
  };

  const handleViewApplication = (application) => {
    console.log("View application:", application);
  };

  const handleDeleteApplication = (application) => {
    console.log("Application deletion API is not implemented:", application);
  };

  const handleApplicationStatusChange = (application, status) => {
    console.log(
      "Application status API is not implemented:",
      application,
      status
    );
  };

  return (
    <section className="admin-career">
      {/* KPI CARDS */}
      <div className="admin-career__stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              className="admin-career__stat-card"
              key={stat.id}
            >
              <div
                className={`admin-career__stat-icon admin-career__stat-icon--${stat.color}`}
              >
                <Icon aria-hidden="true" />
              </div>

              <div className="admin-career__stat-content">
                <p className="admin-career__stat-label">
                  {stat.label}
                </p>

                <h2>{stat.value}</h2>

                <span className="admin-career__stat-description">
                  {stat.description}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* CAREER WORKSPACE */}
      <div className="admin-career__workspace">
        <div className="admin-career__toolbar">
          <div
            className="admin-career__tabs"
            role="tablist"
            aria-label="Career management"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "openings"}
              className={`admin-career__tab ${
                activeTab === "openings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("openings")}
            >
              <MdWork aria-hidden="true" />
              <span>Job Openings</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "applications"}
              className={`admin-career__tab ${
                activeTab === "applications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("applications")}
            >
              <MdDescription aria-hidden="true" />
              <span>Applications</span>
            </button>
          </div>

          {activeTab === "openings" && (
            <button
              type="button"
              className="admin-career__add-button"
              onClick={handleOpenCreateDialog}
            >
              <MdAdd aria-hidden="true" />
              <span>Add New Job</span>
            </button>
          )}
        </div>

        {actionError && (
          <p className="admin-career__error" role="alert">
            {actionError}
          </p>
        )}

        {jobsError && activeTab === "openings" && (
          <p className="admin-career__error" role="alert">
            {jobsError}
          </p>
        )}

        <div
          className="admin-career__tab-content"
          role="tabpanel"
        >
          {activeTab === "openings" ? (
            <CareerJobsTable
              jobs={jobs}
              loading={jobsLoading}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              onViewApplications={handleViewApplications}
              onStatusChange={handleCareerStatusChange}
              updatingJobId={updatingJobId}
              deletingJobId={deletingJobId}
              pagination={pagination}
              onPageChange={changePage}
            />
          ) : (
            <CareerApplicationsTable
              applications={applications}
              loading={applicationsLoading}
              onView={handleViewApplication}
              onDelete={handleDeleteApplication}
              onStatusChange={handleApplicationStatusChange}
            />
          )}
        </div>
      </div>

      {/* CREATE / EDIT JOB DIALOG */}
      {isCareerDialogOpen && (
        <CareerDialog
          key={editingJob?._id || "new-career"}
          initialData={editingJob}
          onClose={handleCloseDialog}
          onSuccess={handleSaveJob}
        />
      )}
    </section>
  );
};

export default AdminCareerSection;
