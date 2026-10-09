import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminHome, getMe } from "../api/authApi.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function AdminPage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [message, setMessage] = useState("Loading the admin workspace...");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAdmin() {
      try {
        const [homeData, meData] = await Promise.all([
          getAdminHome(token),
          getMe(token),
        ]);
        if (active) {
          setMessage(typeof homeData === "string" ? homeData : "Welcome Admin");
          setProfile(meData);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Could not load admin home");
        }
      }
    }

    loadAdmin();
    return () => {
      active = false;
    };
  }, [token]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="home-page admin-page">
      <div className="home-backdrop admin-backdrop" aria-hidden="true" />
      <header className="home-top">
        <p className="brand-mark">Vaultline</p>
        <button className="btn-ghost" type="button" onClick={handleLogout}>
          Sign out
        </button>
      </header>

      <main className="home-main">
        <p className="eyebrow">Admin only</p>
        <h1>{message}</h1>
        <p className="home-copy">
          This workspace is loaded from the admin API.
          {profile ? ` Signed in as ${profile.username}.` : ""}
        </p>
        {profile?.role ? (
          <dl className="user-meta">
            <div>
              <dt>Role</dt>
              <dd>{profile.role}</dd>
            </div>
          </dl>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
      </main>
    </div>
  );
}
