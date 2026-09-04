import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, LogOut, Pencil, UserRound } from "lucide-react";
import { fetchMyUserProfile, logoutUser } from "../../api/userApi";


export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchMyUserProfile()
      .then(setUser)
      .catch(() => setError(true));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // even if the API call fails, still send them to login
    } finally {
      navigate("/user/login");
    }
  };

  return (
    <div className="up-root">
      <style>{`
        .up-root {
          --ink: #f7f3ea;
          --ink-dim: rgba(247,243,234,0.65);
          --turmeric: #f2a93b;
          --chilli: #e1502e;
          --void: #0a0a0a;
          --card: #161514;
          min-height: 100dvh;
          background: var(--void);
          color: var(--ink);
          font-family: 'Inter', -apple-system, sans-serif;
          display: flex;
          justify-content: center;
        }
        .up-page {
          width: 100%;
          max-width: 480px;
          min-height: 100dvh;
          padding-bottom: 40px;
        }
        .up-back {
          position: sticky;
          top: 0;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin: 16px 0 0 16px;
          background: rgba(20,20,20,0.7);
          backdrop-filter: blur(6px);
          border: none;
          color: var(--ink);
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .up-cover {
          height: 150px;
          margin-top: -34px;
          background: linear-gradient(125deg, #3a220a 0%, #a85d10 50%, #f2a93b 90%);
          position: relative;
          overflow: hidden;
        }
        .up-cover::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 20%, rgba(255,255,255,0.15), transparent 55%);
        }
        .up-identity {
          padding: 0 24px;
          margin-top: -50px;
          position: relative;
          z-index: 2;
          text-align: center;
        }
        .up-avatar {
          width: 96px;
          height: 96px;
          margin: 0 auto;
          border-radius: 999px;
          border: 4px solid var(--void);
          background: linear-gradient(135deg, var(--turmeric), var(--chilli));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 34px;
          color: #241a10;
        }
        .up-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 22px;
          font-weight: 700;
          margin: 14px 0 4px;
        }
        .up-tagline {
          font-size: 13px;
          color: var(--ink-dim);
          margin: 0 0 18px;
        }
        .up-edit-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          color: var(--ink);
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 28px;
        }
        .up-card {
          margin: 0 20px 16px;
          background: var(--card);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .up-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px 18px;
        }
        .up-row + .up-row {
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .up-row-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(242,169,59,0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .up-row-label {
          font-size: 11.5px;
          color: var(--ink-dim);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 2px;
        }
        .up-row-value {
          font-size: 14px;
          font-weight: 600;
        }
        .up-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: calc(100% - 40px);
          margin: 22px 20px 0;
          background: rgba(225,80,46,0.12);
          border: 1px solid rgba(225,80,46,0.35);
          color: var(--chilli);
          border-radius: 14px;
          padding: 13px 0;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }
        .up-logout-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .up-loading, .up-error {
          padding: 60px 24px;
          text-align: center;
          color: var(--ink-dim);
          font-size: 14px;
        }
        .up-toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(20,20,20,0.92);
          color: var(--ink);
          font-size: 13px;
          font-weight: 600;
          padding: 9px 16px;
          border-radius: 999px;
          z-index: 20;
        }
      `}</style>

      <div className="up-page">
        <button className="up-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back
        </button>

        {error && <p className="up-error">Couldn't load your profile. Try again in a bit.</p>}
        {!error && !user && <p className="up-loading">Loading profile…</p>}

        {user && (
          <>
            <div className="up-cover" />
            <div className="up-identity">
              <div className="up-avatar">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : <UserRound size={30} />}
              </div>
              <h1 className="up-name">{user.fullName}</h1>
              <p className="up-tagline">Zaika member</p>
              <button className="up-edit-btn" onClick={() => showToast("Editing coming soon")}>
                <Pencil size={13} /> Edit profile
              </button>
            </div>

            <div className="up-card">
              <div className="up-row">
                <div className="up-row-icon">
                  <Mail size={16} color="#f2a93b" />
                </div>
                <div>
                  <div className="up-row-label">Email</div>
                  <div className="up-row-value">{user.email}</div>
                </div>
              </div>
              {user.phoneNumber && (
                <div className="up-row">
                  <div className="up-row-icon">
                    <Phone size={16} color="#f2a93b" />
                  </div>
                  <div>
                    <div className="up-row-label">Phone</div>
                    <div className="up-row-value">{user.phoneNumber}</div>
                  </div>
                </div>
              )}
            </div>

            <button className="up-logout-btn" onClick={handleLogout} disabled={loggingOut}>
              <LogOut size={16} />
              {loggingOut ? "Logging out…" : "Log out"}
            </button>
          </>
        )}
      </div>

      {toast && <div className="up-toast">{toast}</div>}
    </div>
  );
}
