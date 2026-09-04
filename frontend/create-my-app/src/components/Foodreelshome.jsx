import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";



import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  BadgeCheck,
  UtensilsCrossed,
  UserRound,
} from "lucide-react";

/**
 * FoodReelsHome
 * ---------------------------------------------------------------
 * A vertical, swipe-through video feed (Instagram Reels style) for
 * a food-ordering app. Tap a dish's price pill to open a buy sheet
 * and check out without leaving the feed.
 *
 * HOOKING THIS UP TO A REAL BACKEND
 * - Replace SAMPLE_DISHES with dishes fetched from your API
 *   (each item needs the same shape — see the type comment below).
 * - Give each item a real `videoUrl` (e.g. an S3/Cloudinary link).
 *   When `videoUrl` is empty, the component falls back to a
 *   gradient placeholder so the UI still works before videos exist.
 * - `onAddToCart` / `onBuyNow` are stub handlers below — wire them
 *   to your cart context and payment/checkout route.
 *
 * Dish shape:
 * {
 *   id, restaurant, verified, dishName, caption, price,
 *   likes, comments, gradient, videoUrl
 * }
 */


const SAMPLE_DISHES = [
  {
    id: "d1",
    restaurant: "The Breakfast Table",
    verified: true,
    dishName: "Pancake Stack",
    caption: "Fluffy triple stack, real maple syrup, butter that melts on contact.",
    price: 149,
    likes: 2840,
    comments: 96,
    foodPartnerId: "sample-partner-id",
    gradient: "linear-gradient(165deg, #5c3612 0%, #c48a2c 55%, #f2c14e 100%)",
    videoUrl: "https://ik.imagekit.io/sx8skx87f/f389f761-1479-4a75-8cce-e7165319d11b_CPqlKhUms",
  },
  {
    id: "d2",
    restaurant: "Grill & Chill",
    verified: true,
    dishName: "Seafood Platter",
    caption: "prawns/shrimp, vegetables aur sides ke saath",
    price: 219,
    likes: 5120,
    comments: 214,
    foodPartnerId: "sample-partner-id-2",
    gradient: "linear-gradient(165deg, #2b0f0a 0%, #7a1f12 55%, #e2531f 100%)",
    videoUrl: "https://ik.imagekit.io/sx8skx87f/cc7af3f5-3e95-4864-b2f7-4101b09e96a9_jC70nkz3U",
  },
  {
    id: "d3",
    restaurant: "Berger Junction",
    verified: false,
    dishName: "Burger",
    caption: "likely Cheeseburger",
    price: 259,
    likes: 9040,
    comments: 341,
    foodPartnerId: "sample-partner-id-3",
    gradient: "linear-gradient(165deg, #3a220a 0%, #a85d10 55%, #f2a93b 100%)",
    videoUrl: "https://ik.imagekit.io/sx8skx87f/cda2acff-f6f8-4748-9124-3391b53ef7b5_i_7-cLpR2",
  },
  {
    id: "d4",
    restaurant: "Momo Magic",
    verified: true,
    dishName: "Grilled Fish / Fish Fillet",
    caption: " vegetables/garnish ke saath, served with a side of tangy sauce.",
    price: 99,
    likes: 1670,
    comments: 58,
    foodPartnerId: "sample-partner-id-4",
    gradient: "linear-gradient(165deg, #1c1c1c 0%, #3a3a3a 55%, #c94f3f 100%)",
    videoUrl: "https://ik.imagekit.io/sx8skx87f/f389f761-1479-4a75-8cce-e7165319d11b_CPqlKhUms",
  },
  {
    id: "d5",
    restaurant: "Pizza Bros",
    verified: false,
    dishName: "Cake / Tart",
    caption: "likely Fruit Tart / Custard Tart",
    price: 329,
    likes: 6210,
    comments: 187,
    foodPartnerId: "sample-partner-id-5",
    gradient: "linear-gradient(165deg, #350c07 0%, #a3311c 55%, #f2c14e 100%)",
    videoUrl: "https://ik.imagekit.io/sx8skx87f/f389f761-1479-4a75-8cce-e7165319d11b_CPqlKhUms",
  },
];

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  return String(n);
}

export default function FoodReelsHome({
  dishes = SAMPLE_DISHES,
  onAddToCart = () => {},
  onBuyNow = () => {},
}) {
  
  const [activeId, setActiveId] = useState(dishes[0]?.id);
  const [muted, setMuted] = useState(true);
  const [likedIds, setLikedIds] = useState(() => new Set());
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [cartCount, setCartCount] = useState(0);
  const [bursts, setBursts] = useState([]); // double-tap heart bursts
  const [sheetItem, setSheetItem] = useState(null); // dish shown in buy sheet
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const slideRefs = useRef({});
  const lastTapRef = useRef({});
  const toastTimerRef = useRef(null);

  // Track which slide is most visible so we know which "video" is active.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActiveId(entry.target.dataset.id);
          }
        });
      },
      { root, threshold: [0, 0.6, 1] }
    );
    Object.values(slideRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [dishes]);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const toggleLike = useCallback((id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSave = useCallback(
    (id) => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          showToast("Saved");
        }
        return next;
      });
    },
    [showToast]
  );

  const spawnBurst = useCallback((id) => {
    const burstId = `${id}-${Date.now()}`;
    setBursts((prev) => [...prev, { id: burstId, dishId: id }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 700);
  }, []);

  const handleMediaTap = useCallback(
    (id) => {
      const now = Date.now();
      const last = lastTapRef.current[id] || 0;
      if (now - last < 300) {
        if (!likedIds.has(id)) toggleLike(id);
        spawnBurst(id);
      }
      lastTapRef.current[id] = now;
    },
    [likedIds, toggleLike, spawnBurst]
  );

  const openBuySheet = (dish) => {
    setSheetItem(dish);
    setQuantity(1);
  };

  const closeBuySheet = () => setSheetItem(null);

  const handleAddToCart = () => {
    if (!sheetItem) return;
    setCartCount((c) => c + quantity);
    onAddToCart(sheetItem, quantity);
    showToast("Added to cart");
    closeBuySheet();
  };

  const handleBuyNow = () => {
    if (!sheetItem) return;
    onBuyNow(sheetItem, quantity);
    showToast("Placing your order…");
    closeBuySheet();
  };

  
  return (
    <div className="frh-root">
      <style>{`
        .frh-root {
          --ink: #f7f3ea;
          --ink-dim: rgba(247,243,234,0.72);
          --turmeric: #f2a93b;
          --chilli: #e1502e;
          --void: #0a0a0a;
          --sheet-bg: #faf6ee;
          --sheet-ink: #241a10;
          font-family: 'Inter', -apple-system, sans-serif;
          width: 100%;
          min-height: 100dvh;
          background: #050505;
          display: flex;
          justify-content: center;
        }
        .frh-phone {
          position: relative;
          width: 100%;
          max-width: 460px;
          height: 100dvh;
          background: var(--void);
          overflow: hidden;
          box-shadow: 0 0 60px rgba(0,0,0,0.5);
        }
        .frh-feed {
          height: 100%;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
        }
        .frh-feed::-webkit-scrollbar { display: none; }
        .frh-slide {
          position: relative;
          height: 100%;
          scroll-snap-align: start;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }
        .frh-media {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .frh-media video, .frh-media .frh-placeholder {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .frh-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: frh-breathe 9s ease-in-out infinite alternate;
        }
        .frh-placeholder svg {
          width: 30%;
          height: 30%;
          color: rgba(255,255,255,0.16);
        }
        @keyframes frh-breathe {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .frh-scrim-top {
          position: absolute; inset: 0 0 auto 0; height: 26%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent);
          pointer-events: none;
        }
        .frh-scrim-bottom {
          position: absolute; inset: auto 0 0 0; height: 55%;
          background: linear-gradient(to top, rgba(0,0,0,0.82), transparent);
          pointer-events: none;
        }
        .frh-tap-layer {
          position: absolute; inset: 0; z-index: 1;
        }
        .frh-topbar {
          position: absolute; top: 0; left: 0; right: 0; z-index: 3;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 16px 0;
        }
        .frh-logo {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 16px;
          color: var(--turmeric);
          letter-spacing: 0.01em;
        }

        .frh-tabs { display: flex; gap: 18px; }
        .frh-tab {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          font-size: 15px; font-weight: 600;
          color: rgba(255,255,255,0.55);
          background: none; border: none; padding: 4px 0; cursor: pointer;
        }
        .frh-tab.active { color: var(--ink); border-bottom: 2px solid var(--ink); }
        .frh-cart-btn {
          position: relative;
          background: rgba(255,255,255,0.14);
          border: none; border-radius: 999px;
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          color: var(--ink); cursor: pointer;
        }
        .frh-cart-badge {
          position: absolute; top: -4px; right: -4px;
          background: var(--chilli); color: white;
          font-size: 10px; font-weight: 700;
          border-radius: 999px; min-width: 16px; height: 16px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
        }
        .frh-rail {
          position: absolute; right: 12px; bottom: 132px; z-index: 3;
          display: flex; flex-direction: column; align-items: center; gap: 20px;
        }
        .frh-rail-btn {
          background: none; border: none; color: var(--ink);
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          cursor: pointer; font-size: 12px; font-weight: 600;
        }
        .frh-rail-btn svg { filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4)); }
        .frh-avatar {
          width: 42px; height: 42px; border-radius: 999px;
          background: linear-gradient(135deg, var(--turmeric), var(--chilli));
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; color: #1a1006; font-size: 15px;
          border: 2px solid var(--ink); margin-bottom: 6px;
        }
        .frh-content {
          position: relative; z-index: 2;
          padding: 0 84px 26px 16px;
          width: 100%;
        }
        .frh-restaurant {
          display: flex; align-items: center; gap: 6px;
          color: var(--ink); font-weight: 600; font-size: 14px; margin-bottom: 6px;
        }
        .frh-dish-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 22px; font-weight: 700; color: var(--ink);
          line-height: 1.2; margin: 0 0 6px;
        }

        .frh-profile-fab {
          position: absolute;
          right: 14px;
          bottom: 26px;
          z-index: 3;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: rgba(0,0,0,0.4);
          border: 1.5px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .frh-caption {
          color: var(--ink-dim); font-size: 13.5px; line-height: 1.4;
          margin: 0 0 14px; max-width: 30ch;
        }
        .frh-price-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--turmeric); color: #241a10;
          border: none; border-radius: 999px;
          padding: 10px 18px; font-weight: 700; font-size: 14.5px;
          cursor: pointer;
          animation: frh-pulse 2.6s ease-in-out infinite;
        }
        @keyframes frh-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(242,169,59,0.5); }
          50% { transform: scale(1.045); box-shadow: 0 0 0 8px rgba(242,169,59,0); }
        }
        .frh-price-pill:focus-visible, .frh-rail-btn:focus-visible, .frh-tab:focus-visible, .frh-cart-btn:focus-visible {
          outline: 2px solid var(--ink); outline-offset: 3px;
        }
        .frh-mute-btn {
          position: absolute; top: 20px; right: 16px; z-index: 3;
          background: rgba(0,0,0,0.35); border: none; border-radius: 999px;
          width: 34px; height: 34px; color: var(--ink);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .frh-burst {
          position: absolute; left: 50%; top: 42%; z-index: 4;
          transform: translate(-50%, -50%) scale(0);
          animation: frh-burst-pop 0.7s ease-out forwards;
          pointer-events: none;
        }
        @keyframes frh-burst-pop {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          30% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }

        /* Buy sheet */
        .frh-sheet-backdrop {
          position: absolute; inset: 0; z-index: 5;
          background: rgba(0,0,0,0.45);
        }
        .frh-sheet {
          position: absolute; left: 0; right: 0; bottom: 0; z-index: 6;
          background: var(--sheet-bg); color: var(--sheet-ink);
          border-radius: 22px 22px 0 0;
          padding: 10px 20px 26px;
          animation: frh-sheet-up 0.28s ease-out;
        }
        @keyframes frh-sheet-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .frh-sheet-handle {
          width: 40px; height: 4px; border-radius: 999px;
          background: rgba(36,26,16,0.2); margin: 6px auto 16px;
        }
        .frh-sheet-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .frh-sheet-swatch {
          width: 56px; height: 56px; border-radius: 14px; flex-shrink: 0;
        }
        .frh-sheet-close {
          background: rgba(36,26,16,0.08); border: none; border-radius: 999px;
          width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--sheet-ink);
        }
        .frh-sheet-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 18px; margin: 12px 0 2px; }
        .frh-sheet-sub { font-size: 13px; color: rgba(36,26,16,0.6); margin: 0 0 18px; }
        .frh-qty-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .frh-qty-label { font-size: 14px; font-weight: 600; }
        .frh-qty-control { display: flex; align-items: center; gap: 14px; }
        .frh-qty-btn {
          width: 32px; height: 32px; border-radius: 999px; border: none;
          background: var(--turmeric); color: #241a10;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .frh-qty-value { font-weight: 700; min-width: 18px; text-align: center; }
        .frh-sheet-actions { display: flex; gap: 10px; }
        .frh-btn-outline, .frh-btn-fill {
          flex: 1; border-radius: 14px; padding: 14px 0; font-weight: 700;
          font-size: 14.5px; cursor: pointer; border: none;
        }
        .frh-btn-outline {
          background: transparent; border: 1.5px solid rgba(36,26,16,0.25); color: var(--sheet-ink);
        }
        .frh-btn-fill { background: var(--chilli); color: #fff8f2; }

        .frh-toast {
          position: absolute; top: 66px; left: 50%; z-index: 8;
          transform: translateX(-50%);
          background: rgba(20,20,20,0.9); color: var(--ink);
          font-size: 13px; font-weight: 600;
          padding: 9px 16px; border-radius: 999px;
        }

        @media (prefers-reduced-motion: reduce) {
          .frh-placeholder, .frh-price-pill, .frh-burst { animation: none !important; }
        }
      `}</style>

      <div className="frh-phone">
        {/* Top bar */}
        <div className="frh-topbar">
          <span className="frh-logo">Zaika</span>
          <div className="frh-tabs">
            <button className="frh-tab active">For You</button>
            <button className="frh-tab">Following</button>
          </div>
          <button className="frh-cart-btn" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="frh-cart-badge">{cartCount}</span>}
          </button>
        </div>

        {/* Mute toggle applies to whichever slide is active */}
        <button
          className="frh-mute-btn"
          style={{ top: 62 }}
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <div className="frh-feed" ref={containerRef}>
          {dishes.map((dish) => {
            const isActive = dish.id === activeId;
            const liked = likedIds.has(dish.id);
            const saved = savedIds.has(dish.id);
            const burst = bursts.find((b) => b.dishId === dish.id);

            return (
              <section
                key={dish.id}
                className="frh-slide"
                data-id={dish.id}
                ref={(el) => (slideRefs.current[dish.id] = el)}
              >
                <div className="frh-media">
                  {dish.videoUrl ? (
                    <video
                      src={dish.videoUrl}
                      autoPlay={isActive}
                      muted={muted}
                      loop
                      playsInline
                    />
                  ) : (
                    <div className="frh-placeholder" style={{ background: dish.gradient }}>
                      <UtensilsCrossed strokeWidth={1.2} />
                    </div>
                  )}
                </div>

                <div className="frh-scrim-top" />
                <div className="frh-scrim-bottom" />
                <div
                  className="frh-tap-layer"
                  onClick={() => handleMediaTap(dish.id)}
                  role="presentation"
                />

                {burst && (
                  <div className="frh-burst">
                    <Heart size={92} fill="#e1502e" color="#e1502e" />
                  </div>
                )}

                {/* Right action rail */}
                <div className="frh-rail">
                  <div className="frh-avatar">{dish.restaurant.charAt(0)}</div>
                  <button
                    className="frh-rail-btn"
                    onClick={() => toggleLike(dish.id)}
                    aria-label="Like"
                  >
                    <Heart
                      size={27}
                      fill={liked ? "#e1502e" : "none"}
                      color={liked ? "#e1502e" : "#f7f3ea"}
                    />
                    {formatCount(dish.likes + (liked ? 1 : 0))}
                  </button>
                  <button
                    className="frh-rail-btn"
                    onClick={() => showToast("Comments coming soon")}
                    aria-label="Comments"
                  >
                    <MessageCircle size={26} color="#f7f3ea" />
                    {formatCount(dish.comments)}
                  </button>
                  <button
                    className="frh-rail-btn"
                    onClick={() => showToast("Link copied")}
                    aria-label="Share"
                  >
                    <Send size={24} color="#f7f3ea" />
                    Share
                  </button>
                  <button
                    className="frh-rail-btn"
                    onClick={() => toggleSave(dish.id)}
                    aria-label="Save"
                  >
                    <Bookmark size={24} fill={saved ? "#f7f3ea" : "none"} color="#f7f3ea" />
                    Save
                  </button>
                  
                                </div>

                <button
                  className="frh-profile-fab"
                  onClick={() => navigate("/profile")}
                  aria-label="Your profile"
                >
                  <UserRound size={20} color="#f7f3ea" />
                </button>

                {/* Bottom caption + buy pill */}
                                <div className="frh-content">
                  <div
                    className="frh-restaurant"
                    onClick={() => {
                      if (dish.foodPartnerId) {
                        navigate(`/food-partner/${dish.foodPartnerId}`);
                      } else {
                        showToast("Partner profile not available");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {dish.restaurant}
                    {dish.verified && <BadgeCheck size={15} color="#f2a93b" />}
                  </div>
                  <h2 className="frh-dish-name">{dish.dishName}</h2>
                  <p className="frh-caption">{dish.caption}</p>
                  <button className="frh-price-pill" onClick={() => openBuySheet(dish)}>
                    <ShoppingBag size={16} />
                    ₹{dish.price} · Buy Now
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        {/* Buy sheet */}
        {sheetItem && (
          <>
            <div className="frh-sheet-backdrop" onClick={closeBuySheet} />
            <div className="frh-sheet" role="dialog" aria-label="Order dish">
              <div className="frh-sheet-handle" />
              <div className="frh-sheet-header">
                <div className="frh-sheet-swatch" style={{ background: sheetItem.gradient }} />
                <button className="frh-sheet-close" onClick={closeBuySheet} aria-label="Close">
                  <X size={16} />
                </button>
              </div>
              <h3 className="frh-sheet-title">{sheetItem.dishName}</h3>
              <p className="frh-sheet-sub">{sheetItem.restaurant} · ₹{sheetItem.price} each</p>

              <div className="frh-qty-row">
                <span className="frh-qty-label">Quantity</span>
                <div className="frh-qty-control">
                  <button
                    className="frh-qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="frh-qty-value">{quantity}</span>
                  <button
                    className="frh-qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="frh-sheet-actions">
                <button className="frh-btn-outline" onClick={handleAddToCart}>
                  Add to cart
                </button>
                <button className="frh-btn-fill" onClick={handleBuyNow}>
                  Buy now · ₹{sheetItem.price * quantity}
                </button>
              </div>
            </div>
          </>
        )}

        {toast && <div className="frh-toast">{toast}</div>}
      </div>
    </div>
  );
}
