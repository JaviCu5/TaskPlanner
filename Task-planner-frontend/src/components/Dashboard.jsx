import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks function
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white py-3 shadow">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h4 mb-0">📝 Task Planner</h1>
              <small>Welcome back, {user.name}!</small>
            </div>
            <button 
              onClick={logout}
              className="btn btn-outline-light btn-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mt-4">
        {/* Pass loadTasks to TaskForm so it can refresh the task list after creation */}
        <TaskForm onTaskCreated={loadTasks} />
        
        {/* Show loading spinner or task list */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading tasks...</span>
            </div>
            <p className="mt-2">Loading your tasks...</p>
          </div>
        ) : (
          // Pass tasks and loadTasks to TaskList
          <TaskList tasks={tasks} onTaskUpdated={loadTasks} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;