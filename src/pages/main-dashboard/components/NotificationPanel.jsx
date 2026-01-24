import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Model Training Complete',
      message: 'LSTM model for violent crime prediction has finished training with 94.2% accuracy.',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      read: false,
      actionable: true,
      action: 'View Results'
    },
    {
      id: 2,
      type: 'info',
      title: 'Data Validation Successful',
      message: 'Q3_2024_Crime_Data.csv has been validated and is ready for analysis.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      read: false,
      actionable: true,
      action: 'Start Analysis'
    },
    {
      id: 3,
      type: 'warning',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance window: October 5, 2024, 2:00 AM - 4:00 AM EST.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: true,
      actionable: false
    },
    {
      id: 4,
      type: 'error',
      title: 'Prediction Job Failed',
      message: 'Property crime prediction job failed due to insufficient data. Please check dataset.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      actionable: true,
      action: 'Retry Job'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Info';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'success': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-destructive/10';
      default: return 'bg-primary/10';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev?.map(notif => 
        notif?.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev?.map(notif => ({ ...notif, read: true }))
    );
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev?.filter(notif => notif?.id !== id));
  };

  const filteredNotifications = notifications?.filter(notif => {
    if (filter === 'unread') return !notif?.read;
    if (filter === 'actionable') return notif?.actionable;
    return true;
  });

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Bell" size={18} color="var(--color-primary)" />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-destructive-foreground">{unreadCount}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              iconName="CheckCheck"
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          <Button variant="ghost" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {[
          { key: 'all', label: 'All', count: notifications?.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'actionable', label: 'Actionable', count: notifications?.filter(n => n?.actionable)?.length }
        ]?.map((tab) => (
          <button
            key={tab?.key}
            onClick={() => setFilter(tab?.key)}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
              filter === tab?.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{tab?.label}</span>
            {tab?.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab?.key 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications to show</p>
          </div>
        ) : (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                notification?.read 
                  ? 'bg-background border-border' :'bg-card border-primary/20 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationBg(notification?.type)}`}>
                  <Icon 
                    name={getNotificationIcon(notification?.type)} 
                    size={16} 
                    color={`var(--color-${notification?.type === 'error' ? 'destructive' : notification?.type})`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold ${notification?.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notification?.title}
                      </h4>
                      <p className={`text-sm mt-1 ${notification?.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notification?.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimestamp(notification?.timestamp)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-3">
                      {!notification?.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Check"
                          onClick={() => markAsRead(notification?.id)}
                          className="w-8 h-8"
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={() => dismissNotification(notification?.id)}
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                  
                  {notification?.actionable && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="ArrowRight"
                        iconPosition="right"
                      >
                        {notification?.action}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;