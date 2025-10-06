import React, { useState } from "react";
import axios from "axios";

function TaskForm({ onTaskCreated }) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    isCompleted: false,
    dueDate: "",
  });

  // Add loading state
  const [creating, setCreating] = useState(false);
  
  // Add message state for success/error feedback
  const [message, setMessage] = useState(null);

  const createTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null); // Clear previous messages

    try {
      console.log("📤 Creating task:", newTask);

      const response = await axios.post(
        "http://localhost:8080/api/tasks",
        newTask
      );

      // ✅ SUCCESS: Clear form and show success message
      setNewTask({
        title: "",
        description: "",
        isCompleted: false,
        dueDate: "",
      });
      
      // Call the callback to refresh the task list
      onTaskCreated();

      // Show success message
      setMessage({ type: "success", text: "Task created successfully!" });
      
    } catch (error) {
      console.error("❌ Error creating task:", error);

      // ❌ ERROR: Keep form data and show specific error
      const errorMessage =
        error.response?.data || error.message || "Unknown error";
      setMessage({
        type: "error",
        text: `Failed to create task: ${errorMessage}`,
      });

      // Form data remains intact so user can fix issues
    } finally {
      setCreating(false); // Reset loading state
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">➕ Add New Task</h5>
        
        {/* Success/Error Messages */}
        {message && (
          <div 
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            } mb-3`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={createTask}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Enter task description"
              rows="3"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Due Date</label>
            <input
              type="datetime-local"
              className="form-control"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={newTask.isCompleted}
              onChange={(e) =>
                setNewTask({ ...newTask, isCompleted: e.target.checked })
              }
            />
            <label className="form-check-label">Completed</label>
          </div>

          {/* ✅ FIXED: Button with loading state INSIDE the return */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={creating} // Disable while creating
          >
            {creating ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;