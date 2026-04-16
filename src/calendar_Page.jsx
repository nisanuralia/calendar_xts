// calendar_Page.jsx - WITHOUT SIDEBAR
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
  ];
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(seedEvents);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
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

  return (
    <div style={{ 
      height: "100vh", 
      fontFamily: "'DM Sans', sans-serif", 
      background: "#f8f9fe",
      display: "flex",
      flexDirection: "column"
    }}>
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
          <button 
            onClick={() => navigateDate(-1)} 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: 8, 
              background: "#f8f9fe", 
              fontSize: 16, 
              cursor: "pointer",
              border: "1px solid #e8e8f0"
            }}
          >
            ‹
          </button>
          <button 
            onClick={() => navigateDate(1)} 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: 8, 
              background: "#f8f9fe", 
              fontSize: 16, 
              cursor: "pointer",
              border: "1px solid #e8e8f0"
            }}
          >
            ›
          </button>
        </div>
        
        <h2 style={{ fontFamily: "'Playfair Display'", fontWeight: 600, fontSize: 20, flex: 1 }}>
          {headerLabel}
        </h2>
        
        <div style={{ 
          display: "flex", 
          gap: 4, 
          background: "#f8f9fe", 
          borderRadius: 10, 
          padding: 4, 
          border: "1px solid #e8e8f0" 
        }}>
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

        {/* User info and logout */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: user.color || "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700
            }}>
              {user.avatar}
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #e8e8f0",
                background: "white",
                color: "#e11d48",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Calendar View */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
        {view === "week" && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <h3>Week View - Calendar Grid Here</h3>
            <p>Showing week of {weekDates[0]?.toDateString()} to {weekDates[6]?.toDateString()}</p>
          </div>
        )}
        {view === "day" && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <h3>Day View - Calendar Grid Here</h3>
            <p>{currentDate.toDateString()}</p>
          </div>
        )}
        {view === "month" && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <h3>Month View - Calendar Grid Here</h3>
            <p>{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
          </div>
        )}
      </div>
    </div>
  );
}