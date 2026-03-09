import { useState, useEffect, useCallback } from "react";
import type { HistoryListResponse } from "@/types/config";
import { fetchHistory } from "@/lib/api";

interface UseHistoryParams {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  offset?: number;
  limit?: number;
}

export function useHistory(params: UseHistoryParams) {
  const [data, setData] = useState<HistoryListResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchHistory(params);
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [
    params.search,
    params.status,
    params.startDate,
    params.endDate,
    params.offset,
    params.limit,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, refetch: load };
}
