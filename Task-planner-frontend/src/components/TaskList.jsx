import React from 'react';
import axios from 'axios';

function TaskList({ tasks = [], onTaskUpdated = () => {} }) {
  // Add safety check for undefined tasks
  if (!tasks) {
    return (
      <div className="alert alert-warning">
        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
        Loading tasks...
      </div>
    );
  }

  // Now safely check length
  if (tasks.length === 0) {
    return (
      <div className="alert alert-info">
        No tasks found. Create your first task above!
      </div>
    );
  }

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
        onTaskUpdated(); // Refresh the task list
        alert('Task deleted successfully!');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task');
      }
    }
  };

  const toggleTaskCompletion = async (task) => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
        ...task,
        isCompleted: !task.isCompleted
      });
      onTaskUpdated(); // Refresh the task list
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div>
      <h3>Your Tasks ({tasks.length})</h3>
      <div className="row">
        {tasks.map(task => (
          <div key={task.id} className="col-md-6 col-lg-4 mb-3">
            <div className={`card ${task.isCompleted ? 'border-success' : 'border-warning'}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="card-title">{task.title}</h5>
                  <span className={`badge ${task.isCompleted ? 'bg-success' : 'bg-warning'}`}>
                    {task.isCompleted ? '✅ Done' : '⏳ Pending'}
                  </span>
                </div>
                
                <p className="card-text">{task.description}</p>
                
                {task.dueDate && (
                  <p className="card-text">
                    <small className="text-muted">
                      Due: {new Date(task.dueDate).toLocaleString()}
                    </small>
                  </p>
                )}
                
                <div className="d-flex gap-2">
                  <button 
                    className={`btn btn-sm ${task.isCompleted ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => toggleTaskCompletion(task)}
                  >
                    {task.isCompleted ? 'Mark Pending' : 'Mark Done'}
                  </button>
                  
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;