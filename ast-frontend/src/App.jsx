import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

// Styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    padding: 20px;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Auth Styles */
  .auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .auth-card {
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 400px;
  }

  .auth-card h2 {
    color: #333;
    margin-bottom: 10px;
    font-size: 28px;
  }

  .auth-card p {
    color: #666;
    margin-bottom: 30px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
    font-size: 14px;
  }

  .form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
  }

  .form-group input:focus {
    outline: none;
    border-color: #667eea;
  }

  .btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    margin-top: 10px;
  }

  .btn-secondary:hover {
    background: #667eea;
    color: white;
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .success-message {
    background: #efe;
    color: #3c3;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  /* Dashboard Styles */
  .dashboard {
    animation: fadeIn 0.5s;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .header {
    background: white;
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header h1 {
    color: #333;
    font-size: 32px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .user-email {
    color: #666;
    font-size: 14px;
  }

  .btn-logout {
    padding: 10px 24px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
  }

  .btn-logout:hover {
    background: #d32f2f;
    transform: translateY(-2px);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .stat-label {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .stat-value {
    color: #333;
    font-size: 32px;
    font-weight: 700;
  }

  .content-section {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .section-header h2 {
    color: #333;
    font-size: 24px;
  }

  .btn-add {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
  }

  .btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .filters {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 8px 16px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
  }

  .filter-btn:hover {
    border-color: #667eea;
    color: #667eea;
  }

  .filter-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
  }

  .applications-grid {
    display: grid;
    gap: 20px;
  }

  .application-card {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s;
    cursor: pointer;
  }

  .application-card:hover {
    border-color: #667eea;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 16px;
  }

  .app-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 4px;
  }

  .app-company {
    color: #666;
    font-size: 16px;
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .status-applied {
    background: #e3f2fd;
    color: #1976d2;
  }

  .status-interviewing {
    background: #fff3e0;
    color: #f57c00;
  }

  .status-rejected {
    background: #ffebee;
    color: #c62828;
  }

  .app-date {
    color: #999;
    font-size: 14px;
    margin-top: 12px;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s;
  }

  .modal {
    background: white;
    border-radius: 16px;
    padding: 32px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s;
  }

  @keyframes slideUp {
    from { transform: translateY(40px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal h2 {
    color: #333;
    margin-bottom: 24px;
    font-size: 24px;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  .btn-cancel {
    flex: 1;
    padding: 12px;
    background: #e0e0e0;
    color: #333;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
  }

  .btn-cancel:hover {
    background: #d0d0d0;
  }

  .btn-submit {
    flex: 1;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
  }

  .btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .rounds-list {
    margin-top: 24px;
  }

  .round-item {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }

  .round-header {
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
    font-size: 16px;
  }

  .round-notes {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
  }

  .round-notes p {
    margin-bottom: 8px;
  }

  .round-notes strong {
    color: #333;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #999;
  }

  .empty-state-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  .empty-state h3 {
    color: #666;
    font-size: 20px;
    margin-bottom: 8px;
  }

  select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
    background: white;
  }

  select:focus {
    outline: none;
    border-color: #667eea;
  }

  textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
  }

  textarea:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    company: '',
    status: 'applied',
    date: new Date().toISOString().split('T')[0],
    number: 1,
    prepare: '',
    reflect: ''
  });

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const res = await fetch(`${API_BASE}/applications/all`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Applications data:', data); // Debug log
        // Handle both single application and array of applications
        if (data.applications) {
          const apps = Array.isArray(data.applications) 
            ? data.applications 
            : [data.applications];
          setApplications(apps);
        } else {
          setApplications([]);
        }
      }
    } catch (err) {
      console.error('Error loading applications:', err);
      setApplications([]);
    }
  };

  const handleAuth = async (type) => {
    setError('');
    setSuccess('');
    
    try {
      const endpoint = type === 'login' ? '/users/login' : '/users/create';
      const body = type === 'login' 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        if (type === 'login') {
          setUser(data.user);
          setSuccess('Logged in successfully!');
        } else {
          setSuccess('Account created! Please login.');
          setView('login');
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setApplications([]);
    setView('login');
  };

  const openModal = (type, app = null) => {
    setModalType(type);
    setSelectedApp(app);
    if (app && type === 'rounds') {
      loadRounds(app.id);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedApp(null);
    setRounds([]);
    setFormData(prev => ({
      ...prev,
      title: '',
      company: '',
      status: 'applied',
      date: new Date().toISOString().split('T')[0],
      number: 1,
      prepare: '',
      reflect: ''
    }));
  };

  const loadRounds = async (appId) => {
    try {
      const res = await fetch(`${API_BASE}/rounds/${appId}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setRounds(data.rounds.rows || []);
      }
    } catch (err) {
      console.error('Error loading rounds:', err);
    }
  };

  const handleCreateApplication = async () => {
    try {
      const res = await fetch(`${API_BASE}/applications/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          company: formData.company,
          status: formData.status,
          date: formData.date
        })
      });

      if (res.ok) {
        setSuccess('Application created!');
        await loadApplications(); // Ensure we wait for reload
        setTimeout(() => setSuccess(''), 3000); // Clear success message
        closeModal();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create application');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleCreateRound = async () => {
    try {
      const res = await fetch(`${API_BASE}/rounds/${selectedApp.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          number: parseInt(formData.number),
          prepare: formData.prepare,
          reflect: formData.reflect
        })
      });

      if (res.ok) {
        setSuccess('Round added!');
        loadRounds(selectedApp.id);
        setFormData(prev => ({ ...prev, number: prev.number + 1, prepare: '', reflect: '' }));
      } else {
        setError('Failed to create round');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interviewing: applications.filter(a => a.status === 'interviewing').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  if (!user) {
    if (loading) {
      return (
        <>
          <style>{styles}</style>
          <div className="app">
            <div className="auth-container">
              <div className="auth-card">
                <h2>Loading...</h2>
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <style>{styles}</style>
        <div className="app">
          <div className="auth-container">
            <div className="auth-card">
              <h2>{view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{view === 'login' ? 'Sign in to track your applications' : 'Start tracking your job search'}</p>
              
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              {view === 'signup' && (
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => handleAuth(view === 'login' ? 'login' : 'signup')}
              >
                {view === 'login' ? 'Sign In' : 'Create Account'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              >
                {view === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="container dashboard">
          <div className="header">
            <h1>📊 Job Tracker</h1>
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Applications</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Applied</div>
              <div className="stat-value">{stats.applied}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Interviewing</div>
              <div className="stat-value">{stats.interviewing}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Rejected</div>
              <div className="stat-value">{stats.rejected}</div>
            </div>
          </div>

          <div className="content-section">
            <div className="section-header">
              <h2>Applications</h2>
              <button className="btn-add" onClick={() => openModal('create')}>
                + Add Application
              </button>
            </div>

            <div className="filters">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'applied' ? 'active' : ''}`}
                onClick={() => setFilter('applied')}
              >
                Applied
              </button>
              <button 
                className={`filter-btn ${filter === 'interviewing' ? 'active' : ''}`}
                onClick={() => setFilter('interviewing')}
              >
                Interviewing
              </button>
              <button 
                className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                Rejected
              </button>
            </div>

            {filteredApps.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <h3>No applications yet</h3>
                <p>Start tracking your job search by adding your first application</p>
              </div>
            ) : (
              <div className="applications-grid">
                {filteredApps.map((app) => (
                  <div 
                    key={app.id} 
                    className="application-card"
                    onClick={() => openModal('rounds', app)}
                  >
                    <div className="app-header">
                      <div>
                        <div className="app-title">{app.job_title || app.title}</div>
                        <div className="app-company">{app.company}</div>
                      </div>
                      <span className={`status-badge status-${app.status}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="app-date">
                      Applied: {new Date(app.application_date || app.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              {modalType === 'create' && (
                <>
                  <h2>Add New Application</h2>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      placeholder="Google"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Application Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                    <button className="btn-submit" onClick={handleCreateApplication}>
                      Create Application
                    </button>
                  </div>
                </>
              )}

              {modalType === 'rounds' && selectedApp && (
                <>
                  <h2>{selectedApp.job_title || selectedApp.title} - Interview Rounds</h2>
                  
                  <div className="form-group">
                    <label>Round Number</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preparation Notes</label>
                    <textarea
                      value={formData.prepare}
                      onChange={(e) => setFormData({...formData, prepare: e.target.value})}
                      placeholder="What do I need to prepare?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Reflection Notes</label>
                    <textarea
                      value={formData.reflect}
                      onChange={(e) => setFormData({...formData, reflect: e.target.value})}
                      placeholder="How did it go?"
                    />
                  </div>
                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={closeModal}>Close</button>
                    <button className="btn-submit" onClick={handleCreateRound}>
                      Add Round
                    </button>
                  </div>

                  {rounds.length > 0 && (
                    <div className="rounds-list">
                      <h3>Previous Rounds</h3>
                      {rounds.map((round) => (
                        <div key={round.id} className="round-item">
                          <div className="round-header">Round {round.interview_number}</div>
                          <div className="round-notes">
                            {round.prepare_note && (
                              <p><strong>Preparation:</strong> {round.prepare_note}</p>
                            )}
                            {round.reflection_note && (
                              <p><strong>Reflection:</strong> {round.reflection_note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;