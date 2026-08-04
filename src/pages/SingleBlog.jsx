import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./SingleBlog.css";
import { blogApi } from "../services/api";

function SingleBlog() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = useCallback(async () => {
    try {
      const data = await blogApi.getBySlug(slug);
      if (data.success) {
        setBlog(data.blog);
      } else {
        setBlog(null);
      }
    } catch (err) {
      setBlog(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "120px" }}>Loading...</h2>;
  }

  if (!blog) {
    return <h2 style={{ textAlign: "center", marginTop: "120px" }}>Blog Not Found</h2>;
  }

  const cleanContent = (blog.content || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const shortDescription = cleanContent.length > 160 ? `${cleanContent.substring(0, 157)}...` : cleanContent;

  return (
    <>
      <Helmet>
        <title>{blog?.title ? `${blog.title} | ODS Network` : "ODS Network | Technology & Digital Solutions"}</title>
        <meta name="description" content={shortDescription || "Read the latest technology, web development, software, SEO, and digital solutions insights from ODS Network."} />
        <meta property="og:title" content={blog?.title || "ODS Network"} />
        <meta property="og:description" content={shortDescription || "Read the latest technology and digital solutions insights from ODS Network."} />
        <meta property="og:image" content={blog?.coverImage || ""} />
        <meta property="og:type" content="article" />
      </Helmet>

      <section className="single-blog">
        <img src={blog.coverImage} alt={blog.title} className="single-image" />
        <h1>{blog.title}</h1>
        <p className="single-author">By {blog.author}</p>
        <div className="single-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </section>
    </>
  );
}

export default SingleBlog;