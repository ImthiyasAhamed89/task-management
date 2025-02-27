import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function Container() {
  const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [task, setTask] = useState({ name: "", description: "", status: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

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
    <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "500px", background: "linear-gradient(135deg, #74ebd5, #acb6e5)", color: "#ffffff" }}>
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
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center text-break">
                        <div className="w-100">
                          <strong>{t.name}</strong>
                          <p className="mb-1">{t.description}</p>
                          <span className={`badge ${getStatusClass(t.status)}`}>{t.status}</span>
                        </div>
                        <div className="mt-2 mt-md-0 d-flex">
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
