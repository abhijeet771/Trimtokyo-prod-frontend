import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {  MdArrowBack,  MdArrowForward,MdLocationOn,  MdWorkOutline,  MdAccessTime,
  MdCheckCircle,  MdUploadFile,  MdSend,  MdBusinessCenter,  MdPayments,
} from "react-icons/md";

import { usePublicCareerDetails } from "../hooks/user/usePublicCareer";
import "./CareerJobDetails.scss";

const INITIAL_FORM = { fullName: "", email: "", phone: "", experience: "", coverLetter: "",};

const CareerJobDetails = () => {
  const { slug: id } = useParams();
  const navigate = useNavigate();

  const { job, loading, error, refreshCareer } = usePublicCareerDetails(id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [resume, setResume] = useState(null);
  const [formError, setFormError] = useState("");

  const handleChange = ({ target: { name, value } }) => {
    setForm((previous) => ({ ...previous, [name]: value }));
    setFormError("");
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    const allowedExtensions = /\.(pdf|doc|docx)$/i;

    if (!allowedExtensions.test(file.name)) {
      setFormError("Please upload a PDF or Word document.");
      event.target.value = "";
      setResume(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Your resume must be smaller than 5 MB.");
      event.target.value = "";
      setResume(null);
      return;
    }

    setResume(file);
    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError(
      "Application submission is not connected yet. Please try again later."
    );
  };

  if (loading) {
    return (
      <main className="career-job-page">
        <section className="career-job-not-found">
          <p>Loading job details...</p>
        </section>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="career-job-page">
        <section className="career-job-not-found">
          <div className="career-job-not-found__icon">
            <MdBusinessCenter />
          </div>

          <h1>Job Opening Not Found</h1>
          <p>
            This position may have been removed or is no longer
            available.
          </p>

          {error && (
            <button
              type="button"
              onClick={refreshCareer}
              className="career-job-details__primary-button"
            >
              Try Again
            </button>
          )}

          <Link
            to="/career"
            className="career-job-details__primary-button"
          >
            <MdArrowBack />
            Back to Careers
          </Link>
        </section>
      </main>
    );
  }

  const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities : [];

  const requirements = Array.isArray(job.requirements)  ? job.requirements  : [];

  const benefits = Array.isArray(job.benefits) ? job.benefits : [];

  const salary =
    job.salary ||
    (job.salaryMin != null || job.salaryMax != null
      ? `${job.salaryMin ?? "Not specified"} – ${
          job.salaryMax ?? "Not specified"
        }`
      : "As per experience");

  return (
    <main className="career-job-page">
      <nav className="career-job-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/career">Careers</Link>
        <span>/</span>
        <span className="career-job-breadcrumb__current">
          {job.title}
        </span>
      </nav>

      <section className="career-job-header">
        <div className="career-job-header__top">
          <Link to="/career" className="career-job-header__back">
            <MdArrowBack />
            All Open Positions
          </Link>

          <span className="career-job-header__status">
            <span />
            Currently Hiring
          </span>
        </div>

        <div className="career-job-header__main">
          <div className="career-job-header__icon">
            <MdBusinessCenter />
          </div>

          <div className="career-job-header__content">
            <span className="career-job-header__department">
              {job.department}
            </span>

            <h1>{job.title}</h1>

            <div className="career-job-header__meta">
              {job.location && (
                <span>
                  <MdLocationOn />
                  {job.location}
                </span>
              )}

              {job.employmentType && (
                <span>
                  <MdWorkOutline />
                  {job.employmentType}
                </span>
              )}

              {job.workplaceType && (
                <span>
                  <MdAccessTime />
                  {job.workplaceType}
                </span>
              )}
            </div>
          </div>

          <a
            href="#career-application"
            className="career-job-header__apply"
          >
            Apply for this Role
            <MdArrowForward />
          </a>
        </div>
      </section>

      <section className="career-application" id="career-application">
        <div className="career-application__heading">
          <div>
            <span className="career-section-eyebrow">
              TAKE THE NEXT STEP
            </span>
            <h2>Apply for this Position</h2>
            <p>
              Share your details and tell us why you would be a great
              fit for TrimTokyo.
            </p>
          </div>

          <div className="career-application__heading-icon">
            <MdSend />
          </div>
        </div>

        <form
          className="career-application__form"
          onSubmit={handleSubmit}
        >
          <div className="career-application__form-top">
            <div>
              <h3>Candidate Information</h3>
              <p>
                Fields marked with <span>*</span> are required.
              </p>
            </div>

            <span className="career-application__file-note">
              Resume: PDF or Word, up to 5 MB
            </span>
          </div>

          <div className="career-application__grid">
            <div className="career-form-field">
              <label htmlFor="career-full-name">
                Full Name <span>*</span>
              </label>
              <input
                id="career-full-name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <div className="career-form-field">
              <label htmlFor="career-email">
                Email Address <span>*</span>
              </label>
              <input
                id="career-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                maxLength={254}
                required
              />
            </div>

            <div className="career-form-field">
              <label htmlFor="career-phone">
                Mobile Number <span>*</span>
              </label>
              <input
                id="career-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(event) => {
                  const phone = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setForm((previous) => ({ ...previous, phone }));
                  setFormError("");
                }}
                maxLength={10}
                required
              />
            </div>

            <div className="career-form-field">
              <label htmlFor="career-experience">
                Relevant Experience
              </label>
              <select
                id="career-experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
              >
                <option value="">Select experience</option>
                <option value="Fresher">Fresher</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1–3 years">1–3 years</option>
                <option value="3–5 years">3–5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>

            <div className="career-form-field career-form-field--full">
              <label htmlFor="career-resume">
                Upload Resume <span>*</span>
              </label>

              <label
                className={`career-resume-upload ${
                  resume ? "career-resume-upload--selected" : ""
                }`}
                htmlFor="career-resume"
              >
                <span className="career-resume-upload__icon">
                  <MdUploadFile />
                </span>

                <span className="career-resume-upload__text">
                  <strong>{resume?.name || "Choose your resume"}</strong>
                  <small>
                    {resume
                      ? `${(resume.size / 1024).toFixed(0)} KB`
                      : "PDF or DOC/DOCX · Maximum 5 MB"}
                  </small>
                </span>

                <span className="career-resume-upload__button">
                  Browse Files
                </span>
              </label>

              <input
                id="career-resume"
                className="career-resume-upload__input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                required
              />
            </div>

            <div className="career-form-field career-form-field--full">
              <label htmlFor="career-cover-letter">Cover Letter</label>
              <textarea
                id="career-cover-letter"
                name="coverLetter"
                rows={5}
                value={form.coverLetter}
                onChange={handleChange}
                maxLength={3000}
                placeholder="Tell us why you're interested in this role..."
              />
              <span className="career-form-field__hint">
                {form.coverLetter.length}/3000 characters
              </span>
            </div>
          </div>

          {formError && (
            <p className="career-application__error" role="alert">
              {formError}
            </p>
          )}

          <div className="career-application__footer">
            <p>
              Please ensure your contact details and resume are correct.
            </p>

            <button
              type="submit"
              className="career-application__submit"
            >
              Submit Application
              <MdArrowForward />
            </button>
          </div>
        </form>
      </section>

      <section className="career-job-information">
        <div className="career-job-information__main">
          <article className="career-job-section">
            <span className="career-section-eyebrow">ABOUT THE ROLE</span>
            <h2>Job Description</h2>
            <p className="career-job-section__description">
              {job.description}
            </p>
          </article>

          {responsibilities.length > 0 && (
            <article className="career-job-section">
              <h2>Key Responsibilities</h2>
              <ul className="career-job-list">
                {responsibilities.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <MdCheckCircle />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {requirements.length > 0 && (
            <article className="career-job-section">
              <h2>Requirements</h2>
              <ul className="career-job-list">
                {requirements.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <MdCheckCircle />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {benefits.length > 0 && (
            <article className="career-job-section">
              <h2>What We Offer</h2>
              <ul className="career-job-list">
                {benefits.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <MdCheckCircle />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>

        <aside className="career-job-summary">
          <div className="career-job-summary__heading">
            <MdBusinessCenter />
            <h2>Job Overview</h2>
          </div>

          <div className="career-job-summary__item">
            <span>Position</span>
            <strong>{job.title}</strong>
          </div>

          <div className="career-job-summary__item">
            <span>Department</span>
            <strong>{job.department || "Not specified"}</strong>
          </div>

          <div className="career-job-summary__item">
            <span>Location</span>
            <strong>{job.location || "Not specified"}</strong>
          </div>

          <div className="career-job-summary__item">
            <span>Employment Type</span>
            <strong>{job.employmentType || "Not specified"}</strong>
          </div>

          <div className="career-job-summary__item">
            <span>Workplace</span>
            <strong>{job.workplaceType || "Not specified"}</strong>
          </div>

          <div className="career-job-summary__item">
            <span>Compensation</span>
            <strong>
              <MdPayments />
              {salary}
            </strong>
          </div>

          {job.applicationDeadline && (
            <div className="career-job-summary__item">
              <span>Application Deadline</span>
              <strong>
                {new Date(job.applicationDeadline).toLocaleDateString()}
              </strong>
            </div>
          )}

          <a
            href="#career-application"
            className="career-job-summary__apply"
          >
            Apply for this Role
            <MdArrowForward />
          </a>

          <p className="career-job-summary__note">
            Complete the application form to express your interest.
          </p>
        </aside>
      </section>

      <footer className="career-job-footer">
        <Link to="/career">
          <MdArrowBack />
          Explore Other Opportunities
        </Link>

        <button type="button" onClick={() => navigate("/career")}>
          Back to Careers
        </button>
      </footer>
    </main>
  );
};

export default CareerJobDetails;
