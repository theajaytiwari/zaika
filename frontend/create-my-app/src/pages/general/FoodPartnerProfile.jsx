import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  ShoppingBag,
  X,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";
import { fetchFoodPartnerProfile } from "../../api/foodApi";

export default function FoodPartnerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [error, setError] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchFoodPartnerProfile(id)
      .then((data) => {
        if (!cancelled) setPartner(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="fpp-root">
      <style>{`
        .fpp-root {
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
        .fpp-page {
          width: 100%;
          max-width: 720px;
          min-height: 100dvh;
          padding-bottom: 40px;
        }
        .fpp-back {
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
        .fpp-cover {
          height: 130px;
          margin-top: -34px;
          background: linear-gradient(120deg, #3a220a 0%, #a85d10 45%, #f2a93b 85%);
          position: relative;
        }
        .fpp-cover::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), transparent 60%);
        }
        .fpp-identity {
          padding: 0 24px;
          margin-top: -46px;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .fpp-avatar {
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
        .fpp-badges {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 40px;
        }
        .fpp-name-badge, .fpp-address-badge {
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
        .fpp-name-badge {
          background: var(--turmeric);
          color: #241a10;
          font-size: 15px;
        }
        .fpp-address-badge {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--ink-dim);
          font-weight: 600;
        }
        .fpp-owner {
          font-size: 13.5px;
          color: var(--ink-dim);
          margin: 12px 0 0;
          padding: 0 24px;
        }
        .fpp-stats {
          display: flex;
          gap: 10px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .fpp-stat-pill {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink-dim);
        }
        .fpp-stat-pill strong {
          color: var(--ink);
          font-weight: 700;
        }
        .fpp-section-title {
          padding: 0 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--ink-dim);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 12px;
        }
        .fpp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3px;
          padding: 0 3px;
        }
        .fpp-cell {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          cursor: pointer;
          background: var(--card);
        }
        .fpp-cell video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fpp-cell-scrim {
          position: absolute;
          inset: auto 0 0 0;
          height: 55%;
          background: linear-gradient(to top, rgba(0,0,0,0.85), transparent);
          padding: 8px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .fpp-cell-name {
          font-size: 12px;
          font-weight: 700;
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .fpp-cell-price {
          font-size: 11px;
          font-weight: 700;
          color: var(--turmeric);
          margin-top: 3px;
        }
        .fpp-play-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0,0,0,0.4);
          border-radius: 999px;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fpp-empty, .fpp-loading, .fpp-error {
          padding: 60px 24px;
          text-align: center;
          color: var(--ink-dim);
          font-size: 14px;
        }

        /* Modal */
        .fpp-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .fpp-modal {
          width: 100%;
          max-width: 360px;
          background: var(--card);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .fpp-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          background: rgba(0,0,0,0.5);
          border: none;
          border-radius: 999px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          cursor: pointer;
        }
        .fpp-modal video {
          width: 100%;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          display: block;
        }
        .fpp-modal-body {
          padding: 18px 18px 22px;
        }
        .fpp-modal-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 6px;
        }
        .fpp-modal-desc {
          font-size: 13.5px;
          color: var(--ink-dim);
          margin: 0 0 16px;
          line-height: 1.4;
        }
        .fpp-modal-buy {
          width: 100%;
          background: var(--turmeric);
          color: #241a10;
          border: none;
          border-radius: 14px;
          padding: 13px 0;
          font-weight: 700;
          font-size: 14.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .fpp-toast {
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

      <div className="fpp-page">
        <button className="fpp-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back
        </button>

        {error && <p className="fpp-error">Couldn't load this profile. Try again in a bit.</p>}

        {!error && !partner && <p className="fpp-loading">Loading profile…</p>}

        {partner && (
          <>
            <div className="fpp-cover" />
            <div className="fpp-identity">
              <div className="fpp-avatar">{partner.restaurantName?.charAt(0)?.toUpperCase()}</div>
              <div className="fpp-badges">
                <span className="fpp-name-badge">{partner.restaurantName}</span>
                {partner.address && (
                  <span className="fpp-address-badge">
                    <MapPin size={12} /> {partner.address}
                  </span>
                )}
              </div>
            </div>
            <p className="fpp-owner">Owned by {partner.ownerName}</p>
            <div className="fpp-stats" style={{ padding: "0 24px", marginTop: 16 }}>
              <span className="fpp-stat-pill">
                <strong>{partner.totalVideos}</strong> total meals
              </span>
            </div>

            <p className="fpp-section-title">Menu reels</p>

            {partner.foodItems?.length ? (
              <div className="fpp-grid">
                {partner.foodItems.map((item) => (
                  <div key={item._id} className="fpp-cell" onClick={() => setActiveItem(item)}>
                    {item.video ? (
                      <video src={item.video} muted loop autoPlay playsInline preload="metadata" />
                    ) : (
                      <UtensilsCrossed style={{ margin: "auto", opacity: 0.2 }} />
                    )}
                    <div className="fpp-play-icon">
                      <Play size={11} fill="#fff" color="#fff" />
                    </div>
                    <div className="fpp-cell-scrim">
                      <div className="fpp-cell-name">{item.name}</div>
                      {item.price != null && <div className="fpp-cell-price">₹{item.price}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="fpp-empty">No dishes posted yet.</p>
            )}
          </>
        )}
      </div>

      {activeItem && (
        <div className="fpp-modal-backdrop" onClick={() => setActiveItem(null)}>
          <div className="fpp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fpp-modal-close" onClick={() => setActiveItem(null)} aria-label="Close">
              <X size={16} />
            </button>
            {activeItem.video && (
              <video src={activeItem.video} autoPlay loop controls playsInline />
            )}
            <div className="fpp-modal-body">
              <h3 className="fpp-modal-title">{activeItem.name}</h3>
              {activeItem.description && <p className="fpp-modal-desc">{activeItem.description}</p>}
              <button
                className="fpp-modal-buy"
                onClick={() => showToast("Order flow coming soon")}
              >
                <ShoppingBag size={16} />
                {activeItem.price != null ? `₹${activeItem.price} · Buy Now` : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fpp-toast">{toast}</div>}
    </div>
  );
}