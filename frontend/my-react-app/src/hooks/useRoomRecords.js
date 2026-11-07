import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

export default function useRoomRecords(endpoint, responseKey) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(Boolean(endpoint));
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!endpoint) {
      setRecords([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await apiRequest(endpoint);
      const responseRecords =
        response?.[responseKey] ?? response?.data?.[responseKey];
      if (!Array.isArray(responseRecords)) {
        throw new Error(`The server returned an invalid ${responseKey} response.`);
      }
      setRecords(responseRecords);
    } catch (requestError) {
      setError(requestError.message || "Unable to load room data.");
    } finally {
      setLoading(false);
    }
  }, [endpoint, responseKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { records, loading, error, refresh };
}
