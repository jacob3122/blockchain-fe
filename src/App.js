import { useState } from "react";
import Sidebar from "./Sidebar";
import TopMenuBar from "./TopMenuBar";
import AbsenceTable from "./AbsenceTable";

function App() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif" }}>
      <Sidebar active={active} setActive={setActive} />
      <div style={{ flex: 1, background: "#f9fafb", minHeight: "100vh" }}>
        <TopMenuBar />
        <main style={{ padding: 24 }}>
          {active === "Dashboard" ? (
            <AbsenceTable />
          ) : (
            <p style={{ color: "#888" }}>Nothing to display</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;