// calendar_Page.jsx - FULL CALENDAR VIEW (no sidebar)
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = [
  { name:"Indigo",  bg:"#4f46e5", light:"#eef2ff", border:"#818cf8" },
  { name:"Rose",    bg:"#e11d48", light:"#fff1f2", border:"#fb7185" },
  { name:"Emerald", bg:"#059669", light:"#ecfdf5", border:"#34d399" },
  { name:"Amber",   bg:"#d97706", light:"#fffbeb", border:"#fbbf24" },
  { name:"Violet",  bg:"#7c3aed", light:"#f5f3ff", border:"#a78bfa" },
  { name:"Cyan",    bg:"#0891b2", light:"#ecfeff", border:"#22d3ee" },
];

const HOURS = Array.from({ length:24 }, (_,i)=>i);
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const STAFF = [
  { id:"alice", name:"Alice Tan", email:"alice@co.com", avatar:"AT", color:"#4f46e5" },
  { id:"bob", name:"Bob Lim", email:"bob@co.com", avatar:"BL", color:"#e11d48" },
  { id:"carol", name:"Carol Wong", email:"carol@co.com", avatar:"CW", color:"#059669" },
  { id:"david", name:"David Ng", email:"david@co.com", avatar:"DN", color:"#d97706" },
];

const RSVP_CFG = {
  accepted:{ icon:"✓", color:"#059669", bg:"#ecfdf5", border:"#34d399", label:"Accepted" },
  declined:{ icon:"✗", color:"#e11d48", bg:"#fff1f2", border:"#fb7185", label:"Declined"  },
  pending: { icon:"?", color:"#d97706", bg:"#fffbeb", border:"#fbbf24", label:"Pending"   },
};

function getWeekDates(date) {
  const d = new Date(date), day = d.getDay(), diff = d.getDate() - day;
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(d);
    nd.setDate(diff + i);
    return nd;
  });
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && 
         a.getMonth() === b.getMonth() && 
         a.getDate() === b.getDate();
}

function fmt(h, m = 0) {
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

function seedEvents() {
  const t = new Date();
  const tom = new Date(t);
  tom.setDate(tom.getDate() + 1);
  return [
    { id: 1, title: "Team Standup", date: t, startHour: 9, startMin: 0, endHour: 9, endMin: 30, color: COLORS[0], desc: "Daily engineering sync", attendees: "alice@co.com, bob@co.com", rsvp: "accepted" },
    { id: 2, title: "Design Review", date: t, startHour: 11, startMin: 0, endHour: 12, endMin: 0, color: COLORS[4], desc: "Review new UI components", attendees: "carol@co.com", rsvp: "pending" },
    { id: 3, title: "Lunch with Sarah", date: tom, startHour: 12, startMin: 30, endHour: 13, endMin: 30, color: COLORS[2], desc: "", attendees: "", rsvp: "declined" },
    { id: 4, title: "Sprint Planning", date: t, startHour: 14, startMin: 0, endHour: 15, endMin: 0, color: COLORS[3], desc: "Q3 sprint kick-off", attendees: "bob@co.com, david@co.com", rsvp: "pending" },
  ];
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(seedEvents);
  const [detailEv, setDetailEv] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("user");
    
    if (!isLoggedIn || !userData) {
      navigate("/");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const navigateDate = (dir) => {
    const d = new Date(currentDate);
    if (view === "week") d.setDate(d.getDate() + dir * 7);
    if (view === "day") d.setDate(d.getDate() + dir);
    if (view === "month") d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const monthCells = useMemo(() => {
    const y = currentDate.getFullYear(), mo = currentDate.getMonth();
    const first = new Date(y, mo, 1).getDay();
    const days = new Date(y, mo + 1, 0).getDate();
    const c = [];
    for (let i = 0; i < first; i++) c.push(null);
    for (let d = 1; d <= days; d++) c.push(new Date(y, mo, d));
    while (c.length % 7 !== 0) c.push(null);
    return c;
  }, [currentDate]);

  const headerLabel = view === "week"
    ? `${MONTHS[weekDates[0].getMonth()]} ${weekDates[0].getFullYear()}`
    : view === "day"
    ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`
    : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/");
  };

  const today = new Date();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", background: "#f8f9fe" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#c7d2fe;border-radius:99px}
        .btn{cursor:pointer;border:none;outline:none;font-family:inherit}
        .evt{transition:all .15s;cursor:pointer} .evt:hover{filter:brightness(1.07);transform:translateX(1px)}
        .timeslot:hover .addbtn{opacity:1!important}
        .dcell:hover{background:#f0f0ff}
        .modal{animation:mIn .2s ease}
        @keyframes mIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <header style={{
        background: "white",
        borderBottom: "1px solid #e8e8f0",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexShrink: 0
      }}>
        <button
          onClick={() => setCurrentDate(new Date())}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "1.5px solid #e8e8f0",
            fontWeight: 600,
            fontSize: 13,
            background: "white",
            color: "#4f46e5",
            cursor: "pointer"
          }}
        >
          Today
        </button>
        
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => navigateDate(-1)} style={{ width: 32, height: 32, borderRadius: 8, background: "#f8f9fe", fontSize: 16, cursor: "pointer", border: "1px solid #e8e8f0", color: "#000000", fontWeight: "bold" }}>‹</button>
          <button onClick={() => navigateDate(1)} style={{ width: 32, height: 32, borderRadius: 8, background: "#f8f9fe", fontSize: 16, cursor: "pointer", border: "1px solid #e8e8f0", color: "#000000", fontWeight: "bold" }}>›</button>
        </div>
        
        <h2 style={{ fontFamily: "'Playfair Display'", fontWeight: 600, fontSize: 20, flex: 1, color: "#07061a" }}>{headerLabel}</h2>
        
        <div style={{ display: "flex", gap: 4, background: "#f8f9fe", borderRadius: 10, padding: 4, border: "1px solid #e8e8f0" }}>
          {["day", "week", "month"].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                background: view === v ? "#4f46e5" : "transparent",
                color: view === v ? "white" : "#64748b",
                cursor: "pointer",
                border: "none"
              }}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: user.color || "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>{user.avatar}</div>
            <button onClick={handleLogout} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e8e8f0", background: "white", color: "#e11d48", cursor: "pointer" }}>Logout</button>
          </div>
        )}
      </header>

      {/* Calendar Grid */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {view === "month" ? (
          <MonthView cells={monthCells} events={events} today={today} onEventClick={setDetailEv} />
        ) : (
          <DayColumnView dates={view === "day" ? [currentDate] : weekDates} events={events} today={today} onEventClick={setDetailEv} />
        )}
      </div>

      {/* Event Detail Modal */}
      {detailEv && (
        <div onClick={() => setDetailEv(null)} style={{ position: "fixed", inset: 0, zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30,27,75,0.25)" }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 18, padding: 28, width: 360, boxShadow: "0 20px 50px #4f46e518" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: detailEv.color.bg, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{detailEv.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{fmt(detailEv.startHour, detailEv.startMin)} – {fmt(detailEv.endHour, detailEv.endMin)}</div>
                </div>
              </div>
              <button onClick={() => setDetailEv(null)} style={{ width: 28, height: 28, borderRadius: 8, background: "#f8f9fe", border: "1px solid #e8e8f0", fontSize: 14, cursor: "pointer", color: "black" }}>✕</button>
            </div>
            {detailEv.attendees && <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>👥 {detailEv.attendees}</div>}
            {detailEv.desc && <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12, lineHeight: 1.6, background: "#f8f9fe", borderRadius: 10, padding: 12 }}>{detailEv.desc}</div>}
            {detailEv.rsvp && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: RSVP_CFG[detailEv.rsvp].bg, border: `1.5px solid ${RSVP_CFG[detailEv.rsvp].border}`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: RSVP_CFG[detailEv.rsvp].color, marginBottom: 14 }}>
                {RSVP_CFG[detailEv.rsvp].icon} {RSVP_CFG[detailEv.rsvp].label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Day/Week Column View Component
function DayColumnView({ dates, events, today, onEventClick }) {
  const isWeek = dates.length > 1;
  const cols = dates.length;
  const gridCols = `64px repeat(${cols}, 1fr)`;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
      {isWeek && (
        <div style={{ display: "grid", gridTemplateColumns: gridCols, flexShrink: 0, background: "white", borderBottom: "1px solid #e8e8f0", zIndex: 20 }}>
          <div style={{ borderRight: "1px solid #e8e8f0" }} />
          {dates.map((date, di) => {
            const isToday = sameDay(date, today);
            return (
              <div key={di} style={{ height: 72, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid #f0f0ff" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: isToday ? "#4f46e5" : "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{DAYS[date.getDay()]}</span>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: isToday ? "#4f46e5" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: isToday ? "white" : "#1e1b4b" }}>{date.getDate()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, height: `${HOURS.length * 60}px` }}>
          <div style={{ borderRight: "1px solid #e8e8f0", background: "white" }}>
            {HOURS.map(h => (
              <div key={h} style={{ height: 60, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingRight: 10, paddingTop: 4 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{h === 0 ? "" : fmt(h)}</span>
              </div>
            ))}
          </div>

          {dates.map((date, di) => {
            const dayEvts = events.filter(e => sameDay(e.date, date));
            const isToday = sameDay(date, today);
            return (
              <div key={di} style={{ position: "relative", borderRight: "1px solid #f0f0ff" }}>
                {HOURS.map(h => (
                  <div key={h} className="timeslot" style={{ height: 60, borderBottom: "1px solid #f0f0ff", position: "relative" }} />
                ))}
                {dayEvts.map(ev => {
                  const top = (ev.startHour + ev.startMin / 60) * 60;
                  const height = Math.max(((ev.endHour + ev.endMin / 60) - (ev.startHour + ev.startMin / 60)) * 60, 24);
                  const rsvpC = ev.rsvp ? RSVP_CFG[ev.rsvp] : null;
                  return (
                    <div key={ev.id} className="evt" onClick={e => { e.stopPropagation(); onEventClick(ev); }} style={{
                      position: "absolute", top, zIndex: 2, left: 4, right: 4, height,
                      background: ev.color.light, border: `2px solid ${ev.color.border}`, borderLeft: `4px solid ${ev.color.bg}`,
                      borderRadius: 8, padding: "3px 7px", overflow: "hidden"
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: ev.color.bg, lineHeight: 1.3 }}>{ev.title}</div>
                      {height > 32 && <div style={{ fontSize: 10, color: ev.color.bg, opacity: 0.8 }}>{fmt(ev.startHour, ev.startMin)}</div>}
                      {rsvpC && <div style={{ position: "absolute", top: 3, right: 5, fontSize: 10, fontWeight: 900, color: rsvpC.color }}>{rsvpC.icon}</div>}
                    </div>
                  );
                })}
                {isToday && (() => {
                  const now = new Date(), px = (now.getHours() + now.getMinutes() / 60) * 60;
                  return <div style={{ position: "absolute", left: 0, right: 0, top: px, height: 2, background: "#4f46e5", zIndex: 5, pointerEvents: "none" }} />;
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Month View Component
function MonthView({ cells, events, today, onEventClick }) {
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "white", borderBottom: "1px solid #e8e8f0" }}>
        {DAYS.map(d => <div key={d} style={{ textAlign: "center", padding: "12px 0", fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase" }}>{d}</div>)}
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateRows: `repeat(${weeks.length},1fr)` }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: "1px solid #f0f0ff" }}>
            {week.map((date, di) => {
              const isToday = date && sameDay(date, today);
              const dayEvts = date ? events.filter(e => sameDay(e.date, date)) : [];
              return (
                <div key={di} className="dcell" style={{ borderRight: "1px solid #f0f0ff", padding: 8, background: "white", overflow: "hidden" }}>
                  {date && (
                    <>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: isToday ? "#4f46e5" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: isToday ? 700 : 500, color: isToday ? "white" : "#1e1b4b" }}>{date.getDate()}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {dayEvts.slice(0, 3).map(ev => {
                          const rC = ev.rsvp ? RSVP_CFG[ev.rsvp] : null;
                          return (
                            <div key={ev.id} onClick={e => { e.stopPropagation(); onEventClick(ev); }} style={{
                              fontSize: 11, fontWeight: 600, color: ev.color.bg, background: ev.color.light, borderLeft: `3px solid ${ev.color.bg}`,
                              borderRadius: 4, padding: "1px 5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                            }}>
                              {rC && <span style={{ fontSize: 9, fontWeight: 900 }}>{rC.icon}</span>}
                              {ev.title}
                            </div>
                          );
                        })}
                        {dayEvts.length > 3 && <div style={{ fontSize: 11, color: "#94a3b8" }}>+{dayEvts.length - 3} more</div>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}