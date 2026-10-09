import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";
import { homePathForRole, normalizeRole } from "./auth/roles.js";
import AdminPage from "./pages/AdminPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

function AccessCheck() {
  return (
    <div className="home-page">
      <div className="home-backdrop" aria-hidden="true" />
      <main className="home-main">
        <p className="eyebrow">Checking access</p>
        <h1>One moment...</h1>
      </main>
    </div>
  );
}

function PublicOnlyRoute({ children }) {
  const { token, user, roleReady } = useAuth();
  if (!token) {
    return children;
  }
  if (!roleReady) {
    return <AccessCheck />;
  }
  return <Navigate to={homePathForRole(user?.role)} replace />;
}

function RoleGate({ allow, children }) {
  const { token, user, roleReady } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!roleReady) {
    return <AccessCheck />;
  }
  if (normalizeRole(user?.role) !== allow) {
    return <Navigate to={homePathForRole(user?.role)} replace />;
  }
  return children;
}

function FallbackRedirect() {
  const { token, user, roleReady } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!roleReady) {
    return <AccessCheck />;
  }
  return <Navigate to={homePathForRole(user?.role)} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FallbackRedirect />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/home"
        element={
          <RoleGate allow="USER">
            <HomePage />
          </RoleGate>
        }
      />
      <Route
        path="/admin"
        element={
          <RoleGate allow="ADMIN">
            <AdminPage />
          </RoleGate>
        }
      />
      <Route path="*" element={<FallbackRedirect />} />
    </Routes>
  );
}
