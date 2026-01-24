import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse, className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isJobsExpanded, setIsJobsExpanded] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAdminPasswordConfirm, setShowAdminPasswordConfirm] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/main-dashboard',
      icon: 'BarChart3',
      tooltip: 'Crime statistics and trend analysis overview'
    },
    {
      label: 'Map Analysis',
      path: '/interactive-map-view',
      icon: 'Map',
      tooltip: 'Geospatial visualization and spatial crime patterns'
    },
    {
      label: 'Data Management',
      path: '/data-upload-interface',
      icon: 'Upload',
      tooltip: 'CSV upload, validation, and dataset preparation'
    },
    {
      label: 'Predictions',
      path: '/prediction-interface',
      icon: 'TrendingUp',
      tooltip: 'LSTM model training and forecasting analysis',
      hasJobs: true
    },
    {
      label: 'Models',
      path: '/model-management',
      icon: 'Settings',
      tooltip: 'MLflow experiment tracking and model registry',
      hasJobs: true
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleJobsToggle = () => {
    setIsJobsExpanded(!isJobsExpanded);
  };

  const handleLogout = () => {
    // Show confirmation dialog first
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear user session from localStorage
    localStorage.removeItem('user');
    
    // Hide confirmation dialog
    setShowLogoutConfirm(false);
    
    // Navigate to login page
    navigate('/login');
    
    // Optional: Show logout confirmation
    console.log('User logged out successfully');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleAdminDatabaseClick = () => {
    // Check if user is admin
    const userRole = currentUser?.role;
    if (userRole !== 'admin') {
      return; // Don't show password modal if not admin
    }
    
    // Show password confirmation modal
    setShowAdminPasswordConfirm(true);
    setAdminPassword('');
    setAdminPasswordError('');
  };

  const confirmAdminAccess = () => {
    // Verify admin password (using the new admin password)
    if (adminPassword === '2512082004') {
      setShowAdminPasswordConfirm(false);
      setAdminPassword('');
      setAdminPasswordError('');
      navigate('/admin-database');
    } else {
      setAdminPasswordError('Incorrect password. Please try again.');
    }
  };

  const cancelAdminAccess = () => {
    setShowAdminPasswordConfirm(false);
    setAdminPassword('');
    setAdminPasswordError('');
  };

  // Get current user info from localStorage
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-transform duration-300 ease-in-out w-60 ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      } ${className || ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">CrimePredictPro</h1>
            <p className="text-xs text-muted-foreground">Analytics Platform</p>
          </div>
        </div>
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hover:bg-muted" 
            aria-label="Close sidebar"
          >
            <Icon name="PanelLeftClose" size={16} />
          </Button>
        )}
      </div>
      {/* User Context */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Link to="/profile" className="flex items-center space-x-3 hover:bg-muted rounded-lg px-2 py-1 flex-1">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="var(--color-muted-foreground)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {currentUser?.firstName 
                  ? `${currentUser.firstName} ${currentUser.lastName || ''}`
                  : (currentUser?.email ? currentUser.email.split('@')[0] : 'Guest User')
                }
              </p>
              <p className="text-xs text-muted-foreground capitalize truncate">
                {currentUser?.role || 'Guest'}
              </p>
            </div>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-6 h-6 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
            title="Logout"
          >
            <Icon name="LogOut" size={14} />
          </Button>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navigationItems?.map((item) => {
            return (
              <div key={item?.path}>
                <Link
                  to={item?.path}
                  className={`group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-out ${
                    isActive(item?.path)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    color={isActive(item?.path) ? 'currentColor' : 'var(--color-muted-foreground)'}
                    className="group-hover:text-current transition-colors duration-150"
                  />
                  <>
                    <span className="flex-1">{item?.label}</span>
                    {item?.hasJobs && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        <span className="text-xs bg-success/10 text-success px-1.5 py-0.5 rounded-full">2</span>
                      </div>
                    )}
                  </>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Real-time Jobs Status */}
        <div className="mt-8 pt-4 border-t border-border">
          <button
            onClick={handleJobsToggle}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={16} />
              <span>Active Jobs</span>
            </div>
            <Icon 
              name={isJobsExpanded ? "ChevronUp" : "ChevronDown"} 
              size={14} 
              className="transition-transform duration-150"
            />
          </button>
          
          {isJobsExpanded && (
            <div className="mt-2 space-y-2 animate-slide-in">
              <div className="px-3 py-2 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">LSTM Training</span>
                  <span className="text-xs text-success">Running</span>
                </div>
                <div className="mt-1 w-full bg-muted rounded-full h-1">
                  <div className="bg-success h-1 rounded-full w-3/4 transition-all duration-300"></div>
                </div>
                <span className="text-xs text-muted-foreground">~5 min remaining</span>
              </div>
              
              <div className="px-3 py-2 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Data Validation</span>
                  <span className="text-xs text-warning">Queued</span>
                </div>
                <span className="text-xs text-muted-foreground">Waiting for resources</span>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">System Online</span>
          </div>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <Icon name="HelpCircle" size={14} />
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <Icon name="LogOut" size={24} color="#EF4444" />
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to logout? You'll need to login again to access the system.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={cancelLogout}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={confirmLogout}
                className="flex-1 bg-destructive hover:bg-destructive/90"
              >
                <Icon name="LogOut" size={14} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Confirmation Modal */}
      {showAdminPasswordConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
              <Icon name="Shield" size={24} color="#3B82F6" />
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Access Required</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter your admin password to access the database management system.
              </p>
              
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setAdminPasswordError(''); // Clear error on typing
                  }}
                  placeholder="Enter admin password"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    adminPasswordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      confirmAdminAccess();
                    }
                  }}
                />
              </div>
              
              {adminPasswordError && (
                <div className="mt-2 text-sm text-red-600 flex items-center justify-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {adminPasswordError}
                </div>
              )}
              
              <div className="mt-3 text-xs text-gray-500">
                Hint: Use your admin login password
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={cancelAdminAccess}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={confirmAdminAccess}
                className="flex-1"
                disabled={!adminPassword}
              >
                <Icon name="Shield" size={14} className="mr-2" />
                Access Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar
