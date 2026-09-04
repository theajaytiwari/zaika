import React, { useEffect, useState } from "react";
import { Plus, X, UtensilsCrossed, MapPin, UploadCloud } from "lucide-react";
import { fetchMyFoodPartnerProfile, createFoodItem } from "../../api/foodApi";

export default function FoodHome() {
  const [partner, setPartner] = useState(null);
  const [error, setError] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState(null);

  const loadProfile = () => {
    fetchMyFoodPartnerProfile()
      .then(setPartner)
      .catch(() => setError(true));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="fh-root">
      <style>{`
        .fh-root {
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
        .fh-page {
          width: 100%;
          max-width: 720px;
          min-height: 100dvh;
          padding-bottom: 60px;
        }
        .fh-cover {
          height: 130px;
          background: linear-gradient(120deg, #3a220a 0%, #a85d10 45%, #f2a93b 85%);
          position: relative;
        }
        .fh-identity {
          padding: 0 24px;
          margin-top: -46px;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .fh-avatar {
          width: 84px;
          height: 84px;
          flex-shrink: 0;
          border-radius: 999px;
          border: 4px solid var(--void);
          background: linear-gradient(135deg, var(--turmeric), var(--chilli));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 30px;
          color: #241a10;
        }
        .fh-badges {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 40px;
        }
        .fh-name-badge, .fh-address-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .fh-name-badge { background: var(--turmeric); color: #241a10; font-size: 15px; }
        .fh-address-badge {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--ink-dim);
          font-weight: 600;
        }
        .fh-owner {
          font-size: 13.5px;
          color: var(--ink-dim);
          margin: 12px 0 0;
          padding: 0 24px;
        }
        .fh-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px 14px;
        }
        .fh-stat-pill {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink-dim);
        }
        .fh-stat-pill strong { color: var(--ink); font-weight: 700; }
        .fh-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--turmeric);
          color: #241a10;
          border: none;
          border-radius: 999px;
          padding: 9px 16px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }
        .fh-section-title {
          padding: 0 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--ink-dim);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 12px;
        }
        .fh-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3px;
          padding: 0 3px;
        }
        .fh-cell {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: var(--card);
        }
        .fh-cell video { width: 100%; height: 100%; object-fit: cover; }
        .fh-cell-scrim {
          position: absolute;
          inset: auto 0 0 0;
          height: 55%;
          background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
          padding: 8px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .fh-cell-name {
          font-size: 12px;
          font-weight: 700;
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .fh-cell-price { font-size: 11px; font-weight: 700; color: var(--turmeric); margin-top: 3px; }
        .fh-empty, .fh-loading, .fh-error {
          padding: 60px 24px;
          text-align: center;
          color: var(--ink-dim);
          font-size: 14px;
        }

        /* Upload modal */
        .fh-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .fh-modal {
          width: 100%;
          max-width: 380px;
          background: var(--card);
          border-radius: 20px;
          padding: 22px;
          position: relative;
        }
        .fh-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 999px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          cursor: pointer;
        }
        .fh-modal-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 18px;
        }
        .fh-field { margin-bottom: 14px; }
        .fh-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink-dim);
          margin-bottom: 6px;
        }
        .fh-input, .fh-textarea {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 12px;
          color: var(--ink);
          font-size: 13.5px;
          font-family: inherit;
        }
        .fh-textarea { resize: vertical; min-height: 60px; }
        .fh-file-label {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          border: 1.5px dashed rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 16px;
          font-size: 13px;
          color: var(--ink-dim);
          cursor: pointer;
        }
        .fh-file-label input { display: none; }
        .fh-submit-btn {
          width: 100%;
          background: var(--turmeric);
          color: #241a10;
          border: none;
          border-radius: 12px;
          padding: 12px 0;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          margin-top: 6px;
        }
        .fh-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .fh-form-error { color: var(--chilli); font-size: 12.5px; margin-bottom: 10px; }

        .fh-toast {
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

      <div className="fh-page">
        {error && <p className="fh-error">Profile load nahi ho paayi. Dobara try karo.</p>}
        {!error && !partner && <p className="fh-loading">Loading…</p>}

        {partner && (
          <>
            <div className="fh-cover" />
            <div className="fh-identity">
              <div className="fh-avatar">{partner.restaurantName?.charAt(0)?.toUpperCase()}</div>
              <div className="fh-badges">
                <span className="fh-name-badge">{partner.restaurantName}</span>
                {partner.address && (
                  <span className="fh-address-badge">
                    <MapPin size={12} /> {partner.address}
                  </span>
                )}
              </div>
            </div>
            <p className="fh-owner">Owner: {partner.ownerName}</p>

            <div className="fh-toolbar">
              <span className="fh-stat-pill">
                <strong>{partner.totalVideos}</strong> dishes posted
              </span>
              <button className="fh-add-btn" onClick={() => setShowUpload(true)}>
                <Plus size={15} /> Add new dish
              </button>
            </div>

            <p className="fh-section-title">Your dishes</p>

            {partner.foodItems?.length ? (
              <div className="fh-grid">
                {partner.foodItems.map((item) => (
                  <div key={item._id} className="fh-cell">
                    {item.video ? (
                      <video src={item.video} muted loop autoPlay playsInline preload="metadata" />
                    ) : (
                      <UtensilsCrossed style={{ margin: "auto", opacity: 0.2 }} />
                    )}
                    <div className="fh-cell-scrim">
                      <div className="fh-cell-name">{item.name}</div>
                      {item.price != null && <div className="fh-cell-price">₹{item.price}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                            <p className="fh-empty">No dishes posted yet. Tap "Add new dish" to get started.</p>
            )}
          </>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={() => {
            setShowUpload(false);
            showToast("Dish posted!");
            loadProfile();
          }}
        />
      )}

      {toast && <div className="fh-toast">{toast}</div>}
    </div>
  );
}

function UploadModal({ onClose, onUploaded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [video, setVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !video) {
      setFormError("Name, price aur video — teeno zaroori hain.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("video", video);
      await createFoodItem(formData);
      onUploaded();
    } catch {
      setFormError("Upload fail ho gaya, dobara try karo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fh-modal-backdrop" onClick={onClose}>
      <div className="fh-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fh-modal-close" onClick={onClose} aria-label="Close">
          <X size={15} />
        </button>
        <h3 className="fh-modal-title">Add new dish</h3>

        <form onSubmit={handleSubmit}>
          {formError && <div className="fh-form-error">{formError}</div>}

          <div className="fh-field">
            <label className="fh-label">Dish name</label>
            <input
              className="fh-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cheese Burst Burger"
            />
          </div>

          <div className="fh-field">
            <label className="fh-label">Description</label>
            <textarea
              className="fh-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kya khaas hai isme?"
            />
          </div>

          <div className="fh-field">
            <label className="fh-label">Price (₹)</label>
            <input
              className="fh-input"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="199"
            />
          </div>

          <div className="fh-field">
            <label className="fh-label">Video</label>
            <label className="fh-file-label">
              <UploadCloud size={16} />
              {video ? video.name : "Video select karo"}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button className="fh-submit-btn" type="submit" disabled={submitting}>
            {submitting ? "Uploading…" : "Post dish"}
          </button>
        </form>
      </div>
    </div>
  );
}
