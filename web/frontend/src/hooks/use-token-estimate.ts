import { useState, useEffect, useRef } from "react";
import type { TokenEstimate } from "@/types/config";
import { estimateTokens } from "@/lib/api";

export function useTokenEstimate(file: File | null, model: string) {
  const [estimate, setEstimate] = useState<TokenEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!file) {
      setEstimate(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      try {
        const result = await estimateTokens(file, model);
        setEstimate(result);
      } catch {
        setEstimate(null);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [file, model]);

  return { estimate, loading };
}
