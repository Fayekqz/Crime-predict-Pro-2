import React from 'react';
import LoginForm from './components/LoginForm';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#1E3A8A"/>
    <path d="M20 7L30 12V18C30 24 25.6 29.1 20 31C14.4 29.1 10 24 10 18V12L20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const Login = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1440' height='900' viewBox='0 0 1440 900'%3E%3Crect width='1440' height='900' fill='%23ffffff'/%3E%3Cg transform='translate(400,360)'%3E%3Crect x='0' y='-40' width='80' height='80' rx='16' fill='%231E3A8A'/%3E%3Cpath d='M40 0 L60 10 V30 C60 40 52 50 40 54 C28 50 20 40 20 30 V10 L40 0 Z' stroke='%23ffffff' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext x='520' y='360' font-family='system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica Neue,Arial' font-size='64' font-weight='600' fill='%231F2937'%3ECrimePredictPro%3C/text%3E%3Ctext x='520' y='416' font-family='system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica Neue,Arial' font-size='32' fill='%236B7280'%3EAnalytics Platform%3C/text%3E%3C/svg%3E")`,
        backgroundSize: '130%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 backdrop-blur-xl bg-white/40"></div>
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <Logo />
            <h1 className="mt-3 text-3xl font-bold text-foreground">CrimePredictPro</h1>
            <p className="text-muted-foreground text-sm">Analytics Platform</p>
          </div>
        </div>
        
        {/* Login Form Container */}
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-border">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
