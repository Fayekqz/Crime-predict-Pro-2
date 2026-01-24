import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    organization: '',
    location: ''
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setProfile(prev => ({
          ...prev,
          name: userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : (userData.email?.split('@')[0] || 'Guest User'),
          role: userData.role || 'Viewer',
          email: userData.email || '',
          organization: userData.institution || 'CrimePredictPro',
          phone: userData.phone || '+91 90000 00000',
          location: userData.location || 'Delhi, India'
        }));
      } else {
        // Fallback for demo/dev if no user is logged in
        setProfile({
          name: 'Alvina Aqdas',
          role: 'Research Analyst',
          email: 'alvina.aqdas@example.com',
          phone: '+91 90000 00000',
          organization: 'CrimePredictPro',
          location: 'Delhi, India'
        });
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  }, []);

  const handleSave = () => {
    setEditing(false);
    // In a real app, we would save changes to backend here
    // For now, update localStorage 'user' if name/role changed (optional, but good for consistency)
    try {
       const storedUser = localStorage.getItem('user');
       if (storedUser) {
           const userData = JSON.parse(storedUser);
           // Simple name splitting for demo
           const nameParts = profile.name.split(' ');
           const newUserData = {
               ...userData,
               firstName: nameParts[0] || userData.firstName,
               lastName: nameParts.slice(1).join(' ') || userData.lastName,
               role: profile.role,
               email: profile.email,
               institution: profile.organization
           };
           localStorage.setItem('user', JSON.stringify(newUserData));
           
           // Also trigger a storage event so Sidebar updates immediately
           window.dispatchEvent(new Event('storage'));
       }
    } catch(e) {
        console.error("Failed to save profile locally", e);
    }
   };

   const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </div>
            </div>
            <div className="space-x-2">
              {!editing ? (
                <Button variant="outline" iconName="Pencil" iconPosition="left" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              ) : (
                <Button variant="default" iconName="Save" iconPosition="left" onClick={handleSave}>
                  Save
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <input
                    className="mt-1 w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                    value={profile.name}
                    readOnly={!editing}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Role</label>
                  <input
                    className="mt-1 w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                    value={profile.role}
                    readOnly={!editing}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Email</label>
                  <input
                    className="mt-1 w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                    value={profile.email}
                    readOnly={!editing}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Phone</label>
                  <input
                    className="mt-1 w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                    value={profile.phone}
                    readOnly={!editing}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Organization</label>
                  <input
                    className="mt-1 w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                    value={profile.organization}
                    readOnly={!editing}
                    onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Location</label>
                  <input
                    className="mt-1 w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                    value={profile.location}
                    readOnly={!editing}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={20} color="var(--color-success)" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Account Status</p>
                  <p className="text-xs text-success">Active</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium text-foreground">2024</span>
              </div>
              <Button variant="outline" fullWidth iconName="Settings" iconPosition="left">
                Account Settings
              </Button>
              <Button 
                variant="destructive" 
                fullWidth 
                iconName="LogOut" 
                iconPosition="left"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
    </>
  );
};

export default ProfilePage;
