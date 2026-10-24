
import React, { useEffect, useState } from "react";
import { Plus, X, FileText,Search, Trash2, Eye, Clock3, Tag, Image as ImageIcon, CheckCircle2, AlertCircle, LoaderCircle, PenLine,
} from "lucide-react";

import useBlog from "../../../hooks/website/useBlog";
import "./AdminBlogSection.scss";

const AdminBlogSection = () => {
  const {
    blogs = [],
    fetchBlogs,
    createBlog,
    deleteBlog,
    loading,
    error,
  } = useBlog();

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState("");

  const initialFormData = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
    status: "draft",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "title" && !formData.slug) {
      setFormData((previous) => ({
        ...previous,
        title: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }));
    }

    setFormError("");
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormError("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const payload = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      setSubmitting(true);
      await createBlog(payload);
      resetForm();
      await fetchBlogs();
    } catch (err) {
      setFormError(
        err?.message || "Unable to create the blog. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteBlog(id);
      await fetchBlogs();
    } catch (err) {
      window.alert(err?.message || "Unable to delete this blog.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !query ||
      blog.title?.toLowerCase().includes(query) ||
      blog.slug?.toLowerCase().includes(query) ||
      blog.excerpt?.toLowerCase().includes(query) ||
      blog.tags?.some((tag) => tag.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "all" ||
      blog.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const publishedCount = blogs.filter(
    (blog) => blog.status?.toLowerCase() === "published"
  ).length;

  const draftCount = blogs.filter(
    (blog) => blog.status?.toLowerCase() === "draft"
  ).length;

  const totalViews = blogs.reduce(
    (total, blog) => total + (Number(blog.views) || 0),
    0
  );

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="admin-blog">
      {/* Page header */}
      <header className="admin-blog__header">
        <div className="admin-blog__heading">
          <div className="admin-blog__eyebrow">
            <FileText size={15} />
            <span>CONTENT MANAGEMENT</span>
          </div>

          <h1>Blog Management</h1>

          <p>
            Create, organize, and manage your articles from one place.
          </p>
        </div>

        <button
          type="button"
          className="admin-blog__create-btn"
          onClick={() => {
            setShowForm((previous) => !previous);
            setFormError("");
          }}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          <span>{showForm ? "Close Form" : "Create Blog"}</span>
        </button>
      </header>

      {/* Overview cards */}
      <div className="admin-blog__stats">
        <article className="admin-blog__stat-card">
          <div className="admin-blog__stat-icon admin-blog__stat-icon--total">
            <FileText size={20} />
          </div>
          <div className="admin-blog__stat-content">
            <span>Total Articles</span>
            <strong>{blogs.length}</strong>
            <small>All available articles</small>
          </div>
        </article>

        <article className="admin-blog__stat-card">
          <div className="admin-blog__stat-icon admin-blog__stat-icon--published">
            <CheckCircle2 size={20} />
          </div>
          <div className="admin-blog__stat-content">
            <span>Published</span>
            <strong>{publishedCount}</strong>
            <small>Live articles</small>
          </div>
        </article>

        <article className="admin-blog__stat-card">
          <div className="admin-blog__stat-icon admin-blog__stat-icon--draft">
            <PenLine size={20} />
          </div>
          <div className="admin-blog__stat-content">
            <span>Drafts</span>
            <strong>{draftCount}</strong>
            <small>Unpublished articles</small>
          </div>
        </article>

        <article className="admin-blog__stat-card">
          <div className="admin-blog__stat-icon admin-blog__stat-icon--views">
            <Eye size={20} />
          </div>
          <div className="admin-blog__stat-content">
            <span>Total Views</span>
            <strong>{totalViews.toLocaleString("en-IN")}</strong>
            <small>Across available articles</small>
          </div>
        </article>
      </div>

      {/* Create blog form */}
      {showForm && (
        <section className="admin-blog__form-panel">
          <div className="admin-blog__form-heading">
            <div>
              <span className="admin-blog__section-kicker">
                NEW ARTICLE
              </span>
              <h2>Create a blog post</h2>
              <p>Fill in the article details before saving.</p>
            </div>

            <button
              type="button"
              className="admin-blog__icon-btn"
              aria-label="Close form"
              onClick={resetForm}
            >
              <X size={19} />
            </button>
          </div>

          <form className="admin-blog__form" onSubmit={handleSubmit}>
            <div className="admin-blog__form-grid">
              <div className="admin-blog__field">
                <label htmlFor="blog-title">Blog title *</label>
                <input
                  id="blog-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title"
                  required
                  maxLength={180}
                />
              </div>

              <div className="admin-blog__field">
                <label htmlFor="blog-slug">URL slug *</label>
                <input
                  id="blog-slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="your-blog-url"
                  required
                />
                <small>Use a unique, URL-friendly identifier.</small>
              </div>

              <div className="admin-blog__field admin-blog__field--full">
                <label htmlFor="blog-excerpt">Short description *</label>
                <textarea
                  id="blog-excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Write a short summary of your article..."
                  rows={3}
                  required
                  maxLength={500}
                />
              </div>

              <div className="admin-blog__field admin-blog__field--full">
                <label htmlFor="blog-cover">Cover image URL</label>
                <div className="admin-blog__input-with-icon">
                  <ImageIcon size={18} />
                  <input
                    id="blog-cover"
                    type="url"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="admin-blog__field">
                <label htmlFor="blog-tags">Tags</label>
                <div className="admin-blog__input-with-icon">
                  <Tag size={18} />
                  <input
                    id="blog-tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Technology, Business, Tips"
                  />
                </div>
                <small>Separate multiple tags with commas.</small>
              </div>

              <div className="admin-blog__field">
                <label htmlFor="blog-status">Publication status</label>
                <select
                  id="blog-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="admin-blog__field admin-blog__field--full">
                <label htmlFor="blog-content">Article content *</label>
                <textarea
                  id="blog-content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your complete article content here. HTML is supported."
                  rows={10}
                  required
                />
                <small>
                  Your existing API receives this content as a string.
                </small>
              </div>
            </div>

            {formError && (
              <div className="admin-blog__alert admin-blog__alert--error">
                <AlertCircle size={17} />
                <span>{formError}</span>
              </div>
            )}

            <div className="admin-blog__form-footer">
              <p>* Required fields</p>

              <div className="admin-blog__form-actions">
                <button
                  type="button"
                  className="admin-blog__secondary-btn"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-blog__create-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="admin-blog__spinner" size={17} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Save Blog
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* Blog list */}
      <section className="admin-blog__library">
        <div className="admin-blog__library-heading">
          <div>
            <h2>All Articles</h2>
            <p>Manage your existing blog posts.</p>
          </div>

          <span className="admin-blog__result-count">
            {filteredBlogs.length}{" "}
            {filteredBlogs.length === 1 ? "article" : "articles"}
          </span>
        </div>

        <div className="admin-blog__toolbar">
          <div className="admin-blog__search">
            <Search size={18} />
            <input
              type="search"
              aria-label="Search articles"
              placeholder="Search by title, slug, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="admin-blog__filters">
            <label htmlFor="blog-status-filter">Status</label>
            <select
              id="blog-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="admin-blog__alert admin-blog__alert--error">
            <AlertCircle size={18} />
            <span>{typeof error === "string" ? error : "Unable to load blogs."}</span>
          </div>
        )}

        {loading ? (
          <div className="admin-blog__state">
            <LoaderCircle className="admin-blog__spinner" size={30} />
            <h3>Loading articles</h3>
            <p>Please wait while your blog library loads.</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="admin-blog__state">
            <div className="admin-blog__state-icon">
              <FileText size={27} />
            </div>
            <h3>
              {blogs.length === 0 ? "No articles yet" : "No matching articles"}
            </h3>
            <p>
              {blogs.length === 0
                ? "Create your first blog post to get started."
                : "Try changing your search or status filter."}
            </p>

            {blogs.length === 0 && (
              <button
                type="button"
                className="admin-blog__secondary-btn"
                onClick={() => setShowForm(true)}
              >
                <Plus size={17} />
                Create your first blog
              </button>
            )}
          </div>
        ) : (
          <div className="admin-blog__list">
            {filteredBlogs.map((blog) => (
              <article key={blog._id} className="admin-blog__card">
                <div className="admin-blog__cover">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <div className="admin-blog__cover-placeholder">
                      <ImageIcon size={27} />
                      <span>No cover image</span>
                    </div>
                  )}
                </div>

                <div className="admin-blog__info">
                  <div className="admin-blog__card-top">
                    <span
                      className={`admin-blog__status admin-blog__status--${(
                        blog.status || "draft"
                      ).toLowerCase()}`}
                    >
                      <span className="admin-blog__status-dot" />
                      {blog.status || "Draft"}
                    </span>

                    <span className="admin-blog__date">
                      <Clock3 size={14} />
                      {formatDate(blog.createdAt || blog.updatedAt)}
                    </span>
                  </div>

                  <h3>{blog.title}</h3>

                  <p className="admin-blog__excerpt">
                    {blog.excerpt || "No description available."}
                  </p>

                  {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                    <div className="admin-blog__tags">
                      {blog.tags.slice(0, 4).map((tag, index) => (
                        <span key={`${tag}-${index}`}>
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}

                      {blog.tags.length > 4 && (
                        <span>+{blog.tags.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div className="admin-blog__meta">
                    <span>
                      <Eye size={15} />
                      {(Number(blog.views) || 0).toLocaleString("en-IN")} views
                    </span>

                    {blog.slug && (
                      <span className="admin-blog__slug">
                        /{blog.slug}
                      </span>
                    )}
                  </div>
                </div>

                <div className="admin-blog__actions">
                  <button
                    type="button"
                    className="admin-blog__delete-btn"
                    onClick={() => handleDelete(blog._id)}
                    disabled={deletingId === blog._id}
                    aria-label={`Delete ${blog.title}`}
                    title="Delete blog"
                  >
                    {deletingId === blog._id ? (
                      <LoaderCircle
                        size={17}
                        className="admin-blog__spinner"
                      />
                    ) : (
                      <Trash2 size={17} />
                    )}
                    <span>
                      {deletingId === blog._id ? "Deleting..." : "Delete"}
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default AdminBlogSection;