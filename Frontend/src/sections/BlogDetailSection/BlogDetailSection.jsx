import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./BlogDetailSection.scss";
import useBlog from "../../hooks/useBlog";

const BlogDetailSection = () => {
  const { slug } = useParams();
  const { blog, loading, error, fetchBlogBySlug } = useBlog();

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug(slug);
    }
  }, [slug, fetchBlogBySlug]);

  if (loading) {
    return <p className="blog-detail__state">Loading...</p>;
  }

  if (error) {
    return <p className="blog-detail__state error">{error}</p>;
  }

  if (!blog) {
    return null;
  }

  return (
    <section className="blog-detail">
      <div className="blog-detail__container">

        <div className="blog-detail__header">
          <h1 className="blog-detail__title">
            {blog.title}
          </h1>

          <div className="blog-detail__meta">
            <span>
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <span>{blog.views} views</span>
          </div>
        </div>

        {blog.coverImage && (
          <div className="blog-detail__image">
            <img src={blog.coverImage} alt={blog.title} />
          </div>
        )}

        <div
          className="blog-detail__content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-detail__tags">
            {blog.tags.map((tag, index) => (
              <span key={index} className="blog-detail__tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default BlogDetailSection;