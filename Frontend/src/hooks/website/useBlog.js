
import { useState, useCallback } from "react";
import blogService from "../../services/shared/blog.service.js";

const useBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- Get All Published Blogs ---------------- */
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (err) {
      console.error("Fetch blogs error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch blogs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- Get Blog By Slug ---------------- */
  const fetchBlogBySlug = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      setBlog(null);

      const { data } = await blogService.getBlogBySlug(slug);
      setBlog(data);
    } catch (err) {
      console.error("Fetch blog by slug error:", err);

      setError(
        err.response?.data?.message || "Blog not found"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- Create Blog (Admin) ---------------- */
  const createBlog = async (blogData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await blogService.createBlog(blogData);
      return data;
    } catch (err) {
      console.error("Create blog error:", err);

      setError(
        err.response?.data?.message || "Failed to create blog"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Update Blog (Admin) ---------------- */
  const updateBlog = async (id, blogData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await blogService.updateBlog(id, blogData);
      return data;
    } catch (err) {
      console.error("Update blog error:", err);

      setError(
        err.response?.data?.message || "Failed to update blog"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Delete Blog (Admin) ---------------- */
  const deleteBlog = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await blogService.deleteBlog(id);
    } catch (err) {
      console.error("Delete blog error:", err);

      setError(
        err.response?.data?.message || "Failed to delete blog"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    blogs,
    blog,
    loading,
    error,
    fetchBlogs,
    fetchBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
  };
};

export default useBlog;
