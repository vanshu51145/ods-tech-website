import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import "./AdminBlogs.css";

function AdminBlogs() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [blogs, setBlogs] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
  });

  const [content, setContent] = useState("");

  const [coverImage, setCoverImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your blog content here...",
      height: 350,

      toolbarAdaptive: false,

      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,

      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "link",
        "table",
        "|",
        "align",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
      ],
    }),
    []
  );

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchBlogs();
    }
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addBlog = async (e) => {
    e.preventDefault();

    if (!coverImage) {
      alert("Please Select Cover Image");
      return;
    }

    setLoading(true);

    try {
      const sendData = new FormData();

      sendData.append("title", formData.title);
      sendData.append("author", formData.author);
      sendData.append("content", content);
      sendData.append("coverImage", coverImage);

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/blogs",
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: sendData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Blog Added Successfully");

        setFormData({
          title: "",
          author: "",
        });

        setContent("");
        setCoverImage(null);

        document.getElementById("coverImageInput").value = "";

        fetchBlogs();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something Went Wrong");
    }

    setLoading(false);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/blogs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Blog Deleted Successfully");
        fetchBlogs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="projects-page">
      <div className="projects-top">
        <h1>Manage Blogs</h1>

        <button
          className="back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          Dashboard
        </button>
      </div>

      <form className="project-form" onSubmit={addBlog}>
        <input
          type="text"
          placeholder="Blog Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          placeholder="Author Name"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <label className="editor-label">
          Blog Content
        </label>

        <JoditEditor
          value={content}
          config={editorConfig}
          onBlur={(newContent) => setContent(newContent)}
        />

        <input
          id="coverImageInput"
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files[0])}
          required
        />

        <button type="submit">
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>

      <div className="table-box">
        <h2>All Blogs</h2>

        <table>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="4">No Blogs Found</td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      width="90"
                    />
                  </td>

                  <td>{blog.title}</td>

                  <td>{blog.author}</td>

                  <td>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteBlog(blog._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBlogs;