// src/pages/register.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePermissions, USER_ROLES } from "../context/PermissionsContext";
import { Lock, AlertCircle, Mail, Eye, EyeOff, User } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../components/ui/input/Input";
import { runValidations } from "../../utils/runValidations";

// Your exact config files
import fieldsConfig from "../../field_config/fields.config.json";
import validationsConfig from "../../field_config/validations.config.json";


// Type definitions based on your config
type FieldConfig = {
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  icon?: string;
  showToggle?: boolean;
  constraints?: {
    minLength?: number;
    maxLength?: number;
  };
  validations?: string[];
};

type FormData = {
  name: string;
  userId: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormData | "general", string>>;

// Icon mapping based on your config icon field
const ICONS: Record<string, React.ReactNode> = {
  lock: <Lock className="h-5 w-5" />,
};

export default function RegisterPage() {
  const router = useRouter();
  const { setPermissions } = usePermissions();

  // Get fields from your config
  const { fields } = fieldsConfig;
  const { validations } = validationsConfig;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    userId: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});


  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      router.replace("/user-form");
    }
  }, [router]);

  // Validate field using your runValidations and config
  const validateField = (fieldName: keyof FormData, value: string): string | null => {
    const fieldConfig = fields[fieldName] as FieldConfig;

    if (!fieldConfig) return null;

    // Required check from config
    if (fieldConfig.required && !value.trim()) {
      return `${fieldConfig.label} is required`;
    }

    if (!value.trim()) return null;

    // Use your runValidations function with your config
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

    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
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
  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field] && errors[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    }
  };

  // Handle blur
  const handleBlur = (field: keyof FormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  // Handle submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: undefined }));

    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) return;

    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    const newUser = {
      id: `user-${Date.now()}`,
      email: formData.email.toLowerCase(),
      name: formData.name,
      userId: formData.userId,
      // role: "viewer",
      // permissions: USER_ROLES.viewer,
    };

    // setPermissions(newUser.permissions);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isAuthenticated", "true");

    toast.success("Registration successful!");
    router.push("/user-form");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up to get started</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{errors.general}</span>
              </div>
            )}

            {/* Name - using fields.name from config */}
            <Input
              name="name"
              type={fields.name.type}
              label={fields.name.label}
              placeholder={fields.name.placeholder}
              value={formData.name}
              onChange={handleChange("name")}
              onBlur={handleBlur("name")}
              error={touched.name ? errors.name : undefined}
              required={fields.name.required}
              leftIcon={<User className="h-5 w-5" />}
              maxLength={fields.name.constraints?.maxLength}
            />

            {/* User ID - using fields.userId from config */}
            <Input
              name="userId"
              type={fields.userId.type}
              label={fields.userId.label}
              placeholder={fields.userId.placeholder}
              value={formData.userId}
              onChange={handleChange("userId")}
              onBlur={handleBlur("userId")}
              error={touched.userId ? errors.userId : undefined}
              required={fields.userId.required}
              leftIcon={<User className="h-5 w-5" />}
              maxLength={fields.userId.constraints?.maxLength}
            />

            {/* Email - using fields.email from config */}
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

            {/* Password - using fields.password from config */}
            <Input
              name="password"
              type={showPassword ? "text" : fields.password.type}
              label={fields.password.label}
              placeholder={fields.password.placeholder}
              value={formData.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              error={touched.password ? errors.password : undefined}
              required={fields.password.required}
              leftIcon={fields.password.icon ? ICONS[fields.password.icon] : undefined}
              rightIcon={
                fields.password.showToggle ? (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                ) : undefined
              }
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}