import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ sidebarCollapsed = false, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryNavItems = [
    {
      label: 'Dashboard',
      path: '/main-dashboard',
      icon: 'BarChart3'
    },
    {
      label: 'Map Analysis',
      path: '/interactive-map-view',
      icon: 'Map'
    },
    {
      label: 'Predictions',
      path: '/prediction-interface',
      icon: 'TrendingUp'
    },
    {
      label: 'Models',
      path: '/model-management',
      icon: 'Settings'
    }
  ];

  const secondaryNavItems = [
    {
      label: 'Data Management',
      path: '/data-upload-interface',
      icon: 'Upload'
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleHelpSupport = () => {
    setIsMoreMenuOpen(false);
    navigate('/help');
  };

  const handleSettings = () => {
    setIsMoreMenuOpen(false);
    navigate('/settings');
  };

  return (
    <header className={`fixed top-0 right-0 z-[1100] bg-card border-b border-border transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'left-0' : 'lg:left-60 left-0'}`}>
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle - Only show on mobile or when sidebar is collapsed */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className={`text-muted-foreground hover:text-foreground ${!sidebarCollapsed ? 'lg:hidden' : ''}`}
            aria-label={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
          >
            <Icon name={sidebarCollapsed ? "Menu" : "PanelLeftClose"} size={20} />
          </Button>

          {/* Logo - Hide when sidebar is open on desktop */}
          <Link to="/main-dashboard" className={`flex items-center space-x-3 ${!sidebarCollapsed ? 'lg:hidden' : ''}`}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">CrimePredictPro</h1>
            </div>
          </Link>

          {/* Page Title - Show when sidebar is open */}
          {!sidebarCollapsed && (
            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-foreground">
                {primaryNavItems?.find(item => isActive(item.path))?.label || 
                 secondaryNavItems?.find(item => isActive(item.path))?.label || 
                 'Analytics Platform'}
              </h1>
            </div>
          )}
        </div>

        {/* Center Section - Global Navigation (Desktop) - Hide when sidebar is open */}
        <nav className={`hidden lg:flex items-center space-x-1 ${!sidebarCollapsed ? 'lg:hidden' : ''}`}>
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-out ${
                isActive(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                name={item?.icon} 
                size={16} 
                color={isActive(item?.path) ? 'currentColor' : 'var(--color-muted-foreground)'}
              />
              <span>{item?.label}</span>
            </Link>
          ))}

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={toggleMoreMenu}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Icon name="MoreHorizontal" size={16} />
              <span className="text-sm font-medium">More</span>
            </Button>

            {isMoreMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-[1200] animate-fade-in">
                <div className="py-2">
                  {secondaryNavItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-150 ${
                        isActive(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </Link>
                  ))}
                  <div className="border-t border-border my-2"></div>
                  <button 
                    onClick={handleHelpSupport}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted w-full text-left"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <button 
                    onClick={handleSettings}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted w-full text-left"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-3">
          {/* Real-time Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-success">2 Jobs Running</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Icon name="Bell" size={18} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-accent-foreground">3</span>
            </div>
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Link to="/profile" className="hidden sm:block text-right hover:text-foreground">
              <p className="text-sm font-medium text-foreground">Alvina Aqdas</p>
              <p className="text-xs text-muted-foreground">Research Analyst</p>
            </Link>
            <Link to="/profile" className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground">
              <Icon name="User" size={16} color="var(--color-muted-foreground)" />
            </Link>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <Icon name="LogOut" size={14} />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-border">
        <nav className="flex items-center justify-around py-2">
          {primaryNavItems?.slice(0, 4)?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors duration-150 ${
                isActive(item?.path)
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span className="text-xs font-medium">{item?.label?.split(' ')?.[0]}</span>
            </Link>
          ))}
        </nav>
      </div>
      {/* Overlay for mobile more menu */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-[1199] bg-black/20" 
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
