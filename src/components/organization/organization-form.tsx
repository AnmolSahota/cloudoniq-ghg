import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { toast } from "react-toastify";
import { DynamicForm } from "../dynamic-form";
import type { FormData } from "../../types/form.types";

interface Organization {
  id: string;
  organizationCode: string;
  organizationName: string;
  address: string;
  createdAt: string;
}

export function OrganizationForm() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const handleSubmit = async (formData: FormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newOrg: Organization = {
        id: `org-${Date.now()}`,
        organizationCode: formData.organizationCode || "",
        organizationName: formData.organizationName || "",
        address: formData.address || "",
        createdAt: new Date().toISOString(),
      };

      setOrganizations((prev) => [...prev, newOrg]);
      toast.success("Organization created successfully!");
    } catch (error) {
      toast.error("Failed to create organization.");
      throw error; // Re-throw to prevent form reset
    }
  };

  const handleDelete = (id: string) => {
    setOrganizations((prev) => prev.filter((org) => org.id !== id));
    toast.success("Organization deleted!");
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DynamicForm
          formId="organization"
          onSubmit={handleSubmit}
          showResetButton={true}
          cancelButtonText="Reset"
        />
      </div>

      {/* Organizations Table */}
      {organizations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Organizations ({organizations.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Address</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs">
                        {org.organizationCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {org.organizationName}
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {org.address || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(org.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {organizations.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-600 font-medium">No organizations yet</h3>
          <p className="text-sm text-gray-400 mt-1">
            Create your first organization using the form above
          </p>
        </div>
      )}
    </div>
  );
}