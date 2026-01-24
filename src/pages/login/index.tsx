/**
 * Login Page
 * 
 * Uses the DynamicForm component with the 'login' form configuration.
 * Handles authentication and redirects to user-form on success.
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { LogIn, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { DynamicForm } from '../../components/dynamic-form';
import { logger } from '../../utils/logger';
import axiosClient from '../../services/axiosClient';
import type { FormData } from '../../types/form.types';

// API Response types
interface UserData {
  id?: string;
  login_id?: string;
  name?: string;
  email?: string;
  token?: string;
}

interface LoginResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data?: UserData;
  user?: UserData;
  id?: string;
  login_id?: string;
  name?: string;
  email?: string;
  token?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState<string>('');
  const trackingIdRef = useRef<string | null>(null);

  // ============ Page Entry/Exit Logging ============
  useEffect(() => {
    trackingIdRef.current = logger.logPageEntry('/login');

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

  // ============ Extract User Data from Response ============
  const extractUserData = (data: LoginResponse): UserData | null => {
    if (data.data && (data.data.id || data.data.login_id)) {
      return data.data;
    }
    if (data.user && (data.user.id || data.user.login_id)) {
      return data.user;
    }
    if (data.id || data.login_id || data.name) {
      return {
        id: data.id,
        login_id: data.login_id,
        name: data.name,
        email: data.email,
        token: data.token,
      };
    }
    return null;
  };

  // ============ Handle Login Submit ============
  const handleLogin = async (formData: FormData) => {
    setGeneralError('');

    try {
      const response = await axiosClient.post<LoginResponse>(
        'http://localhost:8080/api/appusers/login',
        {
          login_id: formData.login_id,
          password: formData.password,
        }
      );

      const data = response.data;
      const userData = extractUserData(data);

      const isSuccess =
        response.status === 200 ||
        response.status === 201 ||
        data.success === true ||
        data.status === 'success' ||
        userData !== null;

      if (isSuccess && userData) {
        const user = {
          id: userData.id || '',
          login_id: userData.login_id || formData.login_id,
          name: userData.name || '',
          email: userData.email || '',
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');

        const token = userData.token || data.token;
        if (token) {
          localStorage.setItem('token', token);
        }

        toast.success('Login successful!');
        window.location.href = '/user-form';
        return;
      }

      const errorMsg = data.message || 'Invalid credentials. Please try again.';
      setGeneralError(errorMsg);
      toast.error(errorMsg);

    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = 'Invalid username or password.';
        } else if (status === 404) {
          errorMessage = 'User not found.';
        } else if (status === 400) {
          errorMessage = data?.message || 'Invalid request. Please check your input.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.';
      }

      setGeneralError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // ============ Handle Register Redirect ============
  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <DynamicForm
            formId="login"
            onSubmit={handleLogin}
            showHeader={false}
            showResetButton={false}
            generalError={generalError}
            className="p-8"
          />

          {/* Additional Links */}
          <div className="px-8 pb-8 space-y-4">
            <div className="flex justify-center">
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleRegisterRedirect}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create account
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials</p>
          <div className="flex justify-center gap-4 text-xs text-gray-600">
            <span><strong>Username:</strong> ashish</span>
            <span><strong>Password:</strong> ashish</span>
          </div>
        </div>
      </div>
    </div>
  );
}