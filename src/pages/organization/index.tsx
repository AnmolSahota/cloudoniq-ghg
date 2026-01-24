/**
 * Organization Page
 * 
 * Uses the DynamicForm component with 'organization' form configuration.
 */

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { DynamicForm } from '../../components/dynamic-form';
import { logger } from '../../utils/logger';
import type { FormData } from '../../types/form.types';

export default function OrganizationPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const trackingIdRef = useRef<string | null>(null);

  useEffect(() => {
    trackingIdRef.current = logger.logPageEntry('/organization');
    const auth = localStorage.getItem('isAuthenticated');

    if (auth !== 'true') {
      router.replace('/register');
    } else {
      setIsAuthenticated(true);
    }

    setIsLoading(false);

    return () => {
      if (trackingIdRef.current) {
        logger.logPageExit(trackingIdRef.current);
      }
    };
  }, [router]);

  const handleBackToDashboard = () => {
    router.push('/user-form');
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Organization saved successfully!');
    } catch (error) {
      toast.error('Failed to save organization.');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Organization Master</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create and manage organizations and their details
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <DynamicForm
              formId="organization"
              onSubmit={handleSubmit}
              onCancel={handleBackToDashboard}
              cancelButtonText="Cancel"
            />
          </div>
        </div>
      </main>
    </div>
  );
}