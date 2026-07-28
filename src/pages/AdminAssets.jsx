import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAssets.css";

function AdminAssets() {

  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const adminRole =
    localStorage.getItem("adminRole");

  const isSuperAdmin =
    adminRole === "SuperAdmin";


  // =========================
  // Fetch All Assets
  // =========================

  const fetchAssets = async () => {

    try {

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/admin/assets",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (data.success) {

        setAssets(
          data.assets || []
        );

      } else {

        alert(
          data.message ||
          "Failed to fetch assets"
        );

      }

    } catch (error) {

      console.error(
        "FETCH ADMIN ASSETS ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    if (!token) {

      navigate("/admin/login");

      return;

    }

    fetchAssets();

  }, []);


  // =========================
  // Delete Asset
  // =========================

  const deleteAsset = async (id) => {

    if (!isSuperAdmin) {

      alert(
        "Only SuperAdmin can delete assets"
      );

      return;

    }


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this asset?"
      );


    if (!confirmDelete) return;


    try {

      const response =
        await fetch(
          `https://ods-network-backend.onrender.com/api/admin/assets/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const data =
        await response.json();


      if (data.success) {

        alert(
          "Asset deleted successfully"
        );

        setAssets(
          (prev) =>
            prev.filter(
              (asset) =>
                asset._id !== id
            )
        );

      } else {

        alert(
          data.message ||
          "Delete failed"
        );

      }

    } catch (error) {

      console.error(
        "DELETE ASSET ERROR:",
        error
      );

      alert(
        "Failed to delete asset"
      );

    }

  };


  return (

    <section className="admin-assets-page">


      {/* Header */}

      <div className="admin-assets-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          ← Back to Dashboard
        </button>


        <h1>
          📁 Project Assets
        </h1>


        <p>
          View and manage files
          uploaded by clients.
        </p>

      </div>


      {/* Assets Table */}

      <div className="assets-table-container">

        <h2>
          Client Uploaded Assets
        </h2>


        {loading ? (

          <p className="loading">
            Loading Assets...
          </p>

        ) : assets.length === 0 ? (

          <p className="no-assets">
            No assets uploaded yet.
          </p>

        ) : (

          <div className="table-scroll">

            <table>

              <thead>

                <tr>

                  <th>
                    Client
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    File Name
                  </th>

                  <th>
                    File Type
                  </th>

                  <th>
                    Uploaded Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {assets.map(
                  (asset) => (

                    <tr
                      key={
                        asset._id
                      }
                    >

                      <td>
                        {
                          asset.clientId
                            ?.name ||
                          "Unknown Client"
                        }
                      </td>


                      <td>
                        {
                          asset.clientId
                            ?.email ||
                          "N/A"
                        }
                      </td>


                      <td>
                        {
                          asset.fileName
                        }
                      </td>


                      <td>
                        {
                          asset.fileType
                        }
                      </td>


                      <td>

                        {new Date(
                          asset.createdAt
                        ).toLocaleDateString()}

                      </td>


                      <td>

                        <div className="asset-actions">

                          <a
                            href={
                              asset.fileUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-btn"
                          >
                            View / Download
                          </a>


                          {isSuperAdmin && (

                            <button
                              className="delete-btn"
                              onClick={() =>
                                deleteAsset(
                                  asset._id
                                )
                              }
                            >
                              Delete
                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>

  );

}

export default AdminAssets;