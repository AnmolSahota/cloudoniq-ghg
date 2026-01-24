/**
 * User Form Page (Dashboard)
 * 
 * Main dashboard page that uses the DynamicForm component with 'userForm' configuration.
 * Includes navigation, user info, and user creation form.
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  User,
  LogOut,
  CheckCircle,
  Home,
  ChevronRight,
  Users,
  Building2,
  Menu,
  X as XIcon,
} from 'lucide-react';
import { DynamicForm } from '../../components/dynamic-form';
import { logger } from '../../utils/logger';
import type { FormData } from '../../types/form.types';

interface CurrentUser {
  id: string;
  email: string;
  name: string;
}

export default function UserFormPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const trackingIdRef = useRef<string | null>(null);

  // ============ Authentication & Page Tracking ============
  useEffect(() => {
    trackingIdRef.current = logger.logPageEntry('/user-form');

    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true') {
      router.replace('/register');
      return;
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    setIsLoading(false);

    return () => {
      if (trackingIdRef.current) {
        logger.logPageExit(trackingIdRef.current);
      }
    };
  }, [router]);

  // ============ Event Handlers ============
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    router.push('/register');
  };

  const handleNavigation = (destination: string) => {
    setMobileMenuOpen(false);
    router.push(destination);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowSuccess(true);
      toast.success('User created successfully!');

      // Hide success message and form could be reset
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

    } catch (error) {
      toast.error('Failed to create user. Please try again.');
      throw error; // Re-throw to keep form in error state
    }
  };

  // ============ Loading State ============
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">
                  Welcome, {currentUser?.name?.split(' ')[0]}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => handleNavigation('/user-form')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
              >
                <Users className="w-4 h-4" />
                User Form
              </button>
              <button
                onClick={() => handleNavigation('/organization')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Building2 className="w-4 h-4" />
                Organization
              </button>
            </nav>

            {/* User Info & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavigation('/user-form')}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                >
                  <Users className="w-5 h-5" />
                  User Form
                </button>
                <button
                  onClick={() => handleNavigation('/organization')}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Building2 className="w-5 h-5" />
                  Organization
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="font-medium text-green-800">User Created Successfully!</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <DynamicForm
            formId="userForm"
            onSubmit={handleSubmit}
            showResetButton={true}
            cancelButtonText="Reset"
          />
        </div>
      </main>
    </div>
  );
}