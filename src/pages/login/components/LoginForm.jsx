import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [resetEmail, setResetEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleCreateAccount = () => {
    navigate('/create-account');
  };

  const roleOptions = [
    { 
      value: 'admin', 
      label: 'Administrator',
      description: 'Full system access, user management, and configuration control'
    },
    { 
      value: 'researcher', 
      label: 'Researcher',
      description: 'Data analysis, model training, and experiment management'
    },
    { 
      value: 'viewer', 
      label: 'Viewer',
      description: 'Read-only access to dashboards and reports'
    }
  ];

  // Mock credentials for different user types
  const getMockCredentials = () => {
    // Check if admin credentials are stored in localStorage
    const storedAdmin = localStorage.getItem('adminCredentials');
    let adminCreds = { email: 'alvinaaqdas@gmail.com', password: '2512082004', role: 'admin' };
    
    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        adminCreds = { ...adminCreds, email: parsed.email, password: parsed.password };
      } catch (e) {
        console.warn('Failed to parse stored admin credentials');
      }
    }
    
    return {
      admin: adminCreds,
      researcher: { email: 'researcher@crimepredictpro.edu', password: 'Research@2024', role: 'researcher' },
      viewer: { email: 'viewer@crimepredictpro.edu', password: 'Viewer@2024', role: 'viewer' }
    };
  };

  const mockCredentials = getMockCredentials();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check credentials - simplified and reliable
      let validCredential = null;
      
      // 1. Check Registered Users (localStorage)
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find(u => 
        u.email === formData?.email && 
        u.password === formData?.password && 
        u.role === formData?.role
      );

      if (registeredUser) {
        validCredential = registeredUser;
      }

      // 2. Admin login check (if not found in registered)
      if (!validCredential && formData?.role === 'admin') {
        // Check stored admin credentials first
        const storedAdmin = localStorage.getItem('adminCredentials');
        if (storedAdmin) {
          try {
            const parsed = JSON.parse(storedAdmin);
            if (parsed?.email === formData?.email && parsed?.password === formData?.password) {
              validCredential = { email: parsed.email, role: 'admin', password: parsed.password };
            }
          } catch (e) {
            console.warn('Failed to parse stored admin credentials');
          }
        }
        
        // Fallback to default admin credentials
        if (!validCredential && formData?.email === 'alvinaaqdas@gmail.com' && formData?.password === '2512082004') {
          validCredential = { email: 'alvinaaqdas@gmail.com', role: 'admin', password: '2512082004' };
        }
      } 
      
      // 3. Check Mock credentials (if not found yet)
      if (!validCredential) {
        // Non-admin roles
        const mockCred = mockCredentials[formData?.role];
        if (mockCred?.email === formData?.email && mockCred?.password === formData?.password) {
          validCredential = mockCred;
        }
      }

      if (validCredential) {
        console.log('Login successful - Role:', formData?.role, 'Redirecting to:', formData?.role === 'admin' ? '/admin-database' : '/main-dashboard');
        
        // Store user session
        localStorage.setItem('user', JSON.stringify({
          email: formData?.email,
          role: formData?.role,
          firstName: validCredential.firstName,
          lastName: validCredential.lastName,
          institution: validCredential.institution,
          loginTime: new Date()?.toISOString()
        }));

        // Simple direct navigation test
        if (formData?.role === 'admin') {
          console.log('Navigating to admin database...');
          window.location.href = '/admin-database';
        } else {
          console.log('Navigating to main dashboard...');
          window.location.href = '/main-dashboard';
        }
      } else {
        setErrors({
          submit: 'Invalid credentials. Please check your email and password, or ensure you have selected the correct role.'
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Authentication failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotModal(true);
    setResetStep(1);
    setResetEmail('');
    setOtpInput('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetError('');
    setResetSuccess('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setResetError('');
    
    // Normalize input email
    const emailToFind = resetEmail?.trim().toLowerCase();

    if (!emailToFind) {
      setResetError('Please enter an email address.');
      return;
    }

    // Simulate API check
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email exists in registered users (case-insensitive)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = registeredUsers.some(u => u.email?.trim().toLowerCase() === emailToFind) || 
                       emailToFind === 'alvinaaqdas@gmail.com' || // Admin
                       emailToFind === 'fayekquazi@gmail.com' || // Specific User Support
                       Object.values(mockCredentials).some(m => m.email?.trim().toLowerCase() === emailToFind); // Mock users

    if (userExists) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        setResetStep(2);
        alert(`DEMO OTP for ${resetEmail}: ${otp}`);
    } else {
        setResetError('Email address not found.');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
        setResetStep(3);
        setResetError('');
    } else {
        setResetError('Invalid OTP. Please try again.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
        setResetError('Passwords do not match.');
        return;
    }
    if (newPassword.length < 8) {
        setResetError('Password must be at least 8 characters.');
        return;
    }

    const emailToFind = resetEmail?.trim().toLowerCase();

    // Update password in localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.email?.trim().toLowerCase() === emailToFind);
    
    if (userIndex !== -1) {
        registeredUsers[userIndex].password = newPassword;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        setResetSuccess('Password reset successfully! Please login with your new password.');
        setTimeout(() => {
            setShowForgotModal(false);
            setResetSuccess('');
        }, 3000);
    } else if (emailToFind === 'alvinaaqdas@gmail.com') {
        // Update admin credentials
        localStorage.setItem('adminCredentials', JSON.stringify({
            email: 'alvinaaqdas@gmail.com',
            password: newPassword,
            role: 'admin'
        }));
        setResetSuccess('Admin password updated successfully!');
        setTimeout(() => {
            setShowForgotModal(false);
            setResetSuccess('');
        }, 3000);
    } else if (emailToFind === 'fayekquazi@gmail.com') {
        // Auto-recover/Create user if not found but allowed
        const newUser = {
            firstName: 'Fayek',
            lastName: 'Quazi',
            email: 'fayekquazi@gmail.com',
            password: newPassword,
            role: 'researcher', // Default role
            institution: 'CrimePredictPro',
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        setResetSuccess('Account recovered and password set! Please login.');
        setTimeout(() => {
            setShowForgotModal(false);
            setResetSuccess('');
        }, 3000);
    } else {
        // For demo/mock users, just simulate success
        setResetSuccess('Password reset successfully! (Demo account - changes not persisted)');
        setTimeout(() => {
            setShowForgotModal(false);
            setResetSuccess('');
        }, 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-md p-6 rounded-lg shadow-xl border border-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-foreground">Reset Password</h3>
                    <button onClick={() => setShowForgotModal(false)} className="text-muted-foreground hover:text-foreground">
                        <Icon name="X" size={20} />
                    </button>
                </div>

                {resetSuccess ? (
                    <div className="text-green-600 text-center py-4 bg-green-50 rounded-lg">
                        <Icon name="CheckCircle" size={32} className="mx-auto mb-2" />
                        {resetSuccess}
                    </div>
                ) : (
                    <>
                        {/* Step 1: Email */}
                        {resetStep === 1 && (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <p className="text-sm text-muted-foreground">Enter your email address to receive a One-Time Password (OTP).</p>
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full"
                                />
                                {resetError && <p className="text-xs text-destructive">{resetError}</p>}
                                <Button type="submit" fullWidth>Send OTP</Button>
                            </form>
                        )}

                        {/* Step 2: OTP */}
                        {resetStep === 2 && (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <p className="text-sm text-muted-foreground">Enter the 6-digit OTP sent to {resetEmail}</p>
                                <Input
                                    label="Enter OTP"
                                    type="text"
                                    value={otpInput}
                                    onChange={(e) => setOtpInput(e.target.value)}
                                    placeholder="123456"
                                    required
                                    className="w-full tracking-widest text-center text-lg"
                                    maxLength={6}
                                />
                                {resetError && <p className="text-xs text-destructive">{resetError}</p>}
                                <Button type="submit" fullWidth>Verify OTP</Button>
                                <button 
                                    type="button" 
                                    onClick={() => setResetStep(1)}
                                    className="text-xs text-primary w-full text-center hover:underline mt-2"
                                >
                                    Wrong email? Go back
                                </button>
                            </form>
                        )}

                        {/* Step 3: New Password */}
                        {resetStep === 3 && (
                            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                                <p className="text-sm text-muted-foreground">Create a new password for your account.</p>
                                <Input
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                    className="w-full"
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    required
                                    className="w-full"
                                />
                                {resetError && <p className="text-xs text-destructive">{resetError}</p>}
                                <Button type="submit" fullWidth>Reset Password</Button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your institutional email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          className="w-full"
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
          </button>
        </div>

        {/* Role Selection */}
        <Select
          label="Access Role"
          description="Select your institutional role for appropriate access level"
          options={roleOptions}
          value={formData?.role}
          onChange={(value) => handleInputChange('role', value)}
          error={errors?.role}
          placeholder="Choose your role"
          required
          className="w-full"
        />

        {/* Submit Error */}
        {errors?.submit && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={18} color="var(--color-destructive)" className="mt-0.5 flex-shrink-0" />
              <div className="text-sm text-destructive whitespace-pre-line">
                {errors?.submit}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          fullWidth
          iconName="LogIn"
          iconPosition="left"
          className="h-12"
        >
          {isLoading ? 'Authenticating...' : 'Sign In'}
        </Button>

        {/* Forgot Password */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        {/* Create Account */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleCreateAccount}
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Don't have an account? Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;