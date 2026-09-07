import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHome, getMe } from "../api/authApi.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [message, setMessage] = useState("Loading your workspace...");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHome() {
      try {
        const [homeData, meData] = await Promise.all([
          getHome(token),
          getMe(token),
        ]);
        if (active) {
          setMessage(typeof homeData === "string" ? homeData : "Welcome Home");
          setProfile(meData);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Could not load home");
        }
      }
    }

    loadHome();
    return () => {
      active = false;
    };
  }, [token]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="home-page">
      <div className="home-backdrop" aria-hidden="true" />
      <header className="home-top">
        <p className="brand-mark">Vaultline</p>
        <button className="btn-ghost" type="button" onClick={handleLogout}>
          Sign out
        </button>
      </header>

      <main className="home-main">
        <p className="eyebrow">Protected route</p>
        <h1>{message}</h1>
        {profile ? (
          <p className="home-copy">
            Signed in as {profile.username}
          </p>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
      </main>
    </div>
  );
}
