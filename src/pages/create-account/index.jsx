import React from 'react';
import CreateAccountForm from './components/CreateAccountForm';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#1E3A8A"/>
    <path d="M20 7L30 12V18C30 24 25.6 29.1 20 31C14.4 29.1 10 24 10 18V12L20 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const CreateAccount = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{ 
        background: 'linear-gradient(135deg, #1f2937 0%, #3c82f6 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Crime-themed background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-12 h-12 mr-3">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-white">CrimePredictPro</h1>
          </div>
          <p className="text-white/80 text-sm">Analytics Platform</p>
        </div>
        
        {/* Create Account Form Container */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/20">
          <CreateAccountForm />
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
