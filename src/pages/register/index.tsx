/**
 * Register Page
 * 
 * Uses the DynamicForm component with the 'register' form configuration.
 * Creates a new user account and redirects to user-form on success.
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { DynamicForm } from '../../components/dynamic-form';
import { logger } from '../../utils/logger';
import type { FormData } from '../../types/form.types';

export default function RegisterPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string>('');
  const trackingIdRef = useRef<string | null>(null);

  // ============ Page Entry/Exit Logging ============
  useEffect(() => {
    trackingIdRef.current = logger.logPageEntry('/register');

    // Redirect if already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      router.replace('/user-form');
    }

    return () => {
      if (trackingIdRef.current) {
        logger.logPageExit(trackingIdRef.current);
      }
    };
  }, [router]);

  // ============ Handle Registration Submit ============
  const handleRegister = async (formData: FormData) => {
    setGeneralError('');

    try {
      // Simulate API call (replace with actual API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create user object
      const newUser = {
        id: `user-${Date.now()}`,
        email: formData.email.toLowerCase(),
        name: formData.name,
        userId: formData.userId,
      };

      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('isAuthenticated', 'true');

      toast.success('Registration successful!');
      router.push('/user-form');

    } catch (error: any) {
      const errorMessage = 'Registration failed. Please try again.';
      setGeneralError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // ============ Handle Login Redirect ============
  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up to get started</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <DynamicForm
            formId="register"
            onSubmit={handleRegister}
            showHeader={false}
            showResetButton={false}
            generalError={generalError}
            className="p-8"
          />

          {/* Login Link */}
          <div className="px-8 pb-8">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}