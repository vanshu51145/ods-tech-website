import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./SingleBlog.css";

function SingleBlog() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/blogs/${slug}`
      );

      const data = await response.json();

      if (data.success) {
        setBlog(data.blog);
      } else {
        setBlog(null);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setBlog(null);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "120px" }}>
        Loading...
      </h2>
    );
  }

  if (!blog) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "120px" }}>
        Blog Not Found
      </h2>
    );
  }

  const cleanContent = (blog.content || "").replace(/<[^>]+>/g, "");
  const shortDescription = cleanContent.substring(0, 150);

  return (
    <>
      {/* SEO SAFE HELMET */}
      <Helmet>
        <title>
          {blog?.title ? `${blog.title} | ODS Tech` : "ODS Tech"}
        </title>

        <meta name="description" content={shortDescription} />

        <meta property="og:title" content={blog?.title || "ODS Tech"} />

        <meta
          property="og:description"
          content={shortDescription}
        />

        <meta property="og:image" content={blog?.coverImage || ""} />

        <meta property="og:type" content="article" />
      </Helmet>

      {/* BLOG CONTENT */}
      <section className="single-blog">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="single-image"
        />

        <h1>{blog.title}</h1>

        <p className="single-author">By {blog.author}</p>

        <div
          className="single-content"
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />
      </section>
    </>
  );
}

export default SingleBlog;