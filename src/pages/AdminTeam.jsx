import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminTeam.css";

function AdminTeam() {

  const navigate = useNavigate();

  const [teamMembers, setTeamMembers] = useState([]);
  const adminRole = localStorage.getItem("adminRole");
const isSuperAdmin = adminRole === "SuperAdmin";

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    bio: "",
    linkedinUrl: "",
    profileImage: null,
  });

  const [editingId, setEditingId] = useState(null);


  // Fetch Team Members
  const getTeamMembers = async () => {

    try {

      const res = await fetch(
        "https://ods-network-backend.onrender.com/api/team",
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      setTeamMembers(data.teamMembers || []);

    } catch (error) {

      console.log("GET TEAM ERROR:", error);

    }

  };


  useEffect(() => {
    getTeamMembers();
  }, []);


  // Input Change
  const handleChange = (e) => {

    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

  };


  // Add / Edit Team Member
  const handleSubmit = async (e) => {

    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("designation", formData.designation);
    data.append("bio", formData.bio);
    data.append("linkedinUrl", formData.linkedinUrl);

    if (formData.profileImage) {
      data.append(
        "profileImage",
        formData.profileImage
      );
    }


    const url = editingId
      ? `https://ods-network-backend.onrender.com/api/team/${editingId}`
      : "https://ods-network-backend.onrender.com/api/team";


    const method = editingId
      ? "PUT"
      : "POST";


    try {

      const res = await fetch(url, {

        method,

        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`,
        },

        body: data,

      });


      const result = await res.json();

      if (!res.ok) {

        alert(result.message);

        return;

      }


      alert(
        editingId
          ? "Team Member Updated Successfully"
          : "Team Member Added Successfully"
      );


      resetForm();

      getTeamMembers();

    } catch (error) {

      console.log("TEAM ERROR:", error);

      alert("Something went wrong");

    }

  };


  // Edit
  const editMember = (member) => {

    setEditingId(member._id);

    setFormData({

      name: member.name,

      designation:
        member.designation,

      bio:
        member.bio,

      linkedinUrl:
        member.linkedinUrl || "",

      profileImage: null,

    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // Delete
  const deleteMember = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this team member?"
      );

    if (!confirmDelete) return;


    try {

      const res = await fetch(

        `https://ods-network-backend.onrender.com/api/team/${id}`,

        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }

      );


      const data = await res.json();

      alert(data.message);

      getTeamMembers();

    } catch (error) {

      console.log(
        "DELETE TEAM ERROR:",
        error
      );

    }

  };


  // Reset Form
  const resetForm = () => {

    setEditingId(null);

    setFormData({

      name: "",
      designation: "",
      bio: "",
      linkedinUrl: "",
      profileImage: null,

    });

  };


  return (

    <div className="team-admin-page">


      {/* Header */}

      <div className="team-page-header">

        <h1>
          Manage Team
        </h1>

        <button
          className="dashboard-btn"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          Dashboard
        </button>

      </div>



      {/* Form */}

      <form
        className="team-form"
        onSubmit={handleSubmit}
      >

        <h2>
          {editingId
            ? "Edit Team Member"
            : "Add New Team Member"}
        </h2>


        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />


        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
          required
        />


        <textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={handleChange}
          required
        />


        <input
          type="url"
          name="linkedinUrl"
          placeholder="LinkedIn URL"
          value={formData.linkedinUrl}
          onChange={handleChange}
        />


        <input
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={handleChange}
          required={!editingId}
        />


        <div className="form-buttons">

          <button
            type="submit"
            className="save-team-btn"
          >
            {editingId
              ? "Update Team Member"
              : "Add Team Member"}
          </button>


          {editingId && (

            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>

          )}

        </div>

      </form>



      {/* Team List */}

      <h2 className="team-list-title">
        Existing Team Members
      </h2>


      <div className="team-admin-grid">

        {teamMembers.length === 0 ? (

          <p className="no-team">
            No team members found.
          </p>

        ) : (

          teamMembers.map((member) => (

            <div
              className="team-admin-card"
              key={member._id}
            >

              <img
                src={member.profileImage}
                alt={member.name}
              />


              <div className="team-card-content">

                <h3>
                  {member.name}
                </h3>

                <p className="designation">
                  {member.designation}
                </p>

                <p>
                  {member.bio}
                </p>


                {member.linkedinUrl && (

                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn Profile
                  </a>

                )}


                <div className="team-actions">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editMember(member)
                    }
                  >
                    Edit
                  </button>

{isSuperAdmin && (
                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteMember(member._id)
                    }
                  >
                    Delete
                  </button>)}

                </div>

              </div>

            </div>

          ))

        )}

      </div>


    </div>

  );

}


export default AdminTeam;