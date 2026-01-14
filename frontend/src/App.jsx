import { useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE = "http://localhost:3001";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function Header({ value, onChange, onSubmit }) {
  return (
    <div className="headerShell">
      <div className="header">
        <div className="logo">eneba</div>

        <form className="searchWrap" onSubmit={onSubmit}>
          <button
            type="submit"
            className="searchSubmit"
            aria-label="Search"
            title="Search"
          >
            🔍
          </button>

          <input
            className="search"
            type="search"
            placeholder="Search games..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          {value?.length > 0 && (
            <button
              type="button"
              className="iconBtn"
              title="Clear"
              onClick={() => onChange("")}
            >
              ✕
            </button>
          )}
        </form>

        <div className="headerRight">
          <div className="lang">English EU | EUR</div>

          <NavLink to="/" className={({ isActive }) => `navBtn ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/games" className={({ isActive }) => `navBtn ${isActive ? "active" : ""}`}>
            Games
          </NavLink>

          <button type="button" className="iconBtn" title="Wishlist">♡</button>
          <button type="button" className="iconBtn" title="Cart">🛒</button>
          <button type="button" className="iconBtn" title="Account">👤</button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ searchValue, setSearchValue }) {
  const nav = useNavigate();
  const typeTimer = useRef(null);

  // ✅ LIVE SEARCH: typing on Home auto-jumps to /games?search=...
  const onType = (v) => {
    setSearchValue(v);

    window.clearTimeout(typeTimer.current);
    typeTimer.current = window.setTimeout(() => {
      const q = (v || "").trim();
      if (q.length > 0) {
        nav(`/games?search=${encodeURIComponent(q)}`, { replace: true });
      }
    }, 250);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const q = (searchValue || "").trim();
    nav(q ? `/games?search=${encodeURIComponent(q)}` : "/games");
  };

  return (
    <div className="app">
      <Header value={searchValue} onChange={onType} onSubmit={onSubmit} />

      <div className="container">
        <div className="welcomeCard">
          <h1 className="welcomeTitle">Welcome</h1>
          <p className="welcomeSub">
            Use the search bar to find games, or open the Games page.
          </p>

          <img
            className="welcomeImg"
            alt="Elden Ring Shadow of the Erdtree"
            src="https://p325k7wa.twic.pics/high/elden-ring/elden-ring/08-shadow-of-the-erdtree/elden-ring-expansion-SOTE/00-page-content/ERSOTE-header-mobile.jpg?twic=v1/resize=760/step=10/quality=80"
          />

          <div className="welcomeSpace">
            <div className="spaceHint">CV content coming here…</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GamesPage({ searchValue, setSearchValue }) {
  const q = useQuery();
  const nav = useNavigate();
  const typeTimer = useRef(null);

  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Sync input from URL so refresh/back works
  useEffect(() => {
    const fromUrl = q.get("search") || "";
    setSearchValue(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.toString()]);

  useEffect(() => {
    const fetchGames = async () => {
      const term = (q.get("search") || "").trim();
      setLoading(true);
      try {
        const url = term
          ? `${API_BASE}/list?search=${encodeURIComponent(term)}`
          : `${API_BASE}/list`;

        const res = await fetch(url);
        const data = await res.json();

        setCount(data?.count ?? 0);
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch (e) {
        setCount(0);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [q]);

  // ✅ LIVE SEARCH: update URL while typing (debounced)
  const onType = (v) => {
    setSearchValue(v);

    window.clearTimeout(typeTimer.current);
    typeTimer.current = window.setTimeout(() => {
      const term = (v || "").trim();
      nav(term ? `/games?search=${encodeURIComponent(term)}` : "/games", { replace: true });
    }, 250);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const term = (searchValue || "").trim();
    nav(term ? `/games?search=${encodeURIComponent(term)}` : "/games");
  };

  return (
    <div className="app">
      <Header value={searchValue} onChange={onType} onSubmit={onSubmit} />

      <div className="container">
        <div className="results">Results found: {loading ? "…" : count}</div>

        <div className="grid">
          {items.map((g) => (
            <div className="card" key={g.id}>
              <img src={g.image_url} alt={g.title} />
              <div className="cardBody">
                <div className="title">{g.title}</div>

                <div className="tags">
                  <span>{g.platform}</span>
                  <span>{g.region}</span>
                </div>

                <div className="priceRow">
                  <div className="price">
                    €{Number(g.price).toFixed(2)}
                    <span className="old">€{Number(g.original_price).toFixed(2)}</span>
                  </div>
                  <span className="pill">{g.discount_percent}%</span>
                </div>

                <div className="meta">
                  <span className="likes">❤️ {g.likes}</span>
                  <span className="cashback">Cashback €{Number(g.cashback).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          {!loading && items.length === 0 && (
            <div className="empty">
              No games found. Try another search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="bg">
      <Routes>
        <Route
          path="/"
          element={<HomePage searchValue={searchValue} setSearchValue={setSearchValue} />}
        />
        <Route
          path="/games"
          element={<GamesPage searchValue={searchValue} setSearchValue={setSearchValue} />}
        />
      </Routes>
    </div>
  );
}
