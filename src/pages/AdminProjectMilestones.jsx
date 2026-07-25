import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";
import "./AdminProjectMilestones.css";

function AdminProjectMilestones() {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [clientId, setClientId] = useState("");

    const [milestone, setMilestone] = useState({
        title: "",
        description: "",
        dueDate: "",
    });

    const [milestones, setMilestones] = useState([]);

    // =========================
    // Fetch Clients
    // =========================
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch(
                    "https://ods-network-backend.onrender.com/api/clients",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const data = await res.json();

                if (data.success) {
                    setClients(data.clients || []);
                }
            } catch (error) {
                console.log("FETCH CLIENTS ERROR:", error);
            }
        };

        fetchClients();
    }, []);

    // =========================
    // Fetch Milestones
    // =========================
    const getMilestones = async () => {
        try {
            const res = await fetch(
                "https://ods-network-backend.onrender.com/api/milestones",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await res.json();

            if (data.success) {
                setMilestones(data.milestones || []);
            }
        } catch (error) {
            console.log("FETCH MILESTONES ERROR:", error);
        }
    };

    useEffect(() => {
        getMilestones();
    }, []);

    // =========================
    // Create Milestone
    // =========================
    const createMilestone = async (e) => {
        e.preventDefault();

        if (!clientId || !milestone.title) {
            alert("Please select client and enter milestone title");
            return;
        }

        try {
            const res = await fetch(
                "https://ods-network-backend.onrender.com/api/milestones",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },

                    body: JSON.stringify({
                        clientId,
                        ...milestone,
                        status: "Pending",
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Milestone Created Successfully");

                setClientId("");

                setMilestone({
                    title: "",
                    description: "",
                    dueDate: "",
                });

                getMilestones();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log("CREATE MILESTONE ERROR:", error);
            alert("Failed to create milestone");
        }
    };

    // =========================
    // Update Milestone Status
    // =========================
    const updateMilestoneStatus = async (id, newStatus) => {
        try {
            // Optimistic UI update
            setMilestones((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? {
                              ...item,
                              status: newStatus,
                              isCompleted:
                                  newStatus === "Completed",
                          }
                        : item
                )
            );

            const res = await fetch(
                `https://ods-network-backend.onrender.com/api/milestones/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },

                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await res.json();

            if (!data.success) {
                alert(data.message || "Failed to update status");

                // Restore backend data
                getMilestones();
            }
        } catch (error) {
            console.log("UPDATE MILESTONE ERROR:", error);

            alert("Failed to update milestone status");

            getMilestones();
        }
    };

    // =========================
    // Drag & Drop
    // =========================
    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const milestoneId = result.draggableId;

        const newStatus =
            result.destination.droppableId;

        // Same column
        if (
            result.source.droppableId ===
            result.destination.droppableId
        ) {
            return;
        }

        updateMilestoneStatus(
            milestoneId,
            newStatus
        );
    };

    // =========================
    // Kanban Columns
    // =========================
    const columns = [
        {
            id: "Pending",
            title: "Pending",
        },
        {
            id: "In Progress",
            title: "In Progress",
        },
        {
            id: "Completed",
            title: "Completed",
        },
    ];

    return (
        <div className="page">

            {/* =========================
                Header
            ========================= */}

            <div className="page-header">

                <h1>
                    Project Milestones
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


            {/* =========================
                Create Milestone Form
            ========================= */}

            <form
                className="milestone-form"
                onSubmit={createMilestone}
            >

                <select
                    value={clientId}
                    onChange={(e) =>
                        setClientId(e.target.value)
                    }
                >

                    <option value="">
                        Select Client
                    </option>

                    {clients.map((client) => (

                        <option
                            key={client._id}
                            value={client._id}
                        >
                            {client.name}
                        </option>

                    ))}

                </select>


                <input
                    placeholder="Milestone Title"
                    value={milestone.title}
                    onChange={(e) =>
                        setMilestone({
                            ...milestone,
                            title: e.target.value,
                        })
                    }
                />


                <textarea
                    placeholder="Description"
                    value={milestone.description}
                    onChange={(e) =>
                        setMilestone({
                            ...milestone,
                            description:
                                e.target.value,
                        })
                    }
                />


                <input
                    type="date"
                    value={milestone.dueDate}
                    onChange={(e) =>
                        setMilestone({
                            ...milestone,
                            dueDate:
                                e.target.value,
                        })
                    }
                />


                <button type="submit">
                    Create Milestone
                </button>

            </form>


            {/* =========================
                Kanban Board
            ========================= */}

            <h2 className="kanban-heading">
                Milestone Progress
            </h2>


            <DragDropContext
                onDragEnd={handleDragEnd}
            >

                <div className="kanban-board">

                    {columns.map((column) => {

                        const columnMilestones =
                            milestones.filter(
                                (item) => {

                                    // Old milestones
                                    // without status
                                    if (
                                        !item.status
                                    ) {
                                        if (
                                            column.id ===
                                            "Completed"
                                        ) {
                                            return (
                                                item.isCompleted ===
                                                true
                                            );
                                        }

                                        if (
                                            column.id ===
                                            "Pending"
                                        ) {
                                            return (
                                                item.isCompleted !==
                                                true
                                            );
                                        }

                                        return false;
                                    }

                                    return (
                                        item.status ===
                                        column.id
                                    );
                                }
                            );

                        return (

                            <Droppable
                                key={column.id}
                                droppableId={
                                    column.id
                                }
                            >

                                {(provided) => (

                                    <div
                                        className={`kanban-column ${column.id
                                            .toLowerCase()
                                            .replace(
                                                " ",
                                                "-"
                                            )}`}
                                        ref={
                                            provided.innerRef
                                        }
                                        {...provided.droppableProps}
                                    >

                                        <div className="kanban-column-header">

                                            <h2>
                                                {column.title}
                                            </h2>

                                            <span>
                                                {
                                                    columnMilestones.length
                                                }
                                            </span>

                                        </div>


                                        <div className="kanban-cards">

                                            {columnMilestones.length ===
                                            0 ? (

                                                <p className="empty-column">
                                                    No milestones
                                                </p>

                                            ) : (

                                                columnMilestones.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <Draggable
                                                            key={
                                                                item._id
                                                            }
                                                            draggableId={
                                                                item._id
                                                            }
                                                            index={
                                                                index
                                                            }
                                                        >

                                                            {(
                                                                provided
                                                            ) => (

                                                                <div
                                                                    className="milestone-card"
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >

                                                                    <h3>
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </h3>


                                                                    <p>
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </p>


                                                                    <p>
                                                                        <strong>
                                                                            Client:
                                                                        </strong>{" "}
                                                                        {
                                                                            item.clientId
                                                                                ?.name
                                                                        }
                                                                    </p>


                                                                    {item.dueDate && (

                                                                        <p>
                                                                            <strong>
                                                                                Due:
                                                                            </strong>{" "}
                                                                            {new Date(
                                                                                item.dueDate
                                                                            ).toLocaleDateString()}
                                                                        </p>

                                                                    )}


                                                                    <div className="milestone-status">

                                                                        Status:{" "}

                                                                        <span>
                                                                            {item.status ||
                                                                                (item.isCompleted
                                                                                    ? "Completed"
                                                                                    : "Pending")}
                                                                        </span>

                                                                    </div>



                                                                </div>

                                                            )}

                                                        </Draggable>

                                                    )
                                                )

                                            )}

                                            {
                                                provided.placeholder
                                            }

                                        </div>

                                    </div>

                                )}

                            </Droppable>

                        );

                    })}

                </div>

            </DragDropContext>

        </div>
    );
}

export default AdminProjectMilestones;