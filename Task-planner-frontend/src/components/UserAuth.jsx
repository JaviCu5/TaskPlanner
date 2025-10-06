import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserAuth() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [registerData, setRegisterData] = useState({
    name: '', surname: '', userId: '', email: '', password: ''
  });
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('login');
  const [message, setMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      setMessage('✅ Login successful! Redirecting...');
      setLoginData({ email: '', password: '' });
      // Automatic redirect happens because isAuthenticated changes
    } else {
      setMessage(`❌ ${result.error}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const result = await register(registerData);
    if (result.success) {
      setMessage('✅ Registration successful! Please log in.');
      setRegisterData({ name: '', surname: '', userId: '', email: '', password: '' });
      setActiveTab('login');
    } else {
      setMessage(`❌ ${result.error}`);
    }
  };

  // If authenticated, this component won't render due to useEffect redirect
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-primary">📝 Task Planner</h1>
            <p className="lead">Please log in to access your tasks</p>
          </div>

          {/* Rest of your UserAuth component remains the same */}
          {message && (
            <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mb-4`}>
              {message}
            </div>
          )}

          {/* Tab Navigation */}
          <ul className="nav nav-pills nav-justified mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                🔑 Login
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                👤 Register
              </button>
            </li>
          </ul>

          {/* Forms remain the same as before */}
          {activeTab === 'login' && (
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Welcome Back</h4>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="card">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Create Account</h4>
                <form onSubmit={handleRegister}>
                  {/* Registration form fields remain the same */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Surname</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        value={registerData.surname}
                        onChange={(e) => setRegisterData({...registerData, surname: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">User ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Choose a user ID"
                      value={registerData.userId}
                      onChange={(e) => setRegisterData({...registerData, userId: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Choose a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-success w-100">
                    Create Account
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAuth;