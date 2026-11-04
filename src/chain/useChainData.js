import { useCallback, useEffect, useState } from "react";
import { loadChain } from "./chain";

// Loads blocks + contracts from the chain when a page opens; reload() reads again.
export function useChainData() {
  const [data, setData] = useState({ blocks: [], contracts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await loadChain());
    } catch (err) {
      setData({ blocks: [], contracts: [] });
      setError(err?.message || "Could not read the chain");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...data, loading, error, reload };
}