/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  ArrowLeft,
  Frown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useNavigate, useLocation } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1); // 1=request token, 2=reset
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // success/error

  // Auto-detect token from URL (optional)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setStep(2);
    }
  }, [location.search]);

  // Clear message when input changes
  useEffect(() => {
    if (message.text) setMessage({ text: "", type: "" });
  }, [email, token, password, confirm]);

  // STEP 1: Request reset token (simulate email)
  const handleRequestToken = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ text: "Veuillez entrer votre email", type: "error" });
      return;
    }

    setLoading(true);

    // --------------------------
    // Simulate sending token to email
    // --------------------------
    setTimeout(() => {
      setMessage({
        text: "Un lien de réinitialisation a été envoyé à votre email.",
        type: "success",
      });
      setTimeout(() => setStep(2), 1000);
      setLoading(false);
    }, 1000);

   
  };

  // STEP 2: Reset password (simulate)
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!token.trim())
      return setMessage({
        text: "Veuillez coller le token reçu par email",
        type: "error",
      });
    if (!password.trim() || !confirm.trim())
      return setMessage({ text: "Remplissez tous les champs", type: "error" });
    if (password !== confirm)
      return setMessage({
        text: "Les mots de passe ne correspondent pas",
        type: "error",
      });

    setLoading(true);

    // --------------------------
    // Simulate password reset
    // --------------------------
    setTimeout(() => {
      setMessage({
        text: "Mot de passe réinitialisé avec succès !",
        type: "success",
      });
      setTimeout(() => navigate("/"), 1000);
      setLoading(false);
    }, 1000);

  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-500 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-500">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 relative">
          <AnimatePresence>
            {step === 1 && (
              <motion.button
                key="back-btn"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => navigate("/")}
                className="absolute left-0 top-0 flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium"></span>
              </motion.button>
            )}
          </AnimatePresence>

          {step === 2 ? (
            <CheckCircle className="w-12 h-12 text-green-500 mb-2 animate-bounce" />
          ) : (
            <Shield className="w-12 h-12 text-blue-600 mb-2" />
          )}

          <h2 className="text-2xl font-bold text-gray-800 text-center transition-all">
            {step === 1
              ? "Mot de passe oublié"
              : "Réinitialisation du mot de passe"}
          </h2>

          {message.text && (
            <p
              className={`mt-2 p-2 rounded text-sm text-center ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* STEP 1: Request token */}
        {step === 1 && (
          <form onSubmit={handleRequestToken} className="animate-fadeIn">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <div className="relative mb-4">
              <KeyRound className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien Token"}
            </button>
          </form>
        )}

        {/* STEP 2: Reset password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="animate-fadeIn">
            <label className="block text-gray-700 font-semibold mb-2">
              Token de vérification
            </label>
            <div className="relative mb-4">
              <KeyRound className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Collez le token reçu par email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                disabled={loading}
              />
            </div>

            <label className="block text-gray-700 font-semibold mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative mb-4">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <label className="block text-gray-700 font-semibold mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative mb-6">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-500 hover:text-blue-500"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {loading
                ? "Réinitialisation en cours..."
                : "Réinitialiser le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
