import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AdminProjectMilestones() {

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");

  const [milestone, setMilestone] = useState({
    title: "",
    description: "",
    dueDate: ""
  });

  const [milestones, setMilestones] = useState([]);


  const token = localStorage.getItem("token");

  const API =
    "https://ods-network-backend.onrender.com";


  // Fetch Clients
  const getClients = async () => {

    try {

      const res = await fetch(
        `${API}/api/clients`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      const data = await res.json();

      setClients(data.clients || []);

    } catch(error){

      console.log(error);

    }

  };



  // Fetch Milestones
  const getMilestones = async () => {

    try {

      const res = await fetch(
        `${API}/api/milestones`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      const data = await res.json();

      setMilestones(data.milestones || []);


    } catch(error){

      console.log(error);

    }

  };



  useEffect(()=>{

    getClients();
    getMilestones();

  },[]);



  // Create Milestone
  const createMilestone = async(e)=>{

    e.preventDefault();


    if(!clientId || !milestone.title){

      toast.error(
        "Client and title are required"
      );

      return;

    }


    try{


      const res = await fetch(
        `${API}/api/milestones`,
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json",

            Authorization:
            `Bearer ${token}`
          },

          body:JSON.stringify({

            clientId,

            ...milestone

          })

        }
      );


      const data = await res.json();


      if(data.success){

        toast.success(
          "Milestone Created"
        );


        setClientId("");

        setMilestone({

          title:"",
          description:"",
          dueDate:""

        });


        getMilestones();


      }
      else{

        toast.error(data.message);

      }



    }
    catch(error){

      console.log(error);

      toast.error(
        "Something went wrong"
      );

    }


  };



  // Mark Completed
  const updateStatus = async(id)=>{


    try{


      const res = await fetch(
        `${API}/api/milestones/${id}`,
        {

          method:"PUT",

          headers:{

            "Content-Type":"application/json",

            Authorization:
            `Bearer ${token}`

          },


          body:JSON.stringify({

            isCompleted:true

          })

        }
      );


      const data = await res.json();


      if(data.success){

        toast.success(
          "Milestone Completed"
        );

        getMilestones();

      }


    }
    catch(error){

      console.log(error);

    }


  };



return (

<div className="page">


<h1>
Project Milestones
</h1>



{/* Create Milestone Form */}

<form
onSubmit={createMilestone}
className="milestone-form"
>


<select

value={clientId}

onChange={(e)=>
setClientId(e.target.value)
}

>


<option value="">
Select Client
</option>


{
clients.map(client=>(

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

type="text"

placeholder="Milestone Title"

value={milestone.title}

onChange={(e)=>

setMilestone({

...milestone,

title:e.target.value

})

}

/>



<textarea

placeholder="Description"

value={milestone.description}

onChange={(e)=>

setMilestone({

...milestone,

description:e.target.value

})

}

/>



<input

type="date"

value={milestone.dueDate}

onChange={(e)=>

setMilestone({

...milestone,

dueDate:e.target.value

})

}

/>



<button type="submit">

Create Milestone

</button>


</form>





{/* Existing Milestones */}


<h2>
Existing Milestones
</h2>



<div className="milestone-list">


{

milestones.map(item=>(


<div

key={item._id}

className="milestone-card"

>


<h3>
{item.title}
</h3>


<p>
{item.description}
</p>



<p>
Client:
{" "}
{item.clientId?.name}
</p>



<p>
Due:
{" "}
{
item.dueDate
?
new Date(item.dueDate)
.toLocaleDateString()
:
"N/A"
}
</p>



<p>

Status:

{" "}

{

item.isCompleted

?

"Completed"

:

"Pending"

}

</p>



<input

type="checkbox"

checked={item.isCompleted}

onChange={()=>
updateStatus(item._id)
}

disabled={item.isCompleted}

/>


<span>
Mark Completed
</span>



</div>


))

}


</div>


</div>

);


}


export default AdminProjectMilestones;