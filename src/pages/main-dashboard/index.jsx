import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MetricsCard from './components/MetricsCard';
import CrimeTrendsChart from './components/CrimeTrendsChart';
import CrimeDistributionChart from './components/CrimeDistributionChart';
import FilterPanel from './components/FilterPanel';
import QuickActions from './components/QuickActions';
import NotificationPanel from './components/NotificationPanel';

const MainDashboard = () => {
  const [filters, setFilters] = useState({});
  const [dashboardData, setDashboardData] = useState({
    totalCrimes: null,
    violentCrimes: null,
    propertyCrimes: null,
    drugOffenses: null,
    clearanceRate: null,
    responseTime: null
  });

  // Mock metrics data
  const metricsData = [
    {
      title: 'Total Crimes',
      value: dashboardData?.totalCrimes != null ? dashboardData?.totalCrimes?.toLocaleString() : 'N/A',
      change: '+2.3%',
      changeType: 'increase',
      icon: 'AlertTriangle',
      description: 'Last 30 days'
    },
    {
      title: 'Violent Crimes',
      value: dashboardData?.violentCrimes != null ? dashboardData?.violentCrimes?.toLocaleString() : 'N/A',
      change: '-5.2%',
      changeType: 'decrease',
      icon: 'Shield',
      description: 'Trending downward'
    },
    {
      title: 'Property Crimes',
      value: dashboardData?.propertyCrimes != null ? dashboardData?.propertyCrimes?.toLocaleString() : 'N/A',
      change: '+1.8%',
      changeType: 'increase',
      icon: 'Home',
      description: 'Slight increase'
    },
    {
      title: 'Drug Offenses',
      value: dashboardData?.drugOffenses != null ? dashboardData?.drugOffenses?.toLocaleString() : 'N/A',
      change: '0.0%',
      changeType: 'neutral',
      icon: 'Pill',
      description: 'Stable trend'
    },
    {
      title: 'Clearance Rate',
      value: dashboardData?.clearanceRate != null ? `${dashboardData?.clearanceRate}%` : 'N/A',
      change: '+3.1%',
      changeType: 'increase',
      icon: 'CheckCircle',
      description: 'Cases solved'
    },
    {
      title: 'Avg Response Time',
      value: dashboardData?.responseTime != null ? `${dashboardData?.responseTime} min` : 'N/A',
      change: '-0.8%',
      changeType: 'decrease',
      icon: 'Clock',
      description: 'Emergency calls'
    }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Mock filter application - in real app, this would trigger API calls
    console.log('Filters applied:', newFilters);
  };

  const computeFromStorage = () => {
    const isViolent = (v) => {
      const s = String(v || '').toLowerCase();
      return /assault|homicide|robbery|violent/i.test(s);
    };
    const isProperty = (v) => {
      const s = String(v || '').toLowerCase();
      return /theft|burglary|vandalism|larceny|property/i.test(s);
    };
    const isDrug = (v) => {
      const s = String(v || '').toLowerCase();
      return /drug/i.test(s);
    };

    try {
      const raw = localStorage.getItem('crime_data_uploaded');
      if (raw) {
        const data = JSON.parse(raw);
        const totalCrimes = Array.isArray(data) ? data.length : 0;
        let violentCrimes = 0;
        let propertyCrimes = 0;
        let drugOffenses = 0;
        let resolved = 0;
        let respSum = 0;
        let respCount = 0;

        for (const d of data || []) {
          const cat = d?.category ?? d?.type;
          if (isViolent(cat)) violentCrimes++;
          else if (isProperty(cat)) propertyCrimes++;
          if (isDrug(cat)) drugOffenses++;
          const status = String(d?.status || '').toLowerCase();
          if (/(resolved|closed)/.test(status)) resolved++;
          const rm = d?.responseMinutes;
          if (typeof rm === 'number' && isFinite(rm)) {
            respSum += rm;
            respCount += 1;
          }
        }

        const clearanceRate = totalCrimes > 0 ? Number(((resolved / totalCrimes) * 100).toFixed(1)) : null;
        const responseTime = respCount > 0 ? Number((respSum / respCount).toFixed(1)) : null;

        setDashboardData({
          totalCrimes,
          violentCrimes,
          propertyCrimes,
          drugOffenses,
          clearanceRate,
          responseTime
        });
      } else {
        setDashboardData({
          totalCrimes: null,
          violentCrimes: null,
          propertyCrimes: null,
          drugOffenses: null,
          clearanceRate: null,
          responseTime: null
        });
      }
    } catch (e) {
      console.error('Failed to load uploaded data:', e);
    }
  };

  useEffect(() => {
    computeFromStorage();
  }, [filters]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e?.key === 'crime_data_uploaded') {
        computeFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <>
      <Helmet>
        <title>Main Dashboard - CrimePredictPro</title>
        <meta name="description" content="Comprehensive crime statistics overview with interactive visualizations and filtering controls for data-driven analysis" />
      </Helmet>
      
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Crime Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive overview of crime statistics and trends for data-driven insights
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-success">Real-time Data</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Last Updated</p>
                  <p className="text-xs text-muted-foreground">Oct 2, 2024 - 9:35 AM</p>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <FilterPanel onFiltersChange={handleFiltersChange} />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {metricsData?.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  description={metric?.description}
                />
              ))}
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="xl:col-span-2">
                <CrimeTrendsChart />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CrimeDistributionChart />
              <NotificationPanel />
            </div>

            {/* Quick Actions and Activities */}
            <QuickActions />

            {/* Footer Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Data Sources</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Police Department Records</li>
                    <li>• Emergency Response Systems</li>
                    <li>• Court Case Management</li>
                    <li>• Community Reports</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Analysis Period</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Current Period: Jan 1 - Oct 2, 2024</li>
                    <li>• Historical Data: 2019-2024</li>
                    <li>• Update Frequency: Real-time</li>
                    <li>• Data Quality: 98.7% complete</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">System Status</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Data Pipeline: Operational</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>ML Models: Active</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span>Maintenance: Scheduled</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>API Services: Online</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
    </>
  );
};

export default MainDashboard;
