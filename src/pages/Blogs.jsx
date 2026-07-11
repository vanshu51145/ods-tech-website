import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Blogs.css";
import { Helmet } from "react-helmet-async";

function Blogs() {
  const navigate = useNavigate();
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
      <>
    <Helmet>
      <title>Latest Blogs | ODS Network</title>

      <meta
        name="description"
        content="Read the latest blogs from ODS Network on Web Development, Mobile App Development, SEO, Digital Marketing, UI/UX Design, Cloud Solutions, and emerging technologies."
      />

      <meta
        name="keywords"
        content="ODS Network Blogs, Web Development Blogs, SEO Tips, Digital Marketing, Mobile App Development, Technology Articles, IT Solutions"
      />

      <meta name="author" content="ODS Network" />

      <meta
        property="og:title"
        content="Latest Blogs | ODS Network"
      />

      <meta
        property="og:description"
        content="Stay updated with the latest insights on web development, SEO, digital marketing, and technology from ODS Network."
      />

      <meta property="og:type" content="website" />
    </Helmet>
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
                  alt={`${blog.title} - ODS Network Blog`}
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
      <div className="blogs-cta">
  <h2>Need Professional IT Solutions?</h2>

  <p>
    Looking for a reliable technology partner? Explore our services or
    contact our team to discuss your project.
  </p>

  <div className="blogs-cta-buttons">
    <button
      className="primary-btn"
      onClick={() => navigate("/services")}
    >
      Explore Services
    </button>

    <button
      className="secondary-btn"
      onClick={() => navigate("/contact")}
    >
      Contact Us
    </button>
  </div>
</div>
    </section>
    </>
  );
}

export default Blogs;