import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMe, googleLoginUrl, login } from "../api/authApi.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { homePathForRole } from "../auth/roles.js";
import AuthShell from "../components/AuthShell.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success] = useState(
    location.state?.justSignedUp
      ? "Account created — please sign in"
      : ""
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });
      const me = await getMe(data.token);
      saveAuth({
        ...data,
        id: me.id ?? data.id,
        username: me.username ?? data.username,
        email: me.email ?? data.email,
        role: me.role,
        status: me.status,
      });
      navigate(homePathForRole(me.role), { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Secure access"
      title="Sign in to Vaultline"
      subtitle="Enter your credentials to open your protected workspace."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {success ? <p className="form-success">{success}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="auth-divider">or</p>
      <a className="btn-google" href={googleLoginUrl}>
        Continue with Google
      </a>

      <p className="auth-switch">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  );
}
