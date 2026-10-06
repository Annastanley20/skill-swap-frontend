import { useState } from "react";
import "./Login.css";

function Login({ onLogin, onRegister }) {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Invalid email or password."
        );

        setLoading(false);
        return;
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "user_id",
        data.user_id
      );

      localStorage.setItem(
        "user_name",
        data.name
      );

      onLogin(data);

    } catch (error) {

      setMessage(
        "Unable to connect to the server. Make sure FastAPI is running."
      );

    }

    setLoading(false);
  };

  return (
    <div className="login-page">

      <div className="login-left">

        <div className="login-brand">
          Skill<span>Swap</span>
        </div>

        <div className="login-content">

          <div className="login-badge">
            ✨ Welcome back
          </div>

          <h1>
            Welcome
            <br />
            <span>back.</span>
          </h1>

          <p>
            Continue your skill exchange journey and
            connect with people who can teach you
            something new.
          </p>

        </div>

      </div>

      <div className="login-right">

        <div className="login-card">

          <div className="login-mobile-logo">
            Skill<span>Swap</span>
          </div>

          <div className="login-heading">

            <h2>
              Log in to SkillSwap
            </h2>

            <p>
              Enter your details to continue.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="login-form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="login-form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Log In →"}
            </button>

          </form>

          {message && (
            <div className="login-message">
              {message}
            </div>
          )}

          <p className="register-text">
            Don't have an account?

            <button
              type="button"
              onClick={onRegister}
            >
              Create account
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;