// src/pages/login.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePermissions, USER_ROLES } from "../context/PermissionsContext";
import { Lock, AlertCircle, Mail, Eye, EyeOff } from "lucide-react";
import { createModuleLogger } from "../../utils/logger";

// Create module-specific logger
const loginLogger = createModuleLogger("LoginPage");

// Dummy Users for Demo
export const DUMMY_USERS = [
  {
    id: "admin-001",
    email: "admin@company.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    permissions: USER_ROLES.admin,
  },
  {
    id: "org-mgr-001",
    email: "orgmanager@company.com",
    password: "orgmgr123",
    name: "Organization Manager",
    role: "org_manager",
    permissions: USER_ROLES.orgManager,
  },
  {
    id: "br-mgr-001",
    email: "branchmanager@company.com",
    password: "branch123",
    name: "Branch Manager",
    role: "branch_manager",
    permissions: {
      ...USER_ROLES.branchManager,
      allowedBranchIds: ["branch-001", "branch-002"],
    },
  },
  {
    id: "viewer-001",
    email: "viewer@company.com",
    password: "viewer123",
    name: "Viewer User",
    role: "viewer",
    permissions: USER_ROLES.viewer,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { setPermissions } = usePermissions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // ============ LOGGING: Page Mount ============
  useEffect(() => {
    loginLogger.info("PAGE_MOUNT", "Login page loaded", {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });

    // Cleanup log on unmount
    return () => {
      loginLogger.debug("PAGE_UNMOUNT", "Login page unmounted");
    };
  }, []);

  // Check if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    
    loginLogger.debug("AUTH_CHECK", "Checking authentication status", {
      isAuthenticated: isAuthenticated === "true",
    });

    if (isAuthenticated === "true") {
      loginLogger.info("AUTH_REDIRECT", "User already authenticated, redirecting", {
        destination: "/user-form",
      });
      router.replace("/user-form");
    }
  }, [router]);

  const validateForm = () => {
    loginLogger.debug("FORM_VALIDATION", "Validating form inputs", {
      hasEmail: !!email,
      hasPassword: !!password,
      emailLength: email.length,
      passwordLength: password.length,
    });

    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      loginLogger.warn("VALIDATION_FAILED", "Form validation failed", {
        errors: newErrors,
        emailProvided: !!email,
        passwordProvided: !!password,
      });
    } else {
      loginLogger.info("VALIDATION_SUCCESS", "Form validation passed");
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    loginLogger.info("LOGIN_ATTEMPT", "User attempting to login", {
      email: email.toLowerCase(),
      timestamp: new Date().toISOString(),
    });

    if (!validateForm()) {
      loginLogger.warn("LOGIN_BLOCKED", "Login blocked due to validation errors");
      return;
    }

    setIsLoading(true);
    loginLogger.debug("LOGIN_PROCESSING", "Processing login request");

    // Simulate API call
    const startTime = performance.now();
    await new Promise((r) => setTimeout(r, 1000));
    const endTime = performance.now();

    loginLogger.debug("API_CALL", "Simulated API call completed", {
      duration: `${(endTime - startTime).toFixed(2)}ms`,
    });

    const user = DUMMY_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (user) {
      // ============ LOGGING: Successful Login ============
      loginLogger.info("LOGIN_SUCCESS", "User logged in successfully", {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        userName: user.name,
      });

      setPermissions(user.permissions);
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      loginLogger.info("SESSION_CREATED", "User session created", {
        userId: user.id,
        permissions: Object.keys(user.permissions),
      });

      loginLogger.info("NAVIGATION", "Redirecting to user-form", {
        from: "/login",
        to: "/user-form",
      });

      router.push("/user-form");
    } else {
      // ============ LOGGING: Failed Login ============
      loginLogger.error("LOGIN_FAILED", "Invalid credentials provided", {
        attemptedEmail: email.toLowerCase(),
        reason: "Invalid email or password",
        timestamp: new Date().toISOString(),
      });

      setLoginError("Invalid email or password");
    }

    setIsLoading(false);
  };

  const handleQuickLogin = (user: typeof DUMMY_USERS[0]) => {
    loginLogger.info("QUICK_LOGIN", "Quick login credentials selected", {
      selectedRole: user.role,
      selectedEmail: user.email,
    });

    setEmail(user.email);
    setPassword(user.password);
    setErrors({});
    setLoginError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    loginLogger.trace("INPUT_CHANGE", "Email field updated", {
      fieldLength: newEmail.length,
    });

    if (errors.email) {
      setErrors({ ...errors, email: undefined });
      loginLogger.debug("ERROR_CLEARED", "Email error cleared");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    loginLogger.trace("INPUT_CHANGE", "Password field updated", {
      fieldLength: newPassword.length,
    });

    if (errors.password) {
      setErrors({ ...errors, password: undefined });
      loginLogger.debug("ERROR_CLEARED", "Password error cleared");
    }
  };

  const handleTogglePassword = () => {
    const newState = !showPassword;
    setShowPassword(newState);

    loginLogger.debug("PASSWORD_VISIBILITY", "Password visibility toggled", {
      isVisible: newState,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Alert */}
            {loginError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{loginError}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials Card */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Demo Credentials</h3>
          <div className="space-y-2 text-xs">
            {DUMMY_USERS.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleQuickLogin(u)}
              >
                <span className="font-medium text-gray-900 capitalize">
                  {u.role.replace("_", " ")}
                </span>
                <span className="text-gray-600">
                  {u.email} / {u.password}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// // src/pages/login.tsx
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { usePermissions, USER_ROLES } from "../context/PermissionsContext";
// import { Lock, AlertCircle, Mail, Eye, EyeOff } from "lucide-react";

// // Dummy Users for Demo
// export const DUMMY_USERS = [
//   {
//     id: "admin-001",
//     email: "admin@company.com",
//     password: "admin123",
//     name: "Admin User",
//     role: "admin",
//     permissions: USER_ROLES.admin,
//   },
//   {
//     id: "org-mgr-001",
//     email: "orgmanager@company.com",
//     password: "orgmgr123",
//     name: "Organization Manager",
//     role: "org_manager",
//     permissions: USER_ROLES.orgManager,
//   },
//   {
//     id: "br-mgr-001",
//     email: "branchmanager@company.com",
//     password: "branch123",
//     name: "Branch Manager",
//     role: "branch_manager",
//     permissions: {
//       ...USER_ROLES.branchManager,
//       allowedBranchIds: ["branch-001", "branch-002"],
//     },
//   },
//   {
//     id: "viewer-001",
//     email: "viewer@company.com",
//     password: "viewer123",
//     name: "Viewer User",
//     role: "viewer",
//     permissions: USER_ROLES.viewer,
//   },
// ];

// export default function LoginPage() {
//   const router = useRouter();
//   const { setPermissions } = usePermissions();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginError, setLoginError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

//   // Check if already authenticated
//   useEffect(() => {
//     const isAuthenticated = localStorage.getItem("isAuthenticated");
//     if (isAuthenticated === "true") {
//       router.replace("/user-form");
//     }
//   }, [router]);

//   const validateForm = () => {
//     const newErrors: { email?: string; password?: string } = {};

//     if (!email) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       newErrors.email = "Please enter a valid email";
//     }

//     if (!password) {
//       newErrors.password = "Password is required";
//     } else if (password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoginError("");

//     if (!validateForm()) return;

//     setIsLoading(true);
    
//     // Simulate API call
//     await new Promise((r) => setTimeout(r, 1000));

//     const user = DUMMY_USERS.find(
//       (u) =>
//         u.email.toLowerCase() === email.toLowerCase() &&
//         u.password === password
//     );

//     if (user) {
//       setPermissions(user.permissions);
//       localStorage.setItem("currentUser", JSON.stringify(user));
//       localStorage.setItem("isAuthenticated", "true");
//       router.push("/user-form");
//     } else {
//       setLoginError("Invalid email or password");
//     }

//     setIsLoading(false);
//   };

//   const handleQuickLogin = (userIndex: number) => {
//     const user = DUMMY_USERS[userIndex];
//     setEmail(user.email);
//     setPassword(user.password);
//     setErrors({});
//     setLoginError("");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
//             <Lock className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
//           <p className="text-gray-600 mt-2">Sign in to your account</p>
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <form onSubmit={handleLogin} className="space-y-6">
//             {/* Error Alert */}
//             {loginError && (
//               <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
//                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
//                 <span className="text-sm">{loginError}</span>
//               </div>
//             )}

//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => {
//                     setEmail(e.target.value);
//                     if (errors.email) setErrors({ ...errors, email: undefined });
//                   }}
//                   className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="you@example.com"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => {
//                     setPassword(e.target.value);
//                     if (errors.password) setErrors({ ...errors, password: undefined });
//                   }}
//                   className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {isLoading ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   Signing in...
//                 </div>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//         </div>

//         {/* Demo Credentials Card */}
//         <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-sm font-semibold text-gray-900 mb-4">Demo Credentials</h3>
//           <div className="space-y-2 text-xs">
//             {DUMMY_USERS.map((u) => (
//               <div
//                 key={u.id}
//                 className="flex justify-between items-center p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
//                 onClick={() => {
//                   setEmail(u.email);
//                   setPassword(u.password);
//                   setErrors({});
//                   setLoginError("");
//                 }}
//               >
//                 <span className="font-medium text-gray-900 capitalize">
//                   {u.role.replace("_", " ")}
//                 </span>
//                 <span className="text-gray-600">
//                   {u.email} / {u.password}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }