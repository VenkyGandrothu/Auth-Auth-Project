import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHome } from "../api/authApi.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [message, setMessage] = useState("Loading your workspace...");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHome() {
      try {
        const data = await getHome(token);
        if (active) {
          setMessage(typeof data === "string" ? data : "Welcome Home");
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
        <p className="home-copy">
          You reached this page with a valid JWT. The backend verified your
          Bearer token before returning the welcome message.
        </p>

        {user ? (
          <dl className="user-meta">
            <div>
              <dt>Username</dt>
              <dd>{user.username}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
          </dl>
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}
      </main>
    </div>
  );
}
