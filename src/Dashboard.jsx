import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");

  const [profile, setProfile] = useState(() => ({
    name: localStorage.getItem("user_name") || user?.name || "User",
    email: localStorage.getItem("user_email") || "user@example.com",
  }));

  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem("skills");
    return saved ? JSON.parse(saved) : [];
  });

  const [skillName, setSkillName] = useState("");
  const [skillType, setSkillType] = useState("offer");

  const [searchSkill, setSearchSkill] = useState("");

  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);

  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const addSkill = (e) => {
    e.preventDefault();

    if (!skillName.trim()) {
      showMessage("Please enter a skill.");
      return;
    }

    const newSkill = {
      id: Date.now(),
      name: skillName.trim(),
      type: skillType,
    };

    setSkills((prev) => [...prev, newSkill]);
    setSkillName("");

    showMessage("Skill added successfully!");
  };

  const deleteSkill = (id) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
    showMessage("Skill removed.");
  };

  const offeredSkills = skills.filter(
    (skill) => skill.type === "offer"
  );

  const wantedSkills = skills.filter(
    (skill) => skill.type === "want"
  );

  const matches = useMemo(() => {
    const results = [];

    offeredSkills.forEach((offer) => {
      wantedSkills.forEach((want) => {
        if (
          offer.name.toLowerCase() ===
          want.name.toLowerCase()
        ) {
          results.push({
            id: `${offer.id}-${want.id}`,
            skill: offer.name,
          });
        }
      });
    });

    return results;
  }, [skills]);

  const searchResults = skills.filter((skill) =>
    skill.name
      .toLowerCase()
      .includes(searchSkill.toLowerCase())
  );

  const saveProfile = (e) => {
    e.preventDefault();

    if (!editName.trim() || !editEmail.trim()) {
      showMessage("Please fill in all fields.");
      return;
    }

    setProfile({
      name: editName,
      email: editEmail,
    });

    localStorage.setItem("user_name", editName);
    localStorage.setItem("user_email", editEmail);

    showMessage("Profile updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");

    onLogout();
  };

  const goTo = (page) => {
    setActivePage(page);
    setMessage("");
  };

  const renderDashboard = () => (
    <>
      <div className="dashboard-welcome">
        <div>
          <span className="welcome-label">
            Welcome back 👋
          </span>

          <h1>{profile.name}</h1>

          <p>
            Continue learning, sharing and connecting
            with your SkillSwap community.
          </p>
        </div>

        <div className="welcome-icon">
          ✨
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div>
            <span>Total Skills</span>
            <strong>{skills.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div>
            <span>Skills I Offer</span>
            <strong>{offeredSkills.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div>
            <span>Skills I Want</span>
            <strong>{wantedSkills.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🤝</div>
          <div>
            <span>Matches</span>
            <strong>{matches.length}</strong>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Quick Actions</h2>
          <p>Manage your SkillSwap journey.</p>
        </div>
      </div>

      <div className="quick-actions">
        <button onClick={() => goTo("skills")}>
          <span>➕</span>
          <div>
            <strong>Add a Skill</strong>
            <small>Tell people what you can teach.</small>
          </div>
        </button>

        <button onClick={() => goTo("find")}>
          <span>🔎</span>
          <div>
            <strong>Find People</strong>
            <small>Search for people by skill.</small>
          </div>
        </button>

        <button onClick={() => goTo("matches")}>
          <span>🤝</span>
          <div>
            <strong>View Matches</strong>
            <small>See your skill connections.</small>
          </div>
        </button>
      </div>

      <div className="section-heading">
        <div>
          <h2>Your Skills</h2>
          <p>Skills you offer and want to learn.</p>
        </div>

        <button
          className="small-action"
          onClick={() => goTo("skills")}
        >
          Manage Skills →
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="empty-card">
          <div>💡</div>
          <h3>No skills added yet</h3>
          <p>
            Add your first skill to start building your
            SkillSwap profile.
          </p>

          <button
            className="primary-button"
            onClick={() => goTo("skills")}
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="skill-preview">
          {skills.slice(0, 6).map((skill) => (
            <div className="skill-chip-card" key={skill.id}>
              <span>
                {skill.type === "offer" ? "🎓" : "📖"}
              </span>

              <div>
                <strong>{skill.name}</strong>
                <small>
                  {skill.type === "offer"
                    ? "I can teach"
                    : "I want to learn"}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderSkills = () => (
    <>
      <div className="page-title">
        <h1>My Skills</h1>
        <p>
          Share what you know and tell the community
          what you want to learn.
        </p>
      </div>

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      <div className="add-skill-card">
        <div className="card-heading">
          <h2>Add a Skill</h2>
          <p>
            Add something you can teach or something
            you would like to learn.
          </p>
        </div>

        <form onSubmit={addSkill}>
          <div className="form-row">
            <div className="dashboard-form-group">
              <label>Skill Name</label>

              <input
                type="text"
                placeholder="e.g. Python, Excel, Graphic Design"
                value={skillName}
                onChange={(e) =>
                  setSkillName(e.target.value)
                }
              />
            </div>

            <div className="dashboard-form-group">
              <label>Skill Type</label>

              <select
                value={skillType}
                onChange={(e) =>
                  setSkillType(e.target.value)
                }
              >
                <option value="offer">
                  I can teach this
                </option>

                <option value="want">
                  I want to learn this
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="primary-button add-button"
            >
              Add Skill
            </button>
          </div>
        </form>
      </div>

      <div className="skills-columns">
        <div className="skill-list-card">
          <div className="list-header">
            <div>
              <h2>Skills I Offer</h2>
              <p>Things you can teach others.</p>
            </div>

            <span className="count-badge">
              {offeredSkills.length}
            </span>
          </div>

          {offeredSkills.length === 0 ? (
            <div className="list-empty">
              No offered skills yet.
            </div>
          ) : (
            <div className="skill-list">
              {offeredSkills.map((skill) => (
                <div
                  className="skill-item"
                  key={skill.id}
                >
                  <div className="skill-item-icon">
                    🎓
                  </div>

                  <div className="skill-item-info">
                    <strong>{skill.name}</strong>
                    <small>I can teach this</small>
                  </div>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteSkill(skill.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="skill-list-card">
          <div className="list-header">
            <div>
              <h2>Skills I Want</h2>
              <p>Things you want to learn.</p>
            </div>

            <span className="count-badge">
              {wantedSkills.length}
            </span>
          </div>

          {wantedSkills.length === 0 ? (
            <div className="list-empty">
              No wanted skills yet.
            </div>
          ) : (
            <div className="skill-list">
              {wantedSkills.map((skill) => (
                <div
                  className="skill-item"
                  key={skill.id}
                >
                  <div className="skill-item-icon">
                    📖
                  </div>

                  <div className="skill-item-info">
                    <strong>{skill.name}</strong>
                    <small>I want to learn this</small>
                  </div>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteSkill(skill.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderMatches = () => (
    <>
      <div className="page-title">
        <h1>My Matches</h1>
        <p>
          Skill combinations that could help you learn
          and teach.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="empty-card">
          <div>🤝</div>
          <h3>No matches yet</h3>

          <p>
            Add both skills you can teach and skills you
            want to learn. Matching skills will appear
            here.
          </p>

          <button
            className="primary-button"
            onClick={() => goTo("skills")}
          >
            Add Skills
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((match) => (
            <div className="match-card" key={match.id}>
              <div className="match-icon">
                🤝
              </div>

              <h3>Skill Match</h3>

              <p>
                You can exchange knowledge around
              </p>

              <strong>{match.skill}</strong>

              <button className="secondary-button">
                Connect →
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderFindPeople = () => (
    <>
      <div className="page-title">
        <h1>Find People</h1>
        <p>
          Search for people who have skills you are
          interested in.
        </p>
      </div>

      <div className="search-card">
        <div className="search-box">
          <span>🔎</span>

          <input
            type="text"
            placeholder="Search for a skill..."
            value={searchSkill}
            onChange={(e) =>
              setSearchSkill(e.target.value)
            }
          />
        </div>
      </div>

      {searchSkill.trim() === "" ? (
        <div className="empty-card">
          <div>🔍</div>
          <h3>Search for a skill</h3>
          <p>
            Try searching for Python, Excel, design,
            communication or another skill.
          </p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="empty-card">
          <div>😕</div>
          <h3>No results found</h3>
          <p>
            We couldn't find a skill matching "
            {searchSkill}".
          </p>
        </div>
      ) : (
        <div className="search-results">
          {searchResults.map((skill) => (
            <div
              className="person-card"
              key={skill.id}
            >
              <div className="person-avatar">
                {profile.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="person-info">
                <h3>{profile.name}</h3>

                <p>
                  {skill.type === "offer"
                    ? "Can teach"
                    : "Wants to learn"}
                </p>

                <strong>{skill.name}</strong>
              </div>

              <button className="secondary-button">
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderProfile = () => (
    <>
      <div className="page-title">
        <h1>My Profile</h1>
        <p>
          Manage your personal information.
        </p>
      </div>

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar-large">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <h2>{profile.name}</h2>
          <p>{profile.email}</p>

          <div className="profile-stats">
            <div>
              <strong>{skills.length}</strong>
              <span>Skills</span>
            </div>

            <div>
              <strong>{matches.length}</strong>
              <span>Matches</span>
            </div>
          </div>
        </div>

        <div className="edit-profile-card">
          <div className="card-heading">
            <h2>Edit Profile</h2>
            <p>Update your account information.</p>
          </div>

          <form onSubmit={saveProfile}>
            <div className="dashboard-form-group">
              <label>Full Name</label>

              <input
                type="text"
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
              />
            </div>

            <div className="dashboard-form-group">
              <label>Email Address</label>

              <input
                type="email"
                value={editEmail}
                onChange={(e) =>
                  setEditEmail(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          Skill<span>Swap</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => goTo("dashboard")}
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className={
              activePage === "skills"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => goTo("skills")}
          >
            <span>🎯</span>
            My Skills
          </button>

          <button
            className={
              activePage === "matches"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => goTo("matches")}
          >
            <span>🤝</span>
            Matches
          </button>

          <button
            className={
              activePage === "find"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => goTo("find")}
          >
            <span>🔎</span>
            Find People
          </button>

          <button
            className={
              activePage === "profile"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => goTo("profile")}
          >
            <span>👤</span>
            My Profile
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {profile.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{profile.name}</strong>
              <small>SkillSwap Member</small>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Log Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span>SkillSwap Platform</span>
          </div>

          <button
            className="header-profile"
            onClick={() => goTo("profile")}
          >
            <div className="header-avatar">
              {profile.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{profile.name}</strong>
              <small>View profile</small>
            </div>
          </button>
        </header>

        <div className="dashboard-content">
          {activePage === "dashboard" &&
            renderDashboard()}

          {activePage === "skills" &&
            renderSkills()}

          {activePage === "matches" &&
            renderMatches()}

          {activePage === "find" &&
            renderFindPeople()}

          {activePage === "profile" &&
            renderProfile()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;