import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  MdWorkOutline,  MdLocationOn,MdAccessTime,  MdArrowForward,MdSearch,  MdRefresh,} from "react-icons/md";

import { usePublicCareer } from "../../hooks/user/usePublicCareer";
import "./CareerOpenPositions.scss";

const CareerOpenPositions = ({ jobs: suppliedJobs }) => {
  const navigate = useNavigate();

  const { jobs: apiJobs, loading, error, refreshCareers,} = usePublicCareer();

  const [department, setDepartment] = useState("All Departments");
  const [location, setLocation] = useState("All Locations");
  const [employmentType, setEmploymentType] = useState("All Types");
  const [search, setSearch] = useState("");
  const jobs = suppliedJobs ?? apiJobs ?? [];

  // Keep only active positions.
  const activeJobs = useMemo(() => {
    return jobs.filter(
      (job) => String(job.status || "").toLowerCase() === "active"
    );
  }, [jobs]);

  const departments = useMemo(
    () => [
      "All Departments", ...new Set(activeJobs.map((job) => job.department).filter(Boolean)),],
    [activeJobs]
  );

  const locations = useMemo(
    () => [
      "All Locations",
      ...new Set(
        activeJobs.map((job) => job.location).filter(Boolean)
      ),
    ],
    [activeJobs]
  );

  const employmentTypes = useMemo(
    () => [
      "All Types",
      ...new Set(activeJobs.map((job) => job.employmentType).filter(Boolean)),],
    [activeJobs]
  );

  // Reset a selected filter if the API no longer returns its option.
  useEffect(() => {
    if ( department !== "All Departments" && !departments.includes(department))
   {
      setDepartment("All Departments");
    }

    if ( location !== "All Locations" && !locations.includes(location))
   {
      setLocation("All Locations");
    }

    if ( employmentType !== "All Types" && !employmentTypes.includes(employmentType))
    {
      setEmploymentType("All Types");
    }
  }, [
    department,location,employmentType,departments,locations,employmentTypes,]);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return activeJobs.filter((job) => {
      const matchesDepartment = department === "All Departments" || job.department === department;
      const matchesLocation = location === "All Locations" || job.location === location;
      const matchesType = employmentType === "All Types" || job.employmentType === employmentType;
      const searchText = [ job.title, job.department, job.location, job.employmentType,  job.workplaceType, job.description,]
        .filter(Boolean).join(" ").toLowerCase();

      const matchesSearch = searchText.includes(normalizedSearch);

      return ( matchesDepartment && matchesLocation && matchesType && matchesSearch);
    });
  }, [ activeJobs, department, location, employmentType, search,  ]);

  const handleApply = (job) => {
    if (!job?._id) {
      return;
    }

    navigate(`/career/${job._id}`);
  };

  const clearFilters = () => {
    setDepartment("All Departments");
    setLocation("All Locations");
    setEmploymentType("All Types");
    setSearch("");
  };

  return (
    <section className="career-open-positions" id="open-positions" >
      <div className="career-open-positions__header">
        <div>
          <h2>Open Positions</h2>
          <p>
            Explore our current job openings and find the right
            opportunity for you.
          </p>
        </div>

        <span className="career-open-positions__count">
          {loading && jobs.length === 0 ? "Loading..." : `${filteredJobs.length} ${ filteredJobs.length === 1 ? "Role" : "Roles" }`}
        </span>
      </div>

      <div className="career-open-positions__filters">
        <label className="career-open-positions__search">
          <MdSearch aria-hidden="true" />

          <input type="search" placeholder="Search positions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search job positions"
          />
        </label>

        <select value={department}
          onChange={(event) => setDepartment(event.target.value)}
          aria-label="Filter by department"
        >
          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          aria-label="Filter by location"
        >
          {locations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={employmentType}
          onChange={(event) => setEmploymentType(event.target.value)}
          aria-label="Filter by employment type"
        >
          {employmentTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          className="career-open-positions__error"
          role="alert"
        >
          <p>
            Unable to load career opportunities. Please try again.
          </p>

          <button
            type="button"
            onClick={refreshCareers}
          >
            <MdRefresh aria-hidden="true" />
            Retry
          </button>
        </div>
      )}

      {loading && jobs.length === 0 ? (
        <div
          className="career-open-positions__loading"
          role="status"
        >
          <span className="career-open-positions__spinner" />
          <p>Loading open positions...</p>
        </div>
      ) : (
        <div className="career-open-positions__list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <article
                className="career-job-card"
                key={job._id}
              >
                <div className="career-job-card__icon">
                  <MdWorkOutline aria-hidden="true" />
                </div>

                <div className="career-job-card__main">
                  <h3>{job.title}</h3>

                  {job.department && (
                    <p className="career-job-card__department">
                      {job.department}
                    </p>
                  )}

                  <div className="career-job-card__meta">
                    {job.location && (
                      <span>
                        <MdLocationOn aria-hidden="true" />
                        {job.location}
                      </span>
                    )}

                    {job.employmentType && (
                      <span>
                        <MdAccessTime aria-hidden="true" />
                        {job.employmentType}
                      </span>
                    )}

                    {job.workplaceType && (
                      <span>
                        <MdWorkOutline aria-hidden="true" />
                        {job.workplaceType}
                      </span>
                    )}
                  </div>

                  {job.description && (
                    <p className="career-job-card__description">
                      {job.description}
                    </p>
                  )}
                </div>

                <div className="career-job-card__actions">
                  <span className="career-job-card__status">
                    <span />
                    Open
                  </span>

                  <button
                    type="button"
                    className="career-job-card__apply"
                    onClick={() => handleApply(job)}
                    disabled={!job._id}
                  >
                    Apply Now
                    <MdArrowForward aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="career-open-positions__empty">
              <div className="career-open-positions__empty-icon">
                <MdWorkOutline aria-hidden="true" />
              </div>

              <h3>
                {error ? "Career opportunities unavailable" : "No matching positions found"}
              </h3>

              <p>
                {error ? "Please try again in a moment." : "Try changing your search or filters to explore other roles."}
              </p>

              {error ? (
                <button
                  type="button"
                  onClick={refreshCareers}
                >
                  Retry
                </button>
              ) : (
                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CareerOpenPositions;