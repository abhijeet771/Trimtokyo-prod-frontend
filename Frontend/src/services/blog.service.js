import apik from "./apik";

/* ============================================================
   BLOG APIs
============================================================ */

// Get all blogs
export const getAllBlogs = () => {
  return apik.get("/api/blogs");
};

// Get a blog by slug
export const getBlogBySlug = (slug) => {
  return apik.get(`/api/blogs/${slug}`);
};

// Create a blog
export const createBlog = (data) => {
  return apik.post("/api/blogs", data);
};

// Update a blog
export const updateBlog = (id, data) => {
  return apik.put(`/api/blogs/${id}`, data);
};

// Delete a blog
export const deleteBlog = (id) => {
  return apik.delete(`/api/blogs/${id}`);
};

/* ============================================================
   DEFAULT EXPORT
============================================================ */

const blogService = {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};

export default blogService;
