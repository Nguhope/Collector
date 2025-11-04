import React, { useState } from "react";
import { Activity, Lock, Mail, Eye, EyeOff, Zap, Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email && password) {
        console.log("Login with:", { email, password });
        alert("Login successful! Replace this with your Redux dispatch");
      } else {
        setError("Please fill in all fields");
      }
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-green-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -right-40 w-72 h-72 sm:w-96 sm:h-96 bg-green-300 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 left-1/4 w-60 h-60 sm:w-80 sm:h-80 bg-blue-300 opacity-10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-10 left-5 sm:top-20 sm:left-20 animate-bounce">
        <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-20" />
      </div>
      <div className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 animate-bounce">
        <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white opacity-20" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
        {/* Glowing Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-3xl blur-xl opacity-50 animate-pulse"></div>

        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-500 p-6 sm:p-8 text-center relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-3xl mb-4 shadow-lg transform hover:scale-110 transition-transform">
                <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 animate-pulse" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Collector
              </h1>
              <p className="text-blue-100 font-medium text-sm sm:text-base">by ElecIT</p>
              <div className="mt-3 inline-block px-3 sm:px-4 py-1 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                <p className="text-white text-xs sm:text-sm font-semibold">
                  Système de Collecte de Données
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                Bienvenue !
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">Connectez-vous à votre compte</p>
            </div>

            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base font-bold text-gray-700 mb-1 sm:mb-2">
                Adresse Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base font-bold text-gray-700 mb-1 sm:mb-2">
                Mot de Passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 text-sm sm:text-base"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-2 sm:gap-0">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm sm:text-base text-gray-700 group-hover:text-blue-600 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <button className="text-sm sm:text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Se Connecter
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-center text-sm sm:text-base">
            <p className="text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <button className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Contactez l'administrateur
              </button>
            </p>
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 text-xs sm:text-sm text-gray-500">
              © 2024 ElecIT - Tous droits réservés
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
