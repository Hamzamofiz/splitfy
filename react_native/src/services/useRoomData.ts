import { useCallback, useEffect, useState } from 'react';

import { getApiErrorMessage, roomApi, type Room } from './api';

export default function useRoomData() {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRoom(await roomApi.getMyRoom());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { room, setRoom, loading, error, reload };
}
