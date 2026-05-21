import React, { useState } from "react";
import { signInWithPassword, supabase } from "../utils/supabase";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Login via Supabase
      const { error: loginError } = await signInWithPassword(email, password);

      if (loginError) {
        setError(loginError.message || "Login failed");
        return;
      }

      // 2. Force session fetch (CRITICAL FIX)
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (!session) {
        setError("Login succeeded but session not found. Check Supabase Auth settings.");
        return;
      }

      // 3. Send user to app
      onAuthSuccess?.({
        user: session.user,
        session,
      });

      // 4. Close modal
      onClose?.();

    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          width: 380,
          background: "#ffffff",
          borderRadius: 12,
          padding: 22,
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Owner Login</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ddd",
              fontSize: 14,
            }}
          />

          {error && (
            <div style={{ color: "#c0392b", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{
              marginTop: 10,
              padding: 10,
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              background: "#222",
              color: "white",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            onClick={onClose}
            style={{
              marginTop: 8,
              padding: 8,
              cursor: "pointer",
              background: "transparent",
              border: "none",
              color: "#555",
            }}
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
}