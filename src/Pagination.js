import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const perPageOptions = [10, 20, 30, 50];

function Pagination({ page, setPage, perPage, setPerPage, total }) {
  const totalPages = Math.ceil(total / perPage);

  return (
    <div style={styles.wrapper}>
      {/* Left: rows per page dropdown */}
      <select
        value={perPage}
        onChange={(e) => {
          setPerPage(Number(e.target.value));
          setPage(1);
        }}
        style={styles.select}
      >
        {perPageOptions.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* Right: pages */}
      <div style={styles.right}>
        <button style={styles.navBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>
          <ChevronLeftIcon style={{ fontSize: 20 }} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              ...styles.pageBtn,
              background: p === page ? "#e8f0fe" : "transparent",
              color: p === page ? "#2563eb" : "#444",
              fontWeight: p === page ? 600 : 400,
            }}
          >
            {p}
          </button>
        ))}

        <button style={styles.navBtn} disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          <ChevronRightIcon style={{ fontSize: 20 }} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16 },
  select: { padding: "8px 12px", border: "1px solid #e5e5e5", borderRadius: 10, fontSize: 14, fontWeight: 600, background: "#fff", cursor: "pointer", outline: "none" },
  right: { display: "flex", alignItems: "center", gap: 6 },
  pageBtn: { border: "none", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 14 },
  navBtn: { border: "none", background: "transparent", color: "#888", cursor: "pointer", display: "flex", alignItems: "center" },
};

export default Pagination;