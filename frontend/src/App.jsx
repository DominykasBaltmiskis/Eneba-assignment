import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Change if your backend URL is different
const API_BASE = "http://localhost:5173";

// Your current welcome image (replace with your newest link if you want)
const WELCOME_IMG =
  "https://p325k7wa.twic.pics/high/elden-ring/elden-ring/08-shadow-of-the-erdtree/elden-ring-expansion-SOTE/00-page-content/ERSOTE-header-mobile.jpg?twic=v1/resize=760/step=10/quality=80";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function Header({ searchValue, setSearchValue }) {
  const navigate = useNavigate();
  const location = useLocation();

  function goSearch(q) {
    const trimmed = q.trim();
    // Always route search to /games so results exist
    navigate(`/games${trimmed ? `?search=${encodeURIComponent(trimmed)}` : ""}`);
  }

  function onSubmit(e) {
    e.preventDefault();
    goSearch(searchValue);
  }

  function clear() {
    setSearchValue("");
    // If you're on games, clearing should show all games
    if (location.pathname.startsWith("/games")) {
      navigate("/games");
    }
  }

  return (
    <div className="header">
      <div className="logo">eneba</div>

      {/* Search bar */}
      <form className="searchWrap" onSubmit={onSubmit}>
        <span style={{ opacity: 0.85 }}>🔍</span>
        <input
          className="search"
          placeholder="Search games..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue?.length > 0 && (
          <button type="button" className="clearBtn" onClick={clear}>
            ✕
          </button>
        )}
      </form>

      {/* Right side (keep your style as-is; just restores Home/Games buttons) */}
      <div className="headerRight">
        <div style={{ opacity: 0.9 }}>English EU | EUR</div>

        {/* Old style buttons (simple) */}
        <NavLink
          to="/"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: "white",
            padding: "6px 10px",
            borderRadius: 8,
            borderBottom: isActive ? "2px solid #ff3b3b" : "2px solid transparent",
            opacity: 0.95,
          })}
        >
          Home
        </NavLink>

        <NavLink
          to="/games"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: "white",
            padding: "6px 10px",
            borderRadius: 8,
            borderBottom: isActive ? "2px solid #ff3b3b" : "2px solid transparent",
            opacity: 0.95,
          })}
        >
          Games
        </NavLink>

        {/* Keep your icons (placeholders) */}
        <span style={{ opacity: 0.9 }}>♡</span>
        <span style={{ opacity: 0.9 }}>🛒</span>
        <span style={{ opacity: 0.9 }}>👤</span>
      </div>
    </div>
  );
}

function Home() {
  // Home is intentionally “empty-ish”, but with welcome block (what you already had)
  return (
    <div className="container">
      <div
        style={{
          maxWidth: 980,
          margin: "40px auto 0",
          padding: 24,
          borderRadius: 18,
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(6px)",
          boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: "0 0 8px" }}>Welcome</h2>
        <p style={{ margin: "0 0 18px", opacity: 0.9 }}>
          Use the search bar to find games, or open the Games page.
        </p>

        <img
          src={WELCOME_IMG}
          alt="Welcome"
          style={{
            width: "100%",
            maxWidth: 860,
            borderRadius: 18,
            boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
            display: "block",
            margin: "0 auto",
          }}
        />

        {/* Space for your CV later */}
        <div style={{ height: 26 }} />
      </div>
    </div>
  );
}

function GamesPage() {
  const query = useQuery();
  const navigate = useNavigate();

  const urlSearch = query.get("search") || "";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchGames(search) {
    setLoading(true);
    try {
      const url = `${API_BASE}/list${search ? `?search=${encodeURIComponent(search)}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch whenever URL search changes
  useEffect(() => {
    fetchGames(urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch]);

  // Clicking a card (for now just go to /games and keep it simple)
  function onCardClick(game) {
    // If you later add a details page, change this
    alert(`Clicked: ${game.title}`);
  }

  return (
    <div className="container">
      <div className="results">Results found: {loading ? "..." : items.length}</div>

      <div className="grid">
        {items.map((g) => (
          <div
            key={g.id}
            className="card"
            onClick={() => onCardClick(g)}
            style={{
              cursor: "pointer",
              boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
              transition: "transform 180ms ease, box-shadow 180ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 26px 70px rgba(0,0,0,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "0 18px 50px rgba(0,0,0,0.28)";
            }}
          >
            <img src={g.image_url} alt={g.title} />

            <div className="cardBody">
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{g.title}</div>

              <div className="tags" style={{ marginBottom: 10 }}>
                <span>{g.platform}</span>
                <span>{g.region}</span>
              </div>

              <div className="price">
                €{Number(g.price).toFixed(2)}
                <span className="old">€{Number(g.original_price).toFixed(2)}</span>
              </div>

              <div className="meta">
                ❤️ {g.likes} · Cashback €{Number(g.cashback).toFixed(2)}
              </div>

              {/* Discount pill on the right (no green CASHBACK label on image) */}
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <span
                  style={{
                    background: "rgba(0,0,0,0.35)",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                  }}
                >
                  {g.discount_percent}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick helper */}
      <div style={{ marginTop: 18, opacity: 0.8, fontSize: 13 }}>
        Tip: Searching from Home sends you here automatically.
        {" "}
        <button
          onClick={() => navigate("/")}
          style={{
            marginLeft: 8,
            background: "rgba(255,255,255,0.12)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.18)",
            padding: "6px 10px",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const query = useQuery();
  const [searchValue, setSearchValue] = useState("");

  // Keep input synced with URL when you're on /games
  useEffect(() => {
    const urlSearch = query.get("search") || "";
    if (location.pathname.startsWith("/games")) {
      setSearchValue(urlSearch);
    }
    // On home we don't force overwrite what user typed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  return (
    <div className="app">
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<GamesPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
