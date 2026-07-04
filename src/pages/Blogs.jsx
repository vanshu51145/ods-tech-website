import { useEffect, useState } from "react";
import "./Blogs.css";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/blogs"
      );

      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <section className="blogs-page">
      <div className="blogs-header">
        <h1>Latest Blogs</h1>
        <p>
          Explore the latest articles, tutorials and insights from ODS Network.
        </p>
      </div>

      {loading ? (
        <div className="loading">Loading Blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="loading">No Blogs Available</div>
      ) : (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <article className="blog-card" key={blog._id}>
              <img
                src={blog.coverImage}
                alt={blog.title}
                loading="lazy"
              />

              <div className="blog-content">
                <h2>{blog.title}</h2>

                <p className="author">
                  By <span>{blog.author}</span>
                </p>

                <div
                  className="blog-text"
                  dangerouslySetInnerHTML={{
                    __html: blog.content,
                  }}
                />

                <button className="read-btn">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Blogs;