import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const COLORS = {
  3: { bg: "rgba(34,197,94,0.1)", border: "#22c55e", text: "#22c55e", label: "All 3 AIs agree" },
  2: { bg: "rgba(234,179,8,0.1)", border: "#eab308", text: "#eab308", label: "2 AIs agree" },
  1: { bg: "rgba(107,114,128,0.1)", border: "#6b7280", text: "#6b7280", label: "1 AI only" },
};

const AI_CONFIG = {
  gpt: { name: "GPT-4o", icon: "🟢", model: "LLaMA 3.3 70B", color: "#10b981" },
  claude: { name: "Claude", icon: "🟣", model: "command-r-08-2024", color: "#8b5cf6" },
  gemini: { name: "Gemini", icon: "🔵", model: "gemini-2.0-flash-001", color: "#3b82f6" },
};

function SkeletonCard() {
  return (
    <div style={{
      background: "#1a1a2e", border: "1px solid #2d2d4e",
      borderRadius: 12, padding: "14px 16px", marginBottom: 10,
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2d2d4e", animation: "pulse 1.5s infinite" }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, background: "#2d2d4e", borderRadius: 6, marginBottom: 8, width: "60%" }} />
          <div style={{ height: 10, background: "#2d2d4e", borderRadius: 6, width: "80%" }} />
        </div>
      </div>
    </div>
  );
}

function RankCard({ item, index, color }) {
  return (
    <div style={{
      background: "#1a1a2e",
      border: "1px solid #2d2d4e",
      borderRadius: 12, padding: "14px 16px", marginBottom: 10,
      transition: "all 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => e.currentTarget.style.border = `1px solid ${color}`}
      onMouseLeave={e => e.currentTarget.style.border = "1px solid #2d2d4e"}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          minWidth: 28, height: 28, borderRadius: "50%",
          background: color + "22", color: color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, fontSize: 12, flexShrink: 0,
        }}>{index + 1}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 14 }}>{item.brand}</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product}</div>
          <div style={{ color: "#64748b", fontSize: 11, marginTop: 5, lineHeight: 1.5 }}>{item.reason}</div>
        </div>
      </div>
    </div>
  );
}

function AIColumn({ aiKey, data, loading }) {
  const config = AI_CONFIG[aiKey];
  return (
    <div style={{
      flex: 1, background: "#13131f",
      border: "1px solid #2d2d4e", borderRadius: 16, padding: 20,
      minWidth: 0,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 18,
        paddingBottom: 14, borderBottom: "1px solid #2d2d4e"
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: config.color + "22",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>{config.icon}</div>
        <div>
          <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 15 }}>{config.name}</div>
          <div style={{ color: "#64748b", fontSize: 11 }}>{config.model}</div>
        </div>
        {!loading && data.length > 0 && (
          <div style={{
            marginLeft: "auto", background: config.color + "22",
            color: config.color, borderRadius: 20, padding: "2px 10px",
            fontSize: 11, fontWeight: 600,
          }}>
            {data.length} results
          </div>
        )}
      </div>
      {loading ? (
        Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
      ) : data.length === 0 ? (
        <div style={{ color: "#6b7280", fontSize: 13, textAlign: "center", paddingTop: 40 }}>
          No results
        </div>
      ) : (
        data.map((item, i) => <RankCard key={i} item={item} index={i} color={config.color} />)
      )}
    </div>
  );
}

function ReportCard({ data, query }) {
  if (!data || data.length === 0) return null;
  const consensus = data.filter(d => d.count === 3);
  const partial = data.filter(d => d.count === 2);
  const unique = data.filter(d => d.count === 1);

  return (
    <div style={{
      background: "#13131f", border: "1px solid #2d2d4e",
      borderRadius: 16, padding: 28, marginTop: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "#6c63ff22", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>📊</div>
        <div>
          <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 18 }}>Brand Report Card</div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
            AI consensus analysis for "{query}"
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          {[
            { count: data.length, label: "Total Brands", color: "#6c63ff" },
            { count: consensus.length, label: "Consensus", color: "#22c55e" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.count}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {consensus.length > 0 && (
        <Section title="🏆 Strong Consensus" subtitle="Recommended by all 3 AIs" items={consensus} colorKey={3} />
      )}
      {partial.length > 0 && (
        <Section title="⚡ Partial Match" subtitle="Recommended by 2 AIs" items={partial} colorKey={2} />
      )}
      {unique.length > 0 && (
        <Section title="💡 Unique Picks" subtitle="Recommended by 1 AI only" items={unique} colorKey={1} />
      )}
    </div>
  );
}

function Section({ title, subtitle, items, colorKey }) {
  const c = COLORS[colorKey];
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 14 }}>{title}</span>
        <span style={{ color: "#64748b", fontSize: 12 }}>{subtitle}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: c.bg, border: `1.5px solid ${c.border}`,
            borderRadius: 10, padding: "8px 16px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.text }} />
            <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13 }}>{item.brand}</span>
            <span style={{ color: c.text, fontSize: 11, fontWeight: 600 }}>×{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const EXAMPLES = [
  "best magnesium supplement for seniors",
  "best protein powder for gym beginners",
  "best sleep aid for adults",
  "best collagen supplement for skin",
];

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (q) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (e) {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f13",
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "40px 24px", color: "#e2e8f0",
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: #4a4a6a; }
      `}</style>

      <div style={{ maxWidth: 1140, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#6c63ff22", border: "1px solid #6c63ff44",
            borderRadius: 20, padding: "6px 16px", marginBottom: 16,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6c63ff" }} />
            <span style={{ fontSize: 12, color: "#6c63ff", fontWeight: 600, letterSpacing: 1 }}>
              AEO DIAGNOSTIC TOOL
            </span>
          </div>
          <h1 style={{
            fontSize: 38, fontWeight: 900, margin: "0 0 12px",
            background: "linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
          }}>
            AI Brand Visibility Analyzer
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
            Discover how your brand ranks across multiple AI engines simultaneously
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: 720, margin: "0 auto 16px" }}>
          <div style={{
            display: "flex", gap: 12,
            background: "#13131f", border: "1.5px solid #2d2d4e",
            borderRadius: 14, padding: 8,
          }}>
            <span style={{ display: "flex", alignItems: "center", paddingLeft: 8, fontSize: 18 }}>🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyze()}
              placeholder='e.g. "best protein powder for gym beginners"'
              style={{
                flex: 1, background: "transparent", border: "none",
                color: "#e2e8f0", fontSize: 15, outline: "none", padding: "8px 4px",
              }}
            />
            <button
              onClick={() => analyze()}
              disabled={loading}
              style={{
                background: loading ? "#4a4580" : "linear-gradient(135deg, #6c63ff, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "12px 28px", fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap", transition: "all 0.2s",
              }}
            >
              {loading ? "Analyzing..." : "Analyze →"}
            </button>
          </div>
        </div>

        {/* Example chips */}
        {!results && !loading && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => analyze(ex)} style={{
                background: "#1a1a2e", border: "1px solid #2d2d4e",
                borderRadius: 20, padding: "6px 14px", color: "#94a3b8",
                fontSize: 12, cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#6c63ff"; e.currentTarget.style.color = "#6c63ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2d2d4e"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div style={{
            color: "#f87171", textAlign: "center", marginBottom: 24,
            background: "#f8717122", border: "1px solid #f8717144",
            borderRadius: 10, padding: "12px 20px", maxWidth: 500, margin: "0 auto 24px",
          }}>{error}</div>
        )}

        {/* AI Columns */}
        {(loading || results) && (
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 8 }}>
            {["gpt", "claude", "gemini"].map(key => (
              <AIColumn key={key} aiKey={key} data={results?.[key] || []} loading={loading} />
            ))}
          </div>
        )}

        {/* Report Card */}
        {results && <ReportCard data={results.reportCard} query={results.query} />}

        {/* Empty state */}
        {!loading && !results && (
          <div style={{ textAlign: "center", paddingTop: 40, color: "#4a4a6a" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>
              Search any product to see AI rankings
            </div>
            <div style={{ fontSize: 13, color: "#4a4a6a", marginTop: 8 }}>
              Or click one of the example queries above
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, color: "#2d2d4e", fontSize: 12 }}>
          Powered by Groq API · Cohere API · Built for Pixii.ai
        </div>

      </div>
    </div>
  );
}