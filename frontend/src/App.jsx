import { useEffect, useMemo, useState } from "react";
import { Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE = "http://localhost:3001";

/** CV DATA (from your Resume doc) */
const CV = {
  name: "Dominykas Baltmiškis",
  contact: "Kaunas, Lithuania | +370 699 83104 | dominykasbaltmiskis@gmail.com",
  experience: [
    {
      role: "ESO – Electrical Network Development Engineer",
      period: "2023 – Present",
      bullets: [
        "Performed power grid analysis and proposed efficient electrical network solutions",
        "Contributed to long-term infrastructure planning and development initiatives",
      ],
    },
    {
      role: "Hollister – Controls Engineer",
      period: "2023",
      bullets: [
        "Programmed PLC controllers and configured servo drives",
        "Integrated new components into existing systems for process improvement",
      ],
    },
    {
      role: "Hollister – Maintenance Technician",
      period: "2022 – 2023",
      bullets: [
        "Maintained and optimized industrial equipment performance",
        "Diagnosed and resolved electrical and mechanical issues",
      ],
    },
    {
      role: "Tic-elkas – Electrical Cabinet Assembler",
      period: "2022",
      bullets: [
        "Assembled and wired electrical control panels",
        "Connected controllers and ensured safe circuit configurations",
      ],
    },
  ],
  education: [
    {
      title: "CodeAcademy – Cybersecurity Specialist Program",
      period: "2025",
      sub: "Coursework: Threat Intelligence, APT Analysis, Ethical Hacking Technologies",
    },
    {
      title: "Kauno Kolegija – Bachelor of Professional Studies: Automation & Robotics Engineering",
      period: "2020 – 2023",
      sub: "",
    },
  ],
  certifications: [
    {
      title: "Cybersecurity Program – CodeAcademy",
      sub: "504 hours – Focus on threat detection, cyber defense strategies, and ethical hacking (Expected: 2025)",
    },
  ],
  skills: [
    "TIA Portal, Autodesk Inventor, AutoCAD, Microsoft Office, Splan 7.0, Visual Studio, Cisco Packet Tracer",
    "C++",
    "PLC programming, servo drive configuration, electrical schematics, equipment maintenance, industrial automation",
    "Lithuanian (native), English (fluent)",
  ],
};

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
            autoComplete="off"
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

          {/* keeps Enter working even if browser is weird */}
          <button type="submit" style={{ display: "none" }} aria-hidden="true" />
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

function CVBlock() {
  return (
    <div className="cvCard">
      <div className="cvTop">
        <div>
          <div className="cvName">{CV.name}</div>
          <div className="cvContact">{CV.contact}</div>
        </div>
      </div>

      <div className="cvSection">
        <div className="cvH">Professional Experience</div>
        {CV.experience.map((x, idx) => (
          <div className="cvItem" key={idx}>
            <div className="cvItemTop">
              <div className="cvRole">{x.role}</div>
              <div className="cvPeriod">{x.period}</div>
            </div>
            <ul className="cvList">
              {x.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="cvSection">
        <div className="cvH">Education</div>
        {CV.education.map((x, idx) => (
          <div className="cvItem" key={idx}>
            <div className="cvItemTop">
              <div className="cvRole">{x.title}</div>
              <div className="cvPeriod">{x.period}</div>
            </div>
            {x.sub ? <div className="cvSub">{x.sub}</div> : null}
          </div>
        ))}
      </div>

      <div className="cvSection">
        <div className="cvH">Certifications & Courses</div>
        {CV.certifications.map((x, idx) => (
          <div className="cvItem" key={idx}>
            <div className="cvRole">{x.title}</div>
            <div className="cvSub">{x.sub}</div>
          </div>
        ))}
      </div>

      <div className="cvSection">
        <div className="cvH">Skills</div>
        <ul className="cvList">
          {CV.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HomePage({ searchValue, setSearchValue }) {
  const nav = useNavigate();

  // PATCH: live-search on Home -> automatically go to /games while typing
  useEffect(() => {
    const q = (searchValue || "").trim();
    const t = setTimeout(() => {
      if (q.length > 0) {
        nav(`/games?search=${encodeURIComponent(q)}`, { replace: true });
      }
    }, 250);
    return () => clearTimeout(t);
  }, [searchValue, nav]);

  const onSubmit = (e) => {
    e.preventDefault();
    const q = (searchValue || "").trim();
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

          <img
            className="welcomeImg"
            alt="Elden Ring Shadow of the Erdtree"
            src="https://p325k7wa.twic.pics/high/elden-ring/elden-ring/08-shadow-of-the-erdtree/elden-ring-expansion-SOTE/00-page-content/ERSOTE-header-mobile.jpg?twic=v1/resize=760/step=10/quality=80"
          />

          {/* PATCH: CV added below, everything else unchanged */}
          <div className="cvWrap">
            <CVBlock />
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

  // Sync input from URL (refresh/back works)
  useEffect(() => {
    const fromUrl = q.get("search") || "";
    if (fromUrl !== searchValue) setSearchValue(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.toString()]);

  // PATCH: live-search on Games page (update URL while typing)
  useEffect(() => {
    const term = (searchValue || "").trim();
    const current = (q.get("search") || "").trim();

    const t = setTimeout(() => {
      if (term === current) return;
      nav(term ? `/games?search=${encodeURIComponent(term)}` : "/games", { replace: true });
    }, 250);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // Fetch when URL changes
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

  // Enter still works (same behavior)
  const onSubmit = (e) => {
    e.preventDefault();
    const term = (searchValue || "").trim();
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
            <div className="empty">No games found. Try another search.</div>
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
