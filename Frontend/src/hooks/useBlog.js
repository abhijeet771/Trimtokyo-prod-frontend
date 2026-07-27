import { useState, useCallback } from "react";
import api from "../services/api";

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

      const { data } = await api.get("/api/v1/blogs");
      setBlogs(data);
    } catch (err) {
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
      setBlog(null); // reset previous blog

      const { data } = await api.get(`/api/v1/blogs/${slug}`);
      setBlog(data);
    } catch (err) {
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

      const { data } = await api.post(
        "/api/v1/blogs",
        blogData
      );

      return data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create blog"
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

      const { data } = await api.put(
        `/api/v1/blogs/${id}`,
        blogData
      );

      return data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update blog"
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

      await api.delete(`/api/v1/blogs/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete blog"
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