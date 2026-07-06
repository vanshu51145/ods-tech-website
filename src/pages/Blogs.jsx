import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blogs.css";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;

  useEffect(() => {
    fetchBlogs();
  }, [search, page]);

  const fetchBlogs = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/blogs?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=${limit}`
      );

      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <section className="blogs-page">
      <div className="blogs-header">
        <h1>Latest Blogs</h1>

        <p>
          Explore the latest articles, tutorials and insights from ODS
          Network.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading Blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="loading">No Blogs Available</div>
      ) : (
        <>
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

                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="read-btn"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={page === index + 1 ? "active-page" : ""}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Blogs;