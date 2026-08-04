import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientAssets.css";
import { assetApi } from "../services/api";

function ClientAssets() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchAssets = useCallback(async () => {
    try {
      const data = await assetApi.getClient();
      if (data.success) {
        setAssets(data.assets || []);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("FETCH ASSETS ERROR:", err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      navigate("/client/login");
      return;
    }
    fetchAssets();
  }, [fetchAssets, navigate]);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

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
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("asset", file);

      const data = await assetApi.uploadClient(formData);

      if (data.success) {
        alert("Asset uploaded successfully");
        setFile(null);
        fetchAssets();
        const fileInput = document.getElementById("assetInput");
        if (fileInput) fileInput.value = "";
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("UPLOAD ASSET ERROR:", err);
      alert("Something went wrong while uploading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="client-assets-page">
      <div className="assets-header">
        <button className="back-btn" onClick={() => navigate("/client/dashboard")}>← Back to Dashboard</button>
        <h1>📁 Project Assets</h1>
        <p>Upload logos, brand guidelines, documents and other project files.</p>
      </div>

      <div className="upload-card">
        <h2>Upload Project Asset</h2>
        <div className={`drop-zone ${dragActive ? "drag-active" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          <div className="upload-icon">📤</div>
          <h3>Drag & Drop Your File Here</h3>
          <p>or</p>
          <label htmlFor="assetInput" className="choose-file-btn">Choose File</label>
          <input id="assetInput" type="file" onChange={handleInputChange} hidden />
        </div>

        {file && (
          <div className="selected-file">
            <div><strong>Selected File:</strong><p>{file.name}</p></div>
            <button className="remove-file-btn" onClick={() => setFile(null)}>✕</button>
          </div>
        )}

        <button className="upload-btn" onClick={handleUpload} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload Asset"}
        </button>
      </div>

      <div className="assets-list">
        <h2>My Uploaded Assets</h2>
        {assets.length === 0 ? (
          <div className="no-assets"><p>No assets uploaded yet.</p></div>
        ) : (
          <div className="assets-grid">
            {assets.map((asset) => (
              <div className="asset-card" key={asset._id}>
                <div className="asset-icon">📄</div>
                <div className="asset-info">
                  <h3>{asset.fileName}</h3>
                  <p>{asset.fileType}</p>
                  <small>Uploaded: {new Date(asset.createdAt).toLocaleDateString()}</small>
                </div>
                <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" className="view-asset-btn">View / Download</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ClientAssets;