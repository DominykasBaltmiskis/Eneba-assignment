import { useEffect, useMemo, useState } from "react";
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
          <span className="searchIcon" aria-hidden="true">🔍</span>
          <input
            className="search"
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

          <button className="iconBtn" title="Wishlist">♡</button>
          <button className="iconBtn" title="Cart">🛒</button>
          <button className="iconBtn" title="Account">👤</button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ searchValue, setSearchValue }) {
  const nav = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const q = (searchValue || "").trim();
    // ✅ FIX: Home search must navigate to Games with query
    nav(q ? `/games?search=${encodeURIComponent(q)}` : "/games");
  };

  return (
    <div className="app">
      <Header value={searchValue} onChange={setSearchValue} onSubmit={onSubmit} />

      <div className="container">
        <div className="welcomeCard">
          <h1 className="welcomeTitle">Welcome</h1>
          <p className="welcomeSub">
            Use the search bar to find games, or open the Games page.
          </p>

          {/* ✅ PATCH: Replace old welcome image with the new one + rounded + shadow */}
          <img
            className="welcomeImg"
            alt="Elden Ring Shadow of the Erdtree"
            src="https://p325k7wa.twic.pics/high/elden-ring/elden-ring/08-shadow-of-the-erdtree/elden-ring-expansion-SOTE/00-page-content/ERSOTE-header-mobile.jpg?twic=v1/resize=760/step=10/quality=80"
          />

          {/* space for upcoming CV */}
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

  const onSubmit = (e) => {
    e.preventDefault();
    const term = (searchValue || "").trim();
    // ✅ FIX: Games search updates URL -> triggers fetch
    nav(term ? `/games?search=${encodeURIComponent(term)}` : "/games");
  };

  return (
    <div className="app">
      <Header value={searchValue} onChange={setSearchValue} onSubmit={onSubmit} />

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
