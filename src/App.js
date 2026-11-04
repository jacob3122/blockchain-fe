import { useState } from "react";
import Sidebar from "./Sidebar";
import TopMenuBar from "./TopMenuBar";
import TokenTable from "./TokenTable";
import BlocksPage from "./BlocksPage";
import SmartContractsPage from "./SmartContractsPage";

function App() {
  const [active, setActive] = useState("Dashboard");
  const [tokenRows, setTokenRows] = useState([]); 

  const renderPage = () => {
       if (active === "Dashboard") return <TokenTable rows={tokenRows} setRows={setTokenRows} />;
    if (active === "Blocks") return <BlocksPage />;
    if (active === "Smart Contracts") return <SmartContractsPage />;
    return <p style={{ color: "#888" }}>Nothing to display</p>;
  };

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif" }}>
      <Sidebar active={active} setActive={setActive} />
      <div style={{ flex: 1, background: "#f9fafb", minHeight: "100vh" }}>
        <TopMenuBar />
        <main style={{ padding: 24 }}>{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;