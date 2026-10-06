import { useState } from "react";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import "./App.css";

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("access_token")
      ? "dashboard"
      : "login"
  );

  const [user, setUser] = useState({
    name: localStorage.getItem("user_name") || "",
    user_id: Number(localStorage.getItem("user_id")) || "",
  });

  const handleLogin = (data) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("user_name", data.name);

    setUser({
      name: data.name,
      user_id: data.user_id,
    });

    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");

    setUser({
      name: "",
      user_id: "",
    });

    setPage("login");
  };

  const goToRegister = () => {
    setPage("register");
  };

  const goToLogin = () => {
    setPage("login");
  };

  if (page === "register") {
    return (
      <Register
        onRegister={goToLogin}
        onLogin={goToLogin}
      />
    );
  }

  if (page === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onRegister={goToRegister}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}

export default App;