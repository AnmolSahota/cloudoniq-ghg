// src/pages/user-form.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePermissions } from "../context/PermissionsContext";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Shield,
  Save,
  X,
  LogOut,
  Lock,
  CheckCircle,
  UserPlus,
  Home,
  ChevronRight,
  Settings,
  Users,
  Menu,
  XIcon,
} from "lucide-react";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  branch: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: "admin" | "org_manager" | "branch_manager" | "viewer";
  status: "active" | "inactive" | "suspended";
}

const initialFormData: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  branch: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  role: "viewer",
  status: "active",
};

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function UserFormPage() {
  const router = useRouter();
  const { permissions } = usePermissions();
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.replace("/login");
      return;
    }

    // Get current user
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!permissions.canCreateUser) {
      alert("You don't have permission to create users!");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setShowSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      setShowSuccess(false);
      setFormData(initialFormData);
    }, 2000);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800 border-red-200",
      org_manager: "bg-orange-100 text-orange-800 border-orange-200",
      branch_manager: "bg-yellow-100 text-yellow-800 border-yellow-200",
      viewer: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
  };

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
            {/* Left Side - Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Welcome, {currentUser?.name?.split(" ")[0]}</p>
              </div>
            </div>

            {/* Center - Navigation (Desktop) */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => router.push("/user-form")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
              >
                <Users className="w-4 h-4" />
                User Form
              </button>
              <button
                onClick={() => router.push("/organization")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Building2 className="w-4 h-4" />
                Organization
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed rounded-lg"
                disabled
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* User Info (Desktop) */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize border ${getRoleBadgeColor(
                      currentUser?.role || ""
                    )}`}
                  >
                    {currentUser?.role?.replace("_", " ")}
                  </span>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    router.push("/user-form");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                >
                  <Users className="w-5 h-5" />
                  User Form
                </button>
                <button
                  onClick={() => {
                    router.push("/organization");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Building2 className="w-5 h-5" />
                  Organization
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
                <button
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 cursor-not-allowed rounded-lg"
                  disabled
                >
                  <Settings className="w-5 h-5" />
                  Settings
                  <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded">Soon</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Navigation Cards */}

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="font-medium text-green-800">User Created Successfully!</p>
          </div>
        )}

        {/* No Permission Warning */}
        {!permissions.canCreateUser && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <Lock className="w-6 h-6 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">View Only Mode</p>
              <p className="text-sm text-amber-600">You don't have permission to create users.</p>
            </div>
          </div>
        )}

        {/* User Form */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Create New User
            </h2>
            <p className="text-indigo-100 text-sm mt-1">Fill in the details below to create a new user</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Personal Info */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                Organization Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="engineering">Engineering</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                    <option value="operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="e.g. Senior Developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="mumbai">Mumbai - Head Office</option>
                    <option value="delhi">Delhi - North Zone</option>
                    <option value="bangalore">Bangalore - South Zone</option>
                    <option value="chennai">Chennai - East Zone</option>
                    <option value="pune">Pune - West Zone</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    rows={2}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-colors"
                    placeholder="Enter street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    maxLength={6}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </div>

            {/* Role & Status */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                Role & Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={!permissions.canManageUserRoles}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="branch_manager">Branch Manager</option>
                    <option value="org_manager">Org Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  {!permissions.canManageUserRoles && (
                    <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> No permission to change roles
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={!permissions.canCreateUser}
                    className="text-gray-900 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              {permissions.canCreateUser ? (
                <>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Create User
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/organization")}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-300 hover:bg-indigo-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <Building2 className="w-5 h-5" />
                    Go to Organization
                  </button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Lock className="w-5 h-5" />
                    <span>You don't have permission to create users</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/organization")}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <Building2 className="w-5 h-5" />
                    Go to Organization
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}