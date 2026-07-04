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
      setLoading(false);
    }
  };

  return (
    <section className="blogs-page">

      <h1>Latest Blogs</h1>

      {loading ? (
        <h2>Loading...</h2>
      ) : blogs.length === 0 ? (
        <h2>No Blogs Available</h2>
      ) : (
        <div className="blogs-grid">

          {blogs.map((blog) => (

            <div className="blog-card" key={blog._id}>

              <img
                src={blog.coverImage}
                alt={blog.title}
              />

              <div className="blog-content">

                <h2>{blog.title}</h2>

                <p className="author">
                  By {blog.author}
                </p>

                <div
                  className="blog-text"
                  dangerouslySetInnerHTML={{
                    __html: blog.content,
                  }}
                />

              </div>

            </div>

          ))}

        </div>
      )}

    </section>
  );
}

export default Blogs;