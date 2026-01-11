// src/pages/user-form.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Input from "../../components/ui/input/Input";
import { runValidations } from "../../utils/runValidations";

// Import config files (same as register)
import fieldsConfig from "../../field_config/fields.config.json";
import validationsConfig from "../../field_config/validations.config.json";

import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Save,
  X,
  LogOut,
  CheckCircle,
  UserPlus,
  Home,
  ChevronRight,
  Users,
  Menu,
  XIcon,
  Briefcase,
} from "lucide-react";

// Type definitions
type FieldConfig = {
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  rows?: number;
  colSpan?: number;
  constraints?: {
    minLength?: number;
    maxLength?: number;
  };
  validations?: string[];
  options?: { value: string; label: string }[];
};

type UserFormData = {
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
};

type FormErrors = Partial<Record<keyof UserFormData, string>>;

interface CurrentUser {
  id: string;
  email: string;
  name: string;
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
};

export default function UserFormPage() {
  const router = useRouter();

  // Get fields and validations from config
  const { fields } = fieldsConfig;
  const { validations } = validationsConfig;

  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.replace("/register");
      return;
    }

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

  // Validate field using runValidations and config
  const validateField = (fieldName: keyof UserFormData, value: string): string | null => {
    const fieldConfig = fields[fieldName] as FieldConfig;

    if (!fieldConfig) return null;

    if (fieldConfig.required && !value.trim()) {
      return `${fieldConfig.label} is required`;
    }

    if (!value.trim()) return null;

    return runValidations(
      value,
      fieldConfig.validations || [],
      validations,
      fieldConfig.constraints || {}
    );
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof UserFormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle change
  const handleChange = (field: keyof UserFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field] && errors[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    }
  };

  // Handle blur
  const handleBlur = (field: keyof UserFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
    router.push("/register");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setShowSuccess(true);
    toast.success("User created successfully!");
    setIsSubmitting(false);

    setTimeout(() => {
      setShowSuccess(false);
      setFormData(initialFormData);
      setTouched({});
      setErrors({});
    }, 2000);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  // Reusable Select Component
  const SelectField = ({
    name,
    fieldConfig,
    value,
  }: {
    name: keyof UserFormData;
    fieldConfig: FieldConfig;
    value: string;
  }) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {fieldConfig.label}
        {fieldConfig.required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange(name)}
        onBlur={handleBlur(name)}
        className={`block w-full h-10 rounded-md border bg-white text-slate-900 
          transition-colors outline-none px-3
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${touched[name] && errors[name] ? "border-red-500" : "border-slate-300"}`}
      >
        <option value="">{fieldConfig.placeholder}</option>
        {fieldConfig.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {touched[name] && errors[name] && (
        <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  // Reusable Textarea Component
  const TextareaField = ({
    name,
    fieldConfig,
    value,
    icon,
  }: {
    name: keyof UserFormData;
    fieldConfig: FieldConfig;
    value: string;
    icon?: React.ReactNode;
  }) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {fieldConfig.label}
        {fieldConfig.required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-3 left-0 flex items-center pl-3 text-slate-400">
            {icon}
          </span>
        )}
        <textarea
          name={name}
          rows={fieldConfig.rows || 2}
          placeholder={fieldConfig.placeholder}
          value={value}
          onChange={handleChange(name)}
          onBlur={handleBlur(name)}
          maxLength={fieldConfig.constraints?.maxLength}
          className={`block w-full rounded-md border bg-white text-slate-900 placeholder-slate-400 
            transition-colors outline-none py-2 resize-none
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            ${icon ? "pl-10 pr-3" : "px-3"}
            ${touched[name] && errors[name] ? "border-red-500" : "border-slate-300"}`}
        />
      </div>
      {touched[name] && errors[name] && (
        <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
      )}
      {fieldConfig.constraints?.maxLength && (
        <p className="mt-1 text-xs text-slate-500">
          {value.length}/{fieldConfig.constraints.maxLength} characters
        </p>
      )}
    </div>
  );

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
            {/* Left Side */}
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
            </nav>

            {/* Right Side */}
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
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="font-medium text-green-800">User Created Successfully!</p>
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
                <Input
                  name="firstName"
                  type={fields.firstName.type}
                  label={fields.firstName.label}
                  placeholder={fields.firstName.placeholder}
                  value={formData.firstName}
                  onChange={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  error={touched.firstName ? errors.firstName : undefined}
                  required={fields.firstName.required}
                  leftIcon={<User className="h-5 w-5" />}
                  maxLength={fields.firstName.constraints?.maxLength}
                />

                <Input
                  name="lastName"
                  type={fields.lastName.type}
                  label={fields.lastName.label}
                  placeholder={fields.lastName.placeholder}
                  value={formData.lastName}
                  onChange={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  error={touched.lastName ? errors.lastName : undefined}
                  required={fields.lastName.required}
                  leftIcon={<User className="h-5 w-5" />}
                  maxLength={fields.lastName.constraints?.maxLength}
                />
              </div>
            </div>

            {/* Contact */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="email"
                  type={fields.email.type}
                  label={fields.email.label}
                  placeholder={fields.email.placeholder}
                  value={formData.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email ? errors.email : undefined}
                  required={fields.email.required}
                  leftIcon={<Mail className="h-5 w-5" />}
                />

                <Input
                  name="phone"
                  type={fields.phone.type}
                  label={fields.phone.label}
                  placeholder={fields.phone.placeholder}
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  error={touched.phone ? errors.phone : undefined}
                  required={fields.phone.required}
                  leftIcon={<Phone className="h-5 w-5" />}
                  maxLength={fields.phone.constraints?.maxLength}
                />
              </div>
            </div>

            {/* Organization */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                Organization Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField
                  name="department"
                  fieldConfig={fields.department as FieldConfig}
                  value={formData.department}
                />

                <Input
                  name="designation"
                  type={fields.designation.type}
                  label={fields.designation.label}
                  placeholder={fields.designation.placeholder}
                  value={formData.designation}
                  onChange={handleChange("designation")}
                  onBlur={handleBlur("designation")}
                  error={touched.designation ? errors.designation : undefined}
                  required={fields.designation.required}
                  leftIcon={<Briefcase className="h-5 w-5" />}
                  maxLength={fields.designation.constraints?.maxLength}
                />

                <SelectField
                  name="branch"
                  fieldConfig={fields.branch as FieldConfig}
                  value={formData.branch}
                />
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
                  <TextareaField
                    name="address"
                    fieldConfig={fields.address as FieldConfig}
                    value={formData.address}
                    icon={<MapPin className="h-5 w-5" />}
                  />
                </div>

                <Input
                  name="city"
                  type={fields.city.type}
                  label={fields.city.label}
                  placeholder={fields.city.placeholder}
                  value={formData.city}
                  onChange={handleChange("city")}
                  onBlur={handleBlur("city")}
                  error={touched.city ? errors.city : undefined}
                  required={fields.city.required}
                  leftIcon={<MapPin className="h-5 w-5" />}
                  maxLength={fields.city.constraints?.maxLength}
                />

                <Input
                  name="state"
                  type={fields.state.type}
                  label={fields.state.label}
                  placeholder={fields.state.placeholder}
                  value={formData.state}
                  onChange={handleChange("state")}
                  onBlur={handleBlur("state")}
                  error={touched.state ? errors.state : undefined}
                  required={fields.state.required}
                  leftIcon={<MapPin className="h-5 w-5" />}
                  maxLength={fields.state.constraints?.maxLength}
                />

                <Input
                  name="pincode"
                  type={fields.pincode.type}
                  label={fields.pincode.label}
                  placeholder={fields.pincode.placeholder}
                  value={formData.pincode}
                  onChange={handleChange("pincode")}
                  onBlur={handleBlur("pincode")}
                  error={touched.pincode ? errors.pincode : undefined}
                  required={fields.pincode.required}
                  leftIcon={<MapPin className="h-5 w-5" />}
                  maxLength={fields.pincode.constraints?.maxLength}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
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
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}