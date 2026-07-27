import React, { useEffect, useState } from "react";
import useBlog from "../../hooks/useBlog";
import "./AdminBlogSection.scss";

const AdminBlogSection = () => {
  const {
    blogs,
    fetchBlogs,
    createBlog,
    deleteBlog,
    loading,
    error,
  } = useBlog();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
    status: "draft",
  });

  useEffect(() => {
    fetchBlogs(); // NOTE: uses public API (published only)
  }, [fetchBlogs]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
    };

    try {
      await createBlog(payload);
      setShowForm(false);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this blog?")) {
      await deleteBlog(id);
      fetchBlogs();
    }
  };

  return (
    <div className="admin-blog">

      {/* HEADER */}
      <div className="admin-blog__header">
        <h2>Blog Management</h2>

        <button
          className="admin-blog__create-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "+ Create Blog"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form className="admin-blog__form" onSubmit={handleSubmit}>

          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            required
          />

          <input
            name="slug"
            placeholder="Slug (unique)"
            onChange={handleChange}
            required
          />

          <input
            name="excerpt"
            placeholder="Excerpt"
            onChange={handleChange}
            required
          />

          <input
            name="coverImage"
            placeholder="Cover Image URL"
            onChange={handleChange}
          />

          <input
            name="tags"
            placeholder="Tags (comma separated)"
            onChange={handleChange}
          />

          <select name="status" onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <textarea
            name="content"
            placeholder="Content (HTML supported)"
            onChange={handleChange}
            required
          />

          <button type="submit">Save Blog</button>
        </form>
      )}

      {/* ERROR */}
      {error && <p className="error">{error}</p>}

      {/* BLOG LIST */}
      <div className="admin-blog__list">
        {loading ? (
          <p>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="admin-blog__card">

              <div className="admin-blog__info">
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>

                <div className="admin-blog__meta">
                  <span>{blog.status}</span>
                  <span>{blog.views} views</span>
                </div>
              </div>

              <div className="admin-blog__actions">
                <button className="delete" onClick={() => handleDelete(blog._id)}>
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminBlogSection;