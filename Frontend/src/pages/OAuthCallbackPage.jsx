import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../api/authApi.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { homePathForRole } from "../auth/roles.js";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function finishGoogleLogin() {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const token = params.get("token");
      if (!token) {
        if (active) {
          setError("Google did not return an access token.");
        }
        return;
      }

      try {
        const me = await getMe(token);
        if (!active) {
          return;
        }
        saveAuth({
          token,
          id: me.id,
          username: me.username,
          email: me.email,
          role: me.role,
          status: me.status,
        });
        navigate(homePathForRole(me.role), { replace: true });
      } catch (err) {
        if (active) {
          setError(err.message || "Google sign-in failed");
        }
      }
    }

    finishGoogleLogin();
    return () => {
      active = false;
    };
  }, [navigate, saveAuth]);

  return (
    <div className="home-page">
      <div className="home-backdrop" aria-hidden="true" />
      <main className="home-main">
        <p className="eyebrow">Google sign-in</p>
        <h1>{error ? "Sign-in stopped" : "Signing you in..."}</h1>
        {error ? <p className="form-error">{error}</p> : null}
        {error ? (
          <p className="home-copy">
            <Link to="/login">Back to sign in</Link>
          </p>
        ) : null}
      </main>
    </div>
  );
}
