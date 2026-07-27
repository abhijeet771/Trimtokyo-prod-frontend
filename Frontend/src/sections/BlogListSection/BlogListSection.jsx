import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./BlogListSection.scss";
import useBlog from "../../hooks/useBlog";

const BlogListSection = () => {
  const { blogs, loading, error, fetchBlogs } = useBlog();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <section className="blog-list">
      <div className="blog-list__container">

        <div className="blog-list__header">
          <h2 className="blog-list__title">
            Latest Articles
          </h2>
          <p className="blog-list__subtitle">
            Explore grooming tips, beard styles and professional insights.
          </p>
        </div>

        {loading && <p className="blog-list__state">Loading...</p>}
        {error && <p className="blog-list__state error">{error}</p>}

        {!loading && !error && blogs.length === 0 && (
          <p className="blog-list__state">
            No blogs available.
          </p>
        )}

        <div className="blog-list__grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-list__card">

              {blog.coverImage && (
                <div className="blog-list__image">
                  <img src={blog.coverImage} alt={blog.title} />
                </div>
              )}

              <div className="blog-list__content">
                <h3 className="blog-list__card-title">
                  {blog.title}
                </h3>

                <p className="blog-list__excerpt">
                  {blog.excerpt}
                </p>

                <div className="blog-list__meta">
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    {blog.views} views
                  </span>
                </div>

                <Link
                  to={`/blog/${blog.slug}`}
                  className="blog-list__read-more"
                >
                  Read More →
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogListSection;