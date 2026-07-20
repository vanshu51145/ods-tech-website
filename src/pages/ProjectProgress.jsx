import { useEffect, useState } from "react";
import "./ProjectProgress.css";

function ProjectProgress() {

    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchMilestones = async () => {

            try {

                const token =
                    localStorage.getItem("clientToken");


                const res = await fetch(
                    "https://ods-network-backend.onrender.com/api/client/milestones",
                    {
                        headers: {
                            Authorization: `Bearer ${clientToken}`
                        }
                    }
                );


                const data = await res.json();


                if (data.success) {

                    setMilestones(data.milestones);

                }


            }
            catch (error) {

                console.log(error);

            }
            finally {

                setLoading(false);

            }

        };


        fetchMilestones();


    }, []);



    return (


        <div className="progress-page">

            <h1>
                Project Progress
            </h1>


            <div className="timeline">

                {
                    loading ? (

                        <h3>
                            Loading milestones...
                        </h3>

                    ) : milestones.length === 0 ? (

                        <h3>
                            No milestones available yet
                        </h3>

                    ) : (

                        milestones.map((item) => (
                            <div
                                className={`timeline-item ${item.isCompleted
                                    ? "completed"
                                    : "pending"
                                    }`}
                                key={item._id}
                            >


                                <div className="circle">

                                    {
                                        item.isCompleted
                                            ? "✓"
                                            : ""
                                    }

                                </div>


                                <div className="content">

                                    <h3>
                                        {item.title}
                                    </h3>


                                    <p>
                                        {item.description}
                                    </p>


                                    <span>
                                        Due Date:
                                        {" "}
                                        {
                                            item.dueDate
                                                ?
                                                new Date(item.dueDate).toDateString()
                                                :
                                                "Not Assigned"
                                        }
                                    </span>


                                </div>


                            </div>
                        ))
                    )
                }


            </div>


        </div>


    );


}


export default ProjectProgress;