import { useCallback, useEffect, useState } from "react";
import { apiRequest, ApiError } from "../services/api";

export default function useRoomData(userId) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/room");
      setRoom(response.room);
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 404) {
        setRoom(null);
      } else {
        setError(requestError.message || "Unable to load room information.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) refresh();
  }, [userId, refresh]);

  return { room, loading, error, refresh };
}
