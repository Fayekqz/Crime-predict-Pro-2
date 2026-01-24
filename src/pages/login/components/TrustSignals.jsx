import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustIndicators = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'End-to-end encryption'
    },
    {
      icon: 'Award',
      title: 'IEEE Compliant',
      description: 'Research standards certified'
    },
    {
      icon: 'Lock',
      title: 'JWT Authentication',
      description: 'Industry-standard security'
    },
    {
      icon: 'Database',
      title: 'GDPR Compliant',
      description: 'Data privacy protected'
    }
  ];

  const institutions = [
    {
      name: 'Academic Research Institute',
      badge: 'Verified Institution',
      logo: 'GraduationCap'
    },
    {
      name: 'Law Enforcement Partnership',
      badge: 'Certified Partner',
      logo: 'Shield'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Security Indicators */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="ShieldCheck" size={20} className="mr-2 text-success" />
          Security & Compliance
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {trustIndicators?.map((indicator, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={indicator?.icon} size={16} color="var(--color-success)" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{indicator?.title}</p>
                <p className="text-xs text-muted-foreground">{indicator?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Institutional Partnerships */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Users" size={20} className="mr-2 text-primary" />
          Trusted Partners
        </h3>
        <div className="space-y-4">
          {institutions?.map((institution, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={institution?.logo} size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{institution?.name}</p>
                  <p className="text-xs text-muted-foreground">{institution?.badge}</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-success rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
      {/* Research Citations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BookOpen" size={20} className="mr-2 text-accent" />
          Research Impact
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Published Papers</span>
            <span className="text-sm font-medium text-foreground">24+</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Citations</span>
            <span className="text-sm font-medium text-foreground">1,200+</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Researchers</span>
            <span className="text-sm font-medium text-foreground">150+</span>
          </div>
        </div>
      </div>
      {/* System Status */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">System Status</span>
          </div>
          <span className="text-sm text-success">All Systems Operational</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Last updated: {new Date()?.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;