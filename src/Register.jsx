import { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
      const response = await fetch("http://127.0.0.1:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Registration failed.");
        setLoading(false);
        return;
      }

      setMessage("Account created successfully! 🎉");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(
        "Unable to connect to the server. Make sure your FastAPI backend is running."
      );
    }

    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <div className="register-brand">
          Skill<span>Swap</span>
        </div>

        <div className="register-content">
          <div className="register-badge">
            ✨ Join the community
          </div>

          <h1>
            Learn more.
            <br />
            <span>Share more.</span>
          </h1>

          <p>
            Create your SkillSwap account and connect with people
            who can teach you something new while learning from
            what you already know.
          </p>

          <div className="benefits">
            <div>
              <span>✓</span>
              <p>Exchange skills without money</p>
            </div>

            <div>
              <span>✓</span>
              <p>Find people with matching skills</p>
            </div>

            <div>
              <span>✓</span>
              <p>Learn and grow together</p>
            </div>
          </div>
        </div>
      </div>

      <div className="register-right">
        <div className="register-card">
          <div className="mobile-logo">
            Skill<span>Swap</span>
          </div>

          <div className="form-heading">
            <h2>Create your account</h2>
            <p>Start your skill exchange journey today.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          {message && (
            <div className="form-message">
              {message}
            </div>
          )}

          <p className="login-text">
            Already have an account?
            <button type="button"> Log in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;