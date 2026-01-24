import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    desktop: true
  });
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC'
  });

  const settingsTabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'appearance', label: 'Appearance', icon: 'Palette' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'data', label: 'Data & Privacy', icon: 'Database' }
  ];

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleAppearanceChange = (field, value) => {
    setAppearance(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your application preferences</p>
              </div>
            </div>
            <Button variant="default">
              <Icon name="Save" size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4">
              <nav className="space-y-1">
                {settingsTabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">General Settings</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          User Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Alvina Aqdas"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue="alvina.aqdas@example.com"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          defaultValue="Research Analyst"
                          disabled
                          className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      {Object.entries(notifications)?.map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-foreground capitalize">
                              {key} Notifications
                            </label>
                            <p className="text-xs text-muted-foreground">
                              Receive {key} notifications about crime alerts and system updates
                            </p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-primary' : 'bg-muted'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Appearance</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Theme
                        </label>
                        <select
                          value={appearance.theme}
                          onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Language
                        </label>
                        <select
                          value={appearance.language}
                          onChange={(e) => handleAppearanceChange('language', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Timezone
                        </label>
                        <select
                          value={appearance.timezone}
                          onChange={(e) => handleAppearanceChange('timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="PST">Pacific Time</option>
                          <option value="IST">India Standard Time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Security Settings</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        />
                      </div>
                      
                      <Button variant="outline">
                        <Icon name="Key" size={16} className="mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Privacy Settings */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Data & Privacy</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium text-foreground mb-2">Data Export</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Download all your data and analysis reports
                        </p>
                        <Button variant="outline" size="sm">
                          <Icon name="Download" size={14} className="mr-2" />
                          Export Data
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium text-foreground mb-2">Clear Cache</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Clear temporary files and cached data
                        </p>
                        <Button variant="outline" size="sm">
                          <Icon name="Trash2" size={14} className="mr-2" />
                          Clear Cache
                        </Button>
                      </div>
                      
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <h3 className="font-medium text-destructive mb-2">Delete Account</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Permanently delete your account and all associated data
                        </p>
                        <Button variant="destructive" size="sm">
                          <Icon name="AlertTriangle" size={14} className="mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
