import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProjectMilestones.css";

function AdminProjectMilestones() {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [clientId, setClientId] = useState("");

    const [milestone, setMilestone] = useState({
        title: "",
        description: "",
        dueDate: ""
    });

    const [milestones, setMilestones] = useState([]);


    // Fetch Clients
    useEffect(() => {

        fetch(
            "https://ods-network-backend.onrender.com/api/clients",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then(res => res.json())
            .then(data => {
                setClients(data.clients || []);
            });

    }, []);



    // Fetch Milestones
    const getMilestones = async () => {

        const res = await fetch(
            "https://ods-network-backend.onrender.com/api/milestones",
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        const data = await res.json();

        setMilestones(data.milestones || []);

    };


    useEffect(() => {
        getMilestones();
    }, []);



    // Create Milestone
    const createMilestone = async (e) => {

        e.preventDefault();


        await fetch(
            "https://ods-network-backend.onrender.com/api/milestones",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                },

                body: JSON.stringify({
                    clientId,
                    ...milestone
                })

            }
        );


        getMilestones();

    };



    // Update Status
    const updateStatus = async (id) => {


        await fetch(
            `https://ods-network-backend.onrender.com/api/milestones/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",

                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                },

                body: JSON.stringify({
                    isCompleted: true
                })

            }
        );


        getMilestones();

    };



    return (

        <div className="page">

            <div className="page-header">

                <h1>Project Milestones</h1>

                <button
                    className="dashboard-btn"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    Dashboard
                </button>

            </div>

            <form
                className="milestone-form"
                onSubmit={createMilestone}
            >

                <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                >

                    <option>
                        Select Client
                    </option>


                    {
                        clients.map(client => (

                            <option
                                key={client._id}
                                value={client._id}
                            >
                                {client.name}

                            </option>

                        ))
                    }


                </select>



                <input
                    placeholder="Milestone Title"

                    onChange={(e) =>
                        setMilestone({
                            ...milestone,
                            title: e.target.value
                        })
                    }
                />



                <textarea
                    placeholder="Description"

                    onChange={(e) =>
                        setMilestone({
                            ...milestone,
                            description: e.target.value
                        })
                    }
                />



                <input
                    type="date"

                    onChange={(e) =>
                        setMilestone({
                            ...milestone,
                            dueDate: e.target.value
                        })
                    }
                />



                <button>
                    Create Milestone
                </button>


            </form>




            <h2>
                Existing Milestones
            </h2>
            <div className="milestone-list">

                {
                    milestones.map(item => (

                        <div key={item._id}>

                            <h3>
                                {item.title}
                            </h3>

                            <p>
                                {item.description}
                            </p>
                            <p><strong>Client:</strong> {item.clientId?.name}</p>

                            <p><strong>Due:</strong> {new Date(item.dueDate).toLocaleDateString()}</p>


                            <p>
                                Status:
                                {" "}
                                <span
                                    className={
                                        item.isCompleted
                                            ? "status completed"
                                            : "status pending"
                                    }
                                >
                                    {item.isCompleted ? "Completed" : "Pending"}
                                </span>
                            </p>

                            <label className="checkbox-row">
                                <input
                                    type="checkbox"
                                    checked={item.isCompleted}
                                    onChange={() => updateStatus(item._id)}
                                    disabled={item.isCompleted}
                                />
                                Mark Completed
                            </label>


                        </div>

                    ))
                }

            </div>

        </div>

    )

}


export default AdminProjectMilestones;