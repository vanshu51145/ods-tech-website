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
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "120px" }}>Loading...</h2>;
  }

  if (!blog) {
    return <h2 style={{ textAlign: "center", marginTop: "120px" }}>Blog Not Found</h2>;
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | ODS Tech</title>

        <meta
          name="description"
          content={blog.content.replace(/<[^>]+>/g, "").substring(0, 150)}
        />

        <meta property="og:title" content={blog.title} />

        <meta
          property="og:description"
          content={blog.content.replace(/<[^>]+>/g, "").substring(0, 150)}
        />

        <meta property="og:image" content={blog.coverImage} />

        <meta property="og:type" content="article" />
      </Helmet>

      <section className="single-blog">

        <img
          src={blog.coverImage}
          alt={blog.title}
          className="single-image"
        />

        <h1>{blog.title}</h1>

        <p className="single-author">
          By {blog.author}
        </p>

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