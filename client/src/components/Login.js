import React from "react";
import { Heart, Users, Shield, Sparkles } from "lucide-react";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="p-3 bg-primary-500 rounded-2xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Campus Connect
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-md">
              Find meaningful connections with fellow students at your
              university
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Shield className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Verified Students Only
                </h3>
                <p className="text-gray-600">
                  Connect with verified college students in your area
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Users className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Campus Community
                </h3>
                <p className="text-gray-600">
                  Meet people from your university and nearby colleges
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Smart Matching</h3>
                <p className="text-gray-600">
                  Advanced algorithm to find your perfect study buddy or more
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">10K+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">500+</div>
              <div className="text-sm text-gray-600">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">50K+</div>
              <div className="text-sm text-gray-600">Matches</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to find your perfect match
                </p>
              </div>

              <div className="space-y-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 rounded-xl py-4 px-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium group-hover:text-gray-900">
                    Continue with Google
                  </span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Secure login with your university email
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Your privacy is protected</span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    By continuing, you agree to our{" "}
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                New to Campus Connect?{" "}
                <span className="text-primary-600 font-medium">
                  Sign up is automatic with Google
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
