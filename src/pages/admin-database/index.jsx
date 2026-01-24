import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

/**
 * Admin Database - Exclusive Admin Access Page
 * 
 * IMPORTANT: This page should ONLY be accessible with admin credentials
 * Non-admin users should be redirected away immediately
 */
const AdminDatabase = () => {
  const navigate = useNavigate();
  
  // Check if user is admin - redirect if not
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      // No user logged in - redirect to login
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        // Not admin - redirect to main dashboard
        navigate('/main-dashboard');
        return;
      }
    } catch (e) {
      // Invalid user data - redirect to login
      navigate('/login');
      return;
    }
  }, [navigate]);
  // State management for users and UI
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdminSettingsModal, setShowAdminSettingsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  // Admin credentials state
  const [adminCredentials, setAdminCredentials] = useState({
    email: 'alvinaaqdas@gmail.com',
    password: '2512082004'
  });

  // Form states
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'viewer',
    department: '',
    phone: '',
    status: 'active'
  });

  const [editUser, setEditUser] = useState({
    email: '',
    name: '',
    role: 'viewer',
    department: '',
    phone: '',
    status: 'active'
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
    email: ''
  });

  // Mock users data - in production this would come from backend API
  const mockUsers = [
    {
      id: 1,
      email: 'alvinaaqdas@gmail.com',
      name: 'Alvina Aqdas',
      role: 'admin',
      department: 'System Administration',
      phone: '+91-9876543210',
      status: 'active',
      lastLogin: '2024-12-29 19:16:00',
      createdAt: '2024-01-15 09:00:00',
      loginCount: 1247,
      permissions: ['full_access', 'user_management', 'system_config']
    },
    {
      id: 2,
      email: 'researcher@crimepredictpro.edu',
      name: 'Dr. Sarah Johnson',
      role: 'researcher',
      department: 'Data Science',
      phone: '+91-9876543211',
      status: 'active',
      lastLogin: '2024-12-29 14:30:00',
      createdAt: '2024-02-20 10:15:00',
      loginCount: 892,
      permissions: ['data_analysis', 'model_training', 'report_generation']
    },
    {
      id: 3,
      email: 'viewer@crimepredictpro.edu',
      name: 'John Smith',
      role: 'viewer',
      department: 'Operations',
      phone: '+91-9876543212',
      status: 'active',
      lastLogin: '2024-12-29 11:20:00',
      createdAt: '2024-03-10 14:30:00',
      loginCount: 456,
      permissions: ['view_reports', 'view_dashboard']
    },
    {
      id: 4,
      email: 'analyst1@crimepredictpro.edu',
      name: 'Priya Sharma',
      role: 'researcher',
      department: 'Crime Analysis',
      phone: '+91-9876543213',
      status: 'active',
      lastLogin: '2024-12-29 09:15:00',
      createdAt: '2024-04-05 16:45:00',
      loginCount: 623,
      permissions: ['data_analysis', 'view_reports']
    },
    {
      id: 5,
      email: 'suspended@crimepredictpro.edu',
      name: 'James Wilson',
      role: 'viewer',
      department: 'External Agency',
      phone: '+91-9876543214',
      status: 'suspended',
      lastLogin: '2024-12-15 10:30:00',
      createdAt: '2024-05-12 11:20:00',
      loginCount: 78,
      permissions: ['view_reports']
    }
  ];

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // 1. Get manually registered users from localStorage
      const registeredUsersRaw = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // 2. Transform them to match the table structure
      const formattedRegisteredUsers = registeredUsersRaw.map((u, index) => ({
        id: mockUsers.length + index + 1,
        email: u.email,
        name: `${u.firstName} ${u.lastName}`.trim(),
        role: u.role,
        department: u.institution || 'N/A',
        phone: u.phone || 'N/A',
        status: u.status || 'active',
        lastLogin: null, // New users haven't logged in yet usually, or we don't track it in this object
        createdAt: u.createdAt ? u.createdAt.replace('T', ' ').substring(0, 19) : new Date().toISOString().replace('T', ' ').substring(0, 19),
        loginCount: 0,
        permissions: roleConfig[u.role] ? roleConfig[u.role].permissions : []
      }));

      // 3. Merge with mock users
      // Filter out any mock users that might conflict with registered emails (optional, but safer)
      const uniqueMockUsers = mockUsers.filter(m => !formattedRegisteredUsers.some(r => r.email === m.email));
      
      setUsers([...uniqueMockUsers, ...formattedRegisteredUsers]);
      setLoading(false);
    }, 1000);
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Role configuration
  const roleConfig = {
    admin: { label: 'Administrator', color: 'bg-red-100 text-red-800', permissions: 'Full system access' },
    researcher: { label: 'Researcher', color: 'bg-blue-100 text-blue-800', permissions: 'Data analysis & modeling' },
    viewer: { label: 'Viewer', color: 'bg-green-100 text-green-800', permissions: 'Read-only access' }
  };

  // Add new user
  const handleAddUser = () => {
    // Validate form
    if (!newUser.email || !newUser.name || !newUser.role) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      alert('User with this email already exists');
      return;
    }

    // Create new user
    const newUserData = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...newUser,
      lastLogin: null,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      loginCount: 0,
      permissions: roleConfig[newUser.role].permissions
    };

    setUsers([...users, newUserData]);
    setShowAddUserModal(false);
    setNewUser({
      email: '',
      name: '',
      role: 'viewer',
      department: '',
      phone: '',
      status: 'active'
    });
  };

  // Edit user
  const handleEditUser = () => {
    if (!editUser.email || !editUser.name || !editUser.role) {
      alert('Please fill in all required fields');
      return;
    }

    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...editUser, permissions: roleConfig[editUser.role].permissions }
        : user
    ));
    setShowEditUserModal(false);
    setSelectedUser(null);
  };

  // Change password
  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // In production, this would update the backend
    console.log(`Password changed for user: ${passwordForm.email}`);
    alert(`Password successfully changed for ${passwordForm.email}`);
    setShowPasswordModal(false);
    setPasswordForm({ newPassword: '', confirmPassword: '', email: '' });
  };

  // Delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Toggle user status
  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  // Update admin credentials
  const handleUpdateAdminCredentials = () => {
    // Validate inputs
    if (!adminCredentials.email || !adminCredentials.password) {
      alert('Please fill in both email and password');
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminCredentials.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Password validation
    if (adminCredentials.password.length < 4) {
      alert('Password must be at least 4 characters long');
      return;
    }

    // Update the first admin user in the list
    setUsers(users.map(user => 
      user.id === 1 
        ? { ...user, email: adminCredentials.email, lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19) }
        : user
    ));

    // Store in localStorage for persistence (in production, this would be backend API)
    localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
    
    setShowAdminSettingsModal(false);
    alert('Admin credentials updated successfully! You will need to login again with the new credentials.');
  };

  // Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditUser({
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      phone: user.phone,
      status: user.status
    });
    setShowEditUserModal(true);
  };

  // Open password modal
  const openPasswordModal = (user) => {
    setPasswordForm({ ...passwordForm, email: user.email });
    setShowPasswordModal(true);
  };

  // Get user statistics
  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const suspended = users.filter(u => u.status === 'suspended').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const researchers = users.filter(u => u.role === 'researcher').length;
    const viewers = users.filter(u => u.role === 'viewer').length;

    return { total, active, suspended, admins, researchers, viewers };
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/main-dashboard" className="text-muted-foreground hover:text-foreground">
                <Icon name="ArrowLeft" size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Database</h1>
                <p className="text-sm text-muted-foreground">User Management & System Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setShowAdminSettingsModal(true)}>
                <Icon name="Settings" size={16} className="mr-2" />
                Admin Settings
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/main-dashboard'}>
                <Icon name="BarChart3" size={16} className="mr-2" />
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={loadUsers}>
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Refresh
              </Button>
              <Button variant="default" onClick={() => setShowAddUserModal(true)}>
                <Icon name="UserPlus" size={16} className="mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={20} color="#3B82F6" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="UserCheck" size={20} color="#10B981" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Icon name="UserX" size={20} color="#EF4444" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administrators</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} color="#8B5CF6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg border border-border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="researcher">Researchers</option>
                <option value="viewer">Viewers</option>
              </select>
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedRole('all'); }}>
                <Icon name="X" size={16} className="mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Login</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary font-medium">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleConfig[user.role].color}`}>
                          {roleConfig[user.role].label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{user.department}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {user.lastLogin || 'Never'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(user)}
                            title="Edit User"
                          >
                            <Icon name="Edit" size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openPasswordModal(user)}
                            title="Change Password"
                          >
                            <Icon name="Key" size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleUserStatus(user.id)}
                            title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                          >
                            <Icon name={user.status === 'active' ? 'UserX' : 'UserCheck'} size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                            className="text-destructive hover:text-destructive"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddUserModal(false)}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="viewer">Viewer</option>
                  <option value="researcher">Researcher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="IT Department"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+91-9876543210"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddUserModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="default" onClick={handleAddUser} className="flex-1">
                <Icon name="UserPlus" size={14} className="mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowEditUserModal(false)}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="viewer">Viewer</option>
                  <option value="researcher">Researcher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={editUser.department}
                  onChange={(e) => setEditUser({ ...editUser, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editUser.phone}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editUser.status}
                  onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowEditUserModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="default" onClick={handleEditUser} className="flex-1">
                <Icon name="Save" size={14} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowPasswordModal(false)}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Change password for: <strong>{passwordForm.email}</strong></p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="default" onClick={handleChangePassword} className="flex-1">
                <Icon name="Key" size={14} className="mr-2" />
                Change Password
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Settings Modal */}
      {showAdminSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Admin Settings</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAdminSettingsModal(false)}>
                <Icon name="X" size={16} />
              </Button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Update the administrator login credentials. These changes will affect the admin login for the entire system.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email *</label>
                <input
                  type="email"
                  value={adminCredentials.email}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="admin@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">This email will be used for admin login</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password *</label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter new admin password"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 4 characters required</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} color="#F59E0B" className="mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Important Notice</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      After updating credentials, you will need to logout and login again with the new email and password.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAdminSettingsModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="default" onClick={handleUpdateAdminCredentials} className="flex-1">
                <Icon name="Save" size={14} className="mr-2" />
                Update Credentials
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDatabase;
