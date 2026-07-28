import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientAssets.css";

function ClientAssets() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const token = localStorage.getItem("token");

  // =========================
  // Fetch Client Assets
  // =========================

  const fetchAssets = async () => {
    try {
      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/client/assets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAssets(data.assets || []);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("FETCH ASSETS ERROR:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/client/login");
      return;
    }

    fetchAssets();
  }, []);

  // =========================
  // File Select
  // =========================

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
  };

  // =========================
  // Normal File Input
  // =========================

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];

    handleFileChange(selectedFile);
  };

  // =========================
  // Drag Events
  // =========================

  const handleDragOver = (e) => {
    e.preventDefault();

    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];

    handleFileChange(droppedFile);
  };

  // =========================
  // Upload Asset
  // =========================

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // IMPORTANT:
      // Backend uses Upload.single("asset")
      formData.append("asset", file);

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/client/assets",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Asset uploaded successfully");

        setFile(null);

        // Refresh assets
        fetchAssets();

        // Reset file input
        const fileInput =
          document.getElementById("assetInput");

        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("UPLOAD ASSET ERROR:", error);

      alert("Something went wrong while uploading");
    }

    setLoading(false);
  };

  return (
    <section className="client-assets-page">

      {/* Header */}

      <div className="assets-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/client/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

        <h1>
          📁 Project Assets
        </h1>

        <p>
          Upload logos, brand guidelines,
          documents and other project files.
        </p>

      </div>


      {/* Upload Section */}

      <div className="upload-card">

        <h2>
          Upload Project Asset
        </h2>

        {/* Drag and Drop Zone */}

        <div
          className={`drop-zone ${
            dragActive ? "drag-active" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >

          <div className="upload-icon">
            📤
          </div>

          <h3>
            Drag & Drop Your File Here
          </h3>

          <p>
            or
          </p>

          <label
            htmlFor="assetInput"
            className="choose-file-btn"
          >
            Choose File
          </label>

          <input
            id="assetInput"
            type="file"
            onChange={handleInputChange}
            hidden
          />

        </div>


        {/* Selected File */}

        {file && (

          <div className="selected-file">

            <div>

              <strong>
                Selected File:
              </strong>

              <p>
                {file.name}
              </p>

            </div>

            <button
              className="remove-file-btn"
              onClick={() => setFile(null)}
            >
              ✕
            </button>

          </div>

        )}


        {/* Upload Button */}

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={!file || loading}
        >

          {loading
            ? "Uploading..."
            : "Upload Asset"}

        </button>

      </div>


      {/* Uploaded Assets */}

      <div className="assets-list">

        <h2>
          My Uploaded Assets
        </h2>


        {assets.length === 0 ? (

          <div className="no-assets">
            <p>
              No assets uploaded yet.
            </p>
          </div>

        ) : (

          <div className="assets-grid">

            {assets.map((asset) => (

              <div
                className="asset-card"
                key={asset._id}
              >

                <div className="asset-icon">
                  📄
                </div>


                <div className="asset-info">

                  <h3>
                    {asset.fileName}
                  </h3>

                  <p>
                    {asset.fileType}
                  </p>

                  <small>
                    Uploaded:{" "}
                    {new Date(
                      asset.createdAt
                    ).toLocaleDateString()}
                  </small>

                </div>


                <a
                  href={asset.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-asset-btn"
                >
                  View / Download
                </a>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}

export default ClientAssets;