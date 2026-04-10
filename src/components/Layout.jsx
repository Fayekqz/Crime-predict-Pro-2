import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './ui/Sidebar';
import Header from './ui/Header';
import Button from './ui/Button';
import Icon from './AppIcon';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar_state');
    return saved !== null ? JSON.parse(saved) : true; // Default to open (visible)
  });
  
  const location = useLocation();

  // Auto-hide sidebar on route change on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    // Initial check
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar_state', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={!isSidebarOpen} 
        onToggleCollapse={toggleSidebar}
        className="z-[1200]" 
      />

      {/* Main Content Wrapper */}
      <div 
        className={`
          flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:pl-60' : 'lg:pl-0'}
        `}
      >
        <Header 
          sidebarCollapsed={!isSidebarOpen} 
          onToggleSidebar={toggleSidebar} 
        />
        
        <main className="flex-1 overflow-x-hidden pt-16">
          <Outlet />
        </main>
      </div>

      {/* Floating Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <Button
          variant="default"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-20 left-4 z-[1050] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          aria-label="Open sidebar"
        >
          <Icon name="Menu" size={16} />
        </Button>
      )}

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[1150] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
