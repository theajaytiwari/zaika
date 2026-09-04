import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, CircleUserRound, Compass, Heart, MapPin, Minus, Package, Play, Plus, Search, ShoppingBag, Sparkles, Star, Store, Trash2, Upload, UtensilsCrossed, X } from "lucide-react";
import { api, isDatabaseId } from "./lib/api";
import { CATEGORIES, DEMO_REELS } from "./data/demo";
import "./App.css";

const rupee = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const date = (value) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

function saved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

function App() {
  const [session, setSession] = useState(() => saved("zaika-session", null));
  const [cart, setCart] = useState(() => saved("zaika-cart", []));
  const [reels, setReels] = useState(DEMO_REELS);
  const [usingDemo, setUsingDemo] = useState(true);

  useEffect(() => { localStorage.setItem("zaika-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    api.listFood().then((items) => {
      if (items.length) { setReels(items); setUsingDemo(false); }
    }).catch(() => setUsingDemo(true));
  }, []);

  const signIn = (nextSession) => {
    localStorage.setItem("zaika-session", JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const signOut = async () => {
    try { await api.logout(session?.role); } catch { /* clear local session either way */ }
    localStorage.removeItem("zaika-session");
    setSession(null);
  };

  const addToCart = async (food) => {
    if (session?.role !== "user") return false;
    const id = food._id || food.id;
    setCart((current) => {
      const existing = current.find((item) => item.id === id);
      return existing ? current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { id, name: food.name, price: food.price, video: food.video, restaurantName: food.foodPartner?.restaurantName || "Zaika kitchen", quantity: 1 }];
    });
    if (isDatabaseId(id)) {
      try { await api.addCartItem(id); } catch { /* local cart keeps the interaction responsive */ }
    }
    return true;
  };

  const changeCart = async (id, quantity) => {
    setCart((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item));
    if (isDatabaseId(id) && session?.role === "user") {
      try {
        if (quantity < 1) await api.removeCartItem(id);
        else await api.changeCartItem(id, quantity);
      } catch { /* state stays local until next retry */ }
    }
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shared = { session, reels, usingDemo, cart, cartCount, cartTotal, signIn, signOut, addToCart, changeCart, setCart, setReels };

  return <BrowserRouter><Routes>
    <Route path="/" element={<Navigate to="/discover" replace />} />
    <Route path="/discover" element={<Discover {...shared} />} />
    <Route path="/user/login" element={<Auth mode="login" role="user" onSignIn={signIn} />} />
    <Route path="/user/register" element={<Auth mode="register" role="user" onSignIn={signIn} />} />
    <Route path="/food-partner/login" element={<Auth mode="login" role="partner" onSignIn={signIn} />} />
    <Route path="/food-partner/register" element={<Auth mode="register" role="partner" onSignIn={signIn} />} />
    <Route path="/login" element={<Navigate to="/user/login" replace />} />
    <Route path="/cart" element={<Cart {...shared} />} />
    <Route path="/checkout" element={<Checkout {...shared} />} />
    <Route path="/orders" element={<Orders {...shared} />} />
    <Route path="/restaurant/:id" element={<Restaurant {...shared} />} />
    <Route path="/partner/dashboard" element={<PartnerDashboard {...shared} />} />
    <Route path="*" element={<Navigate to="/discover" replace />} />
  </Routes></BrowserRouter>;
}

function Brand({ compact = false }) { return <Link className="brand" to="/discover"><span className="brand-mark">Z</span>{!compact && <span>zaika</span>}</Link>; }

function Header({ session, cartCount, onSignOut, back = false, title }) {
  const navigate = useNavigate();
  return <header className="topbar">
    <div className="topbar-inner">
      {back ? <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Go back"><ArrowLeft size={19} /></button> : <Brand />}
      {title && <strong className="page-title">{title}</strong>}
      <nav className="nav-actions">
        {session?.role === "user" && <Link className="cart-link" to="/cart"><ShoppingBag size={19} />{cartCount > 0 && <b>{cartCount}</b>}</Link>}
        {session ? <div className="account-menu"><Link to={session.role === "partner" ? "/partner/dashboard" : "/orders"}>{session.role === "partner" ? <Store size={18} /> : <CircleUserRound size={19} />}</Link><button onClick={onSignOut}>Log out</button></div> : <Link className="text-link" to="/user/login">Log in</Link>}
      </nav>
    </div>
  </header>;
}

function Discover({ session, reels, usingDemo, cartCount, addToCart, signOut }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [toast, setToast] = useState("");
  const [activeReel, setActiveReel] = useState(null);
  const filtered = reels.filter((food) => (category === "All" || food.category === category) && `${food.name} ${food.description} ${food.foodPartner?.restaurantName}`.toLowerCase().includes(query.toLowerCase()));
  const show = (message) => { setToast(message); window.setTimeout(() => setToast(""), 2000); };
  const add = async (food) => {
    if (session?.role !== "user") { navigate("/user/login", { state: { message: "Log in to add dishes to your bag." } }); return; }
    await addToCart(food); show(`${food.name} added to your bag`);
  };
  return <div className="app-shell feed-shell">
    <Header session={session} cartCount={cartCount} onSignOut={signOut} />
    <main>
      <section className="discover-hero">
        <div><p className="eyebrow"><Sparkles size={14} /> Food, in motion</p><h1>Scroll until<br /><em>you&rsquo;re hungry.</em></h1><p>Find the next thing you crave, one delicious reel at a time.</p></div>
        <div className="hero-orb"><UtensilsCrossed size={48} /></div>
      </section>
      <section className="discover-controls">
        <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes, kitchens…" /></label>
        <div className="chips">{CATEGORIES.map((item) => <button key={item} className={category === item ? "chip active" : "chip"} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </section>
      {usingDemo && <p className="demo-note">Showing the Zaika preview feed. Restaurant reels will appear here as partners publish them.</p>}
      <section className="reel-feed">{filtered.length ? filtered.map((food, index) => <Reel key={food._id} food={food} onOpen={() => setActiveReel(index)} onAdd={() => add(food)} onRestaurant={() => navigate(`/restaurant/${food.foodPartner?._id}`)} />) : <Empty icon={<Search />} title="Nothing delicious found" body="Try a broader search or another category." />}</section>
    </main>
    {activeReel !== null && <ReelViewer dishes={filtered} initialIndex={activeReel} onClose={() => setActiveReel(null)} onAdd={add} onOrderNow={async (food) => {
      if (session?.role !== "user") { setActiveReel(null); navigate("/user/login", { state: { message: "Log in to order directly from a reel." } }); return; }
      await addToCart(food);
      setActiveReel(null);
      navigate("/checkout");
    }} onRestaurant={(food) => { setActiveReel(null); navigate(`/restaurant/${food.foodPartner?._id}`); }} />}
    {toast && <div className="toast"><Check size={16} />{toast}</div>}
    <MobileNav cartCount={cartCount} />
  </div>;
}

function Reel({ food, onOpen, onAdd, onRestaurant }) {
  const [liked, setLiked] = useState(false);
  const [muted, setMuted] = useState(true);
  return <article className="reel-card">
    <div className="reel-media" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onOpen(); }} aria-label={`Open ${food.name} reel`}>
      {food.video ? <video src={food.video} autoPlay loop muted={muted} playsInline preload="metadata" /> : <div className="video-fallback"><UtensilsCrossed size={45} /></div>}
      <div className="reel-shade" />
      <button className="sound-toggle" onClick={(event) => { event.stopPropagation(); setMuted((value) => !value); }}>{muted ? "Sound off" : "Sound on"}</button>
      <div className="reel-actions"><button className={liked ? "round-action liked" : "round-action"} onClick={(event) => { event.stopPropagation(); setLiked((value) => !value); }}><Heart size={21} fill={liked ? "currentColor" : "none"} /><span>{Math.max(0, Number(food.likes || 0) + (liked ? 1 : 0)).toLocaleString("en-IN")}</span></button><button className="round-action" onClick={(event) => event.stopPropagation()}><BookmarkIcon /><span>Save</span></button></div>
      <div className="reel-copy"><button className="restaurant-button" onClick={(event) => { event.stopPropagation(); onRestaurant(); }}><span>{food.foodPartner?.restaurantName || "Zaika kitchen"}</span><Check size={13} /></button><h2>{food.name}</h2><p>{food.description}</p><div className="reel-footer"><span className="price">{rupee(food.price)}</span><button className="add-button" onClick={(event) => { event.stopPropagation(); onAdd(); }}><Plus size={17} /> Add</button></div></div>
    </div>
  </article>;
}

function ReelViewer({ dishes, initialIndex, onClose, onAdd, onOrderNow, onRestaurant }) {
  const feedRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [liked, setLiked] = useState(() => new Set());
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const target = feedRef.current?.children?.[initialIndex];
    target?.scrollIntoView({ block: "start" });
  }, [initialIndex]);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.62) setActiveIndex(Number(entry.target.dataset.index));
      });
    }, { root: feed, threshold: [0.62] });
    [...feed.children].forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [dishes]);

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const toggleLike = (id) => setLiked((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return <div className="reel-viewer" role="dialog" aria-modal="true" aria-label="Food reel viewer">
    <div className="viewer-shell">
      <button className="viewer-close" onClick={onClose} aria-label="Close reels"><X size={21} /></button>
      <div className="viewer-feed" ref={feedRef}>{dishes.map((food, index) => {
        const isLiked = liked.has(food._id);
        return <section className="viewer-slide" data-index={index} key={food._id}>
          {food.video ? <video src={food.video} autoPlay loop muted={muted} playsInline preload="metadata" /> : <div className="video-fallback"><UtensilsCrossed size={48} /></div>}
          <div className="viewer-shade" />
          <button className="viewer-sound" onClick={() => setMuted((value) => !value)}>{muted ? "Sound off" : "Sound on"}</button>
          <div className="viewer-actions"><button className={isLiked ? "viewer-action liked" : "viewer-action"} onClick={() => toggleLike(food._id)}><Heart size={25} fill={isLiked ? "currentColor" : "none"} /><span>{Math.max(0, Number(food.likes || 0) + (isLiked ? 1 : 0)).toLocaleString("en-IN")}</span></button><button className="viewer-action"><BookmarkIcon /><span>Save</span></button></div>
          <div className="viewer-copy"><button className="restaurant-button" onClick={() => onRestaurant(food)}>{food.foodPartner?.restaurantName || "Zaika kitchen"}<Check size={13} /></button><h2>{food.name}</h2><p>{food.description}</p><div className="viewer-order-row"><div><span>Starts at</span><strong>{rupee(food.price)}</strong></div><button className="viewer-add" onClick={() => onAdd(food)}><Plus size={17} /> Add</button><button className="viewer-order" onClick={() => onOrderNow(food)}>Order now</button></div></div>
        </section>;
      })}</div>
    </div>
  </div>;
}

function BookmarkIcon() { return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12v18l-6-4-6 4z" /></svg>; }

function MobileNav({ cartCount }) { return <nav className="mobile-nav"><Link to="/discover"><Compass size={20} />Discover</Link><Link to="/orders"><Package size={20} />Orders</Link><Link to="/cart"><span className="nav-bag"><ShoppingBag size={20} />{cartCount > 0 && <b>{cartCount}</b>}</span>Bag</Link></nav>; }

function Auth({ mode, role, onSignIn }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const partner = role === "partner";
  const fields = partner ? (mode === "register" ? [["restaurantName", "Restaurant name"], ["ownerName", "Owner name"], ["email", "Business email", "email"], ["address", "Restaurant address"], ["password", "Password", "password"]] : [["email", "Business email", "email"], ["password", "Password", "password"]]) : (mode === "register" ? [["fullName", "Your name"], ["email", "Email address", "email"], ["phoneNumber", "Phone number", "tel"], ["password", "Password", "password"]] : [["email", "Email address", "email"], ["password", "Password", "password"]]);
  const submit = async (event) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const endpoint = `${partner ? "food-partner" : "user"}/${mode}`;
      const result = await api.auth(endpoint, form);
      const profile = result.user || result.foodPartner;
      onSignIn({ role: result.role, profile });
      navigate(partner ? "/partner/dashboard" : "/discover");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return <div className="auth-page"><div className="auth-panel"><Link to="/discover"><Brand /></Link><div className="auth-copy"><p className="eyebrow">{partner ? "Partner with Zaika" : "Your next bite awaits"}</p><h1>{partner ? "Turn your best dishes into reels." : "Your feed knows good food."}</h1><p>{partner ? "Publish menu reels, manage your orders and build a hungry audience." : "Discover food that looks as good as it tastes—then order it in a tap."}</p><div className="auth-stat"><Play size={17} /><span>Reels-first discovery</span></div><div className="auth-stat"><ShoppingBag size={17} /><span>Order without leaving the feed</span></div></div></div><div className="form-panel"><Link className="back-link" to="/discover"><ArrowLeft size={16} /> Back to discovery</Link><div className="form-heading"><p className="eyebrow">{partner ? "Restaurant account" : "Zaika member"}</p><h2>{mode === "register" ? "Let’s get started" : "Welcome back"}</h2><p>{mode === "register" ? "A few details and your table is ready." : "Log in to save, order and track your favourites."}</p></div><form onSubmit={submit}>{fields.map(([name, label, type = "text"]) => <label className="form-field" key={name}>{label}<input required minLength={name === "password" ? 6 : undefined} type={type} value={form[name] || ""} onChange={(event) => setForm({ ...form, [name]: event.target.value })} placeholder={label} /></label>)}{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? "Please wait…" : mode === "register" ? "Create account" : "Log in"}<ChevronRight size={18} /></button></form><p className="switch-copy">{mode === "register" ? "Already with Zaika?" : "New to Zaika?"} <Link to={`/${partner ? "food-partner" : "user"}/${mode === "register" ? "login" : "register"}`}>{mode === "register" ? "Log in" : "Create an account"}</Link></p><div className="role-switch"><Link to={partner ? "/user/login" : "/food-partner/login"}>{partner ? "I want to order food" : "I run a restaurant"}</Link></div></div></div>;
}

function Cart({ session, cart, cartCount, cartTotal, changeCart, signOut }) {
  const navigate = useNavigate();
  if (session?.role !== "user") return <Navigate to="/user/login" replace />;
  return <div className="app-shell page-shell"><Header session={session} cartCount={cartCount} onSignOut={signOut} back title="Your bag" /><main className="content-width">{!cart.length ? <Empty icon={<ShoppingBag />} title="Your bag is waiting" body="Find a reel that makes you hungry and add it here." action={<Link className="primary-button" to="/discover">Explore food</Link>} /> : <><section className="cart-layout"><div className="cart-list">{cart.map((item) => <article className="cart-item" key={item.id}>{item.video ? <video src={item.video} muted /> : <div className="cart-thumb"><UtensilsCrossed /></div>}<div className="cart-item-copy"><p>{item.restaurantName}</p><h2>{item.name}</h2><strong>{rupee(item.price)}</strong></div><div className="quantity"><button aria-label="Decrease" onClick={() => changeCart(item.id, item.quantity - 1)}>{item.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}</button><span>{item.quantity}</span><button aria-label="Increase" onClick={() => changeCart(item.id, item.quantity + 1)}><Plus size={16} /></button></div></article>)}</div><OrderSummary subtotal={cartTotal} checkout={() => navigate("/checkout")} /></section></>}</main><MobileNav cartCount={cartCount} /></div>;
}

function OrderSummary({ subtotal, checkout, compact = false }) { const fee = subtotal ? 39 : 0; return <aside className={compact ? "order-summary compact" : "order-summary"}><h2>Bill details</h2><p><span>Item total</span><strong>{rupee(subtotal)}</strong></p><p><span>Delivery fee</span><strong>{rupee(fee)}</strong></p><hr /><p className="total"><span>To pay</span><strong>{rupee(subtotal + fee)}</strong></p>{checkout && <button className="primary-button" onClick={checkout}>Continue to checkout <ChevronRight size={18} /></button>}</aside>; }

function Checkout({ session, cart, cartCount, cartTotal, setCart, signOut }) {
  const navigate = useNavigate();
  const [address, setAddress] = useState(""); const [paymentMethod, setPaymentMethod] = useState("COD"); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  if (session?.role !== "user") return <Navigate to="/user/login" replace />;
  if (!cart.length) return <Navigate to="/cart" replace />;
  const place = async (event) => { event.preventDefault(); setError(""); setLoading(true); try { await api.placeOrder({ address, paymentMethod }); setCart([]); navigate("/orders", { state: { placed: true } }); } catch (err) { setError(err.message.includes("empty") ? "Your browser bag has preview dishes. Add a live restaurant reel to place an order." : err.message); } finally { setLoading(false); } };
  return <div className="app-shell page-shell"><Header session={session} cartCount={cartCount} onSignOut={signOut} back title="Checkout" /><main className="content-width"><form className="checkout-layout" onSubmit={place}><section className="checkout-form"><h1>Almost there.</h1><p className="muted">Where should your delicious order go?</p><label className="form-field">Delivery address<textarea required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Flat / house number, street, landmark, city" /></label><fieldset><legend>Payment method</legend>{[["COD", "Cash on delivery"], ["UPI", "UPI"], ["CARD", "Credit / debit card"]].map(([value, label]) => <label className="payment-option" key={value}><input type="radio" checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} /><span><b>{label}</b><small>{value === "COD" ? "Pay when your order arrives" : "Secure payment at checkout"}</small></span></label>)}</fieldset>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? "Placing order…" : `Place order · ${rupee(cartTotal + 39)}`}<Check size={18} /></button></section><OrderSummary subtotal={cartTotal} compact /></form></main></div>;
}

function Orders({ session, cartCount, signOut }) {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { if (session?.role !== "user") return; api.myOrders().then(setOrders).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, [session]);
  if (session?.role !== "user") return <Navigate to="/user/login" replace />;
  return <div className="app-shell page-shell"><Header session={session} cartCount={cartCount} onSignOut={signOut} back title="Your orders" /><main className="content-width">{loading ? <Loading /> : error ? <Empty icon={<Package />} title="Orders aren’t available" body={error} /> : !orders.length ? <Empty icon={<Package />} title="No orders yet" body="Your placed orders and live status will appear here." action={<Link className="primary-button" to="/discover">Discover food</Link>} /> : <section className="orders-list">{orders.map((order) => <OrderCard key={order._id} order={order} />)}</section>}</main><MobileNav cartCount={cartCount} /></div>;
}

function OrderCard({ order }) { return <article className="order-card"><div><p className="order-date">{date(order.createdAt)}</p><h2>{order.items.map((item) => item.name).join(", ")}</h2><p>{order.items.reduce((total, item) => total + item.quantity, 0)} item{order.items.length !== 1 ? "s" : ""} · {rupee(order.total)}</p></div><span className={`status status-${order.status?.toLowerCase()}`}>{order.status?.replaceAll("_", " ")}</span></article>; }

function Restaurant({ session, cartCount, addToCart, signOut, reels }) {
  const { id } = useParams(); const [restaurant, setRestaurant] = useState(null); const [error, setError] = useState(""); const navigate = useNavigate();
  useEffect(() => { api.restaurant(id).then(setRestaurant).catch((err) => setError(err.message)); }, [id]);
  const demoItems = reels.filter((item) => item.foodPartner?._id === id);
  const displayed = restaurant?.foodItems || demoItems;
  const name = restaurant?.restaurantName || demoItems[0]?.foodPartner?.restaurantName || "Zaika kitchen";
  return <div className="app-shell page-shell"><Header session={session} cartCount={cartCount} onSignOut={signOut} back /><main className="restaurant-page"><section className="restaurant-hero"><div className="restaurant-avatar">{name.charAt(0)}</div><div><p className="eyebrow">Partner kitchen</p><h1>{name}</h1><p><MapPin size={15} /> {restaurant?.address || "Serving something special"}</p><span><Star size={14} fill="currentColor" /> 4.6 · {displayed.length || 0} reel{displayed.length === 1 ? "" : "s"}</span></div></section><section className="menu-section"><div className="section-heading"><div><p className="eyebrow">Watch, then order</p><h2>Menu reels</h2></div></div>{error && !demoItems.length ? <Empty icon={<Store />} title="Restaurant unavailable" body={error} /> : <div className="menu-grid">{displayed.map((food) => <article className="menu-item" key={food._id}>{food.video ? <video src={food.video} muted loop autoPlay playsInline /> : <div className="cart-thumb"><UtensilsCrossed /></div>}<div><p>{food.category}</p><h3>{food.name}</h3><span>{rupee(food.price)}</span></div><button onClick={async () => { if (session?.role !== "user") navigate("/user/login"); else { await addToCart(food); navigate("/cart"); } }}><Plus size={18} /></button></article>)}</div>}</section></main><MobileNav cartCount={cartCount} /></div>;
}

function PartnerDashboard({ session, cartCount, signOut }) {
  const [profile, setProfile] = useState(null); const [orders, setOrders] = useState([]); const [error, setError] = useState(""); const [showForm, setShowForm] = useState(false); const [toast, setToast] = useState("");
  const load = () => Promise.all([api.partnerProfile(), api.partnerOrders()]).then(([partner, partnerOrders]) => { setProfile(partner); setOrders(partnerOrders); }).catch((err) => setError(err.message));
  useEffect(() => { if (session?.role === "partner") load(); }, [session]);
  if (session?.role !== "partner") return <Navigate to="/food-partner/login" replace />;
  const updateStatus = async (id, status) => { try { await api.setOrderStatus(id, status); setToast("Order status updated"); load(); } catch (err) { setToast(err.message); } };
  return <div className="app-shell page-shell partner-shell"><Header session={session} cartCount={cartCount} onSignOut={signOut} /><main className="dashboard"><section className="dashboard-welcome"><div><p className="eyebrow">Restaurant studio</p><h1>{profile?.restaurantName || "Your Zaika kitchen"}</h1><p>{profile?.address || "Publish food reels and manage every order here."}</p></div><button className="primary-button" onClick={() => setShowForm(true)}><Upload size={17} /> Publish a reel</button></section>{error ? <Empty icon={<Store />} title="Dashboard unavailable" body={error} /> : !profile ? <Loading /> : <><section className="metrics"><Metric value={profile.totalVideos} label="Live menu reels" /><Metric value={orders.length} label="Orders received" /><Metric value={orders.filter((order) => order.status === "PLACED").length} label="Need your action" /></section><div className="dashboard-grid"><section className="dashboard-card"><div className="section-heading"><div><p className="eyebrow">Your content</p><h2>Live menu</h2></div><span>{profile.foodItems.length} dishes</span></div>{profile.foodItems.length ? <div className="partner-menu">{profile.foodItems.map((food) => <div className="partner-dish" key={food._id}>{food.video ? <video src={food.video} muted /> : <div className="cart-thumb"><UtensilsCrossed /></div>}<div><h3>{food.name}</h3><p>{food.category} · {rupee(food.price)}</p></div></div>)}</div> : <Empty icon={<Play />} title="Your first reel belongs here" body="Use a food video link or upload option to publish a dish." />}</section><section className="dashboard-card"><div className="section-heading"><div><p className="eyebrow">Incoming orders</p><h2>Order queue</h2></div></div>{orders.length ? <div className="partner-orders">{orders.map((order) => <article key={order._id}><div><h3>{order.items.map((item) => item.name).join(", ")}</h3><p>{date(order.createdAt)} · {rupee(order.total)}</p></div><select value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>{["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((status) => <option key={status}>{status}</option>)}</select></article>)}</div> : <Empty icon={<Package />} title="Your order queue is clear" body="New orders will appear here in real time on refresh." />}</section></div></>}</main>{showForm && <PublishModal onClose={() => setShowForm(false)} onPublished={() => { setShowForm(false); setToast("Your dish reel is live"); load(); }} />}{toast && <div className="toast"><Check size={16} />{toast}</div>}</div>;
}

function Metric({ value, label }) { return <article className="metric"><strong>{value}</strong><span>{label}</span></article>; }

function PublishModal({ onClose, onPublished }) {
  const [form, setForm] = useState({ category: "Chef special" }); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(""); try { await api.publishDish(form); onPublished(); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="publish-modal" onMouseDown={(event) => event.stopPropagation()} onSubmit={submit}><button type="button" className="modal-close" onClick={onClose}><X size={18} /></button><p className="eyebrow">Create a new reel</p><h2>Make them hungry.</h2><label className="form-field">Dish name<input required value={form.name || ""} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Korean chicken bao" /></label><label className="form-field">Description<textarea value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What makes this dish unmissable?" /></label><div className="two-fields"><label className="form-field">Price<input required type="number" min="0" value={form.price || ""} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="299" /></label><label className="form-field">Category<input value={form.category || ""} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="North Indian" /></label></div><label className="form-field">Reel video URL <small>Optional. Paste a public .mp4/reel URL.</small><input value={form.videoUrl || ""} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} placeholder="https://…" /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? "Publishing…" : "Publish reel"}<Upload size={17} /></button></form></div>;
}

function Empty({ icon, title, body, action }) { return <div className="empty-state"><div className="empty-icon">{icon}</div><h2>{title}</h2><p>{body}</p>{action}</div>; }
function Loading() { return <div className="loading"><span></span><span></span><span></span></div>; }

export default App;
