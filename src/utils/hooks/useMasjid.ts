import { useHookstate } from '@hookstate/core';
import { useState } from 'react';
import { masjidStore } from '../../store/MasjidStore';
import { getListMasjidSubscribedByUser } from '../../api/masjidController';

export default function useMasjid() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const masjid = useHookstate(masjidStore).get();

  const getMasjidListSubscribedByUser = async (userId: string) => {
    setIsLoading(true);
    await getListMasjidSubscribedByUser(userId);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    store: masjid,
    getMasjidListSubscribedByUser,
  };
}
