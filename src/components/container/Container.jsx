import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function Container() {
  // Load tasks from localStorage when component mounts
  const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [task, setTask] = useState({ name: "", description: "", status: "" });
  const [editIndex, setEditIndex] = useState(null);

  // Save task list to localStorage whenever taskList changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  useEffect(()=>{
    console.log(taskList ,"tajfks");
    
  },[taskList])

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (newStatus) => {
    setTask((prevTask) => ({ ...prevTask, status: newStatus }));
    document.getElementById("statusDropdown")?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.name || !task.description || !task.status) return;

    if (editIndex !== null) {
      const updatedTasks = [...taskList];
      updatedTasks[editIndex] = task;
      setTaskList(updatedTasks);
      setEditIndex(null);
    } else {
      setTaskList([...taskList, task]);
    }
    setTask({ name: "", description: "", status: "" });
  };

  const handleDelete = (index) => {
    setTaskList(taskList.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setTask(taskList[index]);
    setEditIndex(index);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "start": return "bg-danger";
      case "inprogress": return "bg-warning";
      case "completed": return "bg-success";
      default: return "bg-secondary";
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...taskList];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTaskList(items);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center " style={{overflowY:"auto"}}>
      <div className="card p-4 shadow-lg" style={{ width: "500px" }}>
        <h2 className="text-center mb-3">Task Management App</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Task Name:</label>
            <input type="text" name="name" value={task.name} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea name="description" value={task.description} onChange={handleChange} className="form-control" required></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label d-block">Status:</label>
            <div className="dropdown w-100">
              <button id="statusDropdown" type="button" className={`btn w-100 dropdown-toggle ${getStatusClass(task.status)}`} data-bs-toggle="dropdown">
                {task.status ? (task.status === "start" ? "Start" : task.status === "inprogress" ? "In Progress" : "Completed") : "Select your status"}
              </button>
              <ul className="dropdown-menu w-100">
                <li><button className="dropdown-item text-danger" type="button" onClick={() => handleStatusChange("start")}>Start</button></li>
                <li><button className="dropdown-item text-warning" type="button" onClick={() => handleStatusChange("inprogress")}>In Progress</button></li>
                <li><button className="dropdown-item text-success" type="button" onClick={() => handleStatusChange("completed")}>Completed</button></li>
              </ul>
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100">{editIndex !== null ? "Update Task" : "Add Task"}</button>
        </form>
        <h3 className="text-center mt-4">Task List</h3>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="taskList">
            {(provided) => (
              <ul className="list-group mt-2" {...provided.droppableProps} ref={provided.innerRef}>
                {taskList.map((t, index) => (
                  <Draggable key={index} draggableId={index.toString()} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{t.name}</strong>
                          <p className="mb-1">{t.description}</p>
                          <span className={`badge ${getStatusClass(t.status)}`}>{t.status}</span>
                        </div>
                        <div>
                          <button onClick={() => handleEdit(index)} className="btn btn-sm btn-outline-primary me-2"><i className="bi bi-pencil-square"></i></button>
                          <button onClick={() => handleDelete(index)} className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Container;




// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";

// function Container() {
//   // Load tasks from localStorage when component mounts
//   const [taskList, setTaskList] = useState(() => {
//     const savedTasks = localStorage.getItem("tasks");
//     return savedTasks ? JSON.parse(savedTasks) : [];
//   });

//   const [task, setTask] = useState({
//     name: "",
//     description: "",
//     status: "",
//   });

//   const [editIndex, setEditIndex] = useState(null); // Track editing task index

//   // Save task list to localStorage whenever taskList changes
//   useEffect(() => {
//     localStorage.setItem("tasks", JSON.stringify(taskList));
//   }, [taskList]);

//   const handleChange = (e) => {
//     setTask({ ...task, [e.target.name]: e.target.value });
//   };

//   const handleStatusChange = (newStatus) => {
//     setTask((prevTask) => ({ ...prevTask, status: newStatus }));

//     // Automatically close dropdown after selection
//     const dropdown = document.getElementById("statusDropdown");
//     if (dropdown) {
//       dropdown.click();
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!task.name || !task.description || !task.status) return;

//     if (editIndex !== null) {
//       // Update existing task
//       const updatedTasks = [...taskList];
//       updatedTasks[editIndex] = task;
//       setTaskList(updatedTasks);
//       setEditIndex(null);
//     } else {
//       // Add new task
//       setTaskList([...taskList, task]);
//     }

//     setTask({ name: "", description: "", status: "" }); // Clear form
//   };

//   const handleDelete = (index) => {
//     const updatedTasks = taskList.filter((_, i) => i !== index);
//     setTaskList(updatedTasks);
//   };

//   const handleEdit = (index) => {
//     setTask(taskList[index]);
//     setEditIndex(index);
//   };

//   // Function to get Bootstrap color class based on status
//   const getStatusClass = (status) => {
//     switch (status) {
//       case "start":
//         return "bg-danger"; // Red
//       case "inprogress":
//         return "bg-warning"; // Yellow
//       case "completed":
//         return "bg-success"; // Green
//       default:
//         return "bg-secondary"; // Default (gray)
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100">
//       <div className="card p-4 shadow-lg" style={{ width: "500px" }}>
//         <h2 className="text-center mb-3">Task Management App</h2>

//         {/* Task Form */}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Task Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={task.name}
//               onChange={handleChange}
//               className="form-control"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Description:</label>
//             <textarea
//               name="description"
//               value={task.description}
//               onChange={handleChange}
//               className="form-control"
//               required
//             ></textarea>
//           </div>

//           {/* Bootstrap Dropdown for Status Selection */}
//           <div className="mb-3">
//             <label className="form-label d-block">Status:</label>
//             <div className="dropdown w-100">
//               <button
//                 id="statusDropdown"
//                 type="button"
//                 className={`btn w-100 dropdown-toggle ${getStatusClass(task.status)}`}
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 {task.status
//                   ? task.status === "start"
//                     ? "Start"
//                     : task.status === "inprogress"
//                     ? "In Progress"
//                     : "Completed"
//                   : "Select your status"}
//               </button>
//               <ul className="dropdown-menu w-100">
//                 <li>
//                   <button
//                     className="dropdown-item text-danger"
//                     type="button"
//                     onClick={() => handleStatusChange("start")}
//                   >
//                     Start
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className="dropdown-item text-warning"
//                     type="button"
//                     onClick={() => handleStatusChange("inprogress")}
//                   >
//                     In Progress
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     className="dropdown-item text-success"
//                     type="button"
//                     onClick={() => handleStatusChange("completed")}
//                   >
//                     Completed
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <button type="submit" className="btn btn-success w-100">
//             {editIndex !== null ? "Update Task" : "Add Task"}
//           </button>
//         </form>

//         {/* Task List */}
//         <h3 className="text-center mt-4">Task List</h3>
//         <ul className="list-group mt-2">
//           {taskList.map((t, index) => (
//             <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
//               <div>
//                 <strong>{t.name}</strong>
//                 <p className="mb-1">{t.description}</p>
//                 <span className={`badge ${getStatusClass(t.status)}`}>
//                   {t.status}
//                 </span>
//               </div>

//               <div>
//                 {/* Edit Button */}
//                 <button onClick={() => handleEdit(index)} className="btn btn-sm btn-outline-primary me-2">
//                   <i className="bi bi-pencil-square"></i> {/* Edit Icon */}
//                 </button>
//                 <button onClick={() => handleDelete(index)} className="btn btn-sm btn-outline-danger">
//                   <i className="bi bi-trash"></i> {/* Delete Icon */}
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Container;
