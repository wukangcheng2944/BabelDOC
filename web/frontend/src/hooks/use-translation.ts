import { useState, useCallback, useRef } from "react";
import type {
  BabelDocConfig,
  TranslationTask,
  TranslationResult,
  ResourceUsage,
} from "@/types/config";
import {
  uploadFile,
  startTranslation,
  createTranslationWebSocket,
} from "@/lib/api";

const initialTask: TranslationTask = {
  id: "",
  status: "pending",
  progress: 0,
  stage: "",
  stageProgress: 0,
  stageCurrent: 0,
  stageTotal: 0,
  partIndex: 1,
  totalParts: 1,
  error: null,
  result: null,
};

export function useTranslationTask() {
  const [task, setTask] = useState<TranslationTask>(initialTask);
  const wsRef = useRef<WebSocket | null>(null);

  const reset = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setTask(initialTask);
  }, []);

  const startTranslate = useCallback(
    async (file: File, config: BabelDocConfig, glossaryIds: string[]) => {
      reset();

      try {
        // Upload file
        setTask((t) => ({ ...t, status: "uploading", progress: 0 }));
        const { fileId } = await uploadFile(file);

        // Start translation
        setTask((t) => ({ ...t, status: "translating", progress: 0 }));
        const { taskId } = await startTranslation(fileId, config, glossaryIds);

        setTask((t) => ({ ...t, id: taskId }));

        // Connect WebSocket for progress
        const ws = createTranslationWebSocket(taskId);
        wsRef.current = ws;

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === "progress") {
            setTask((t) => ({
              ...t,
              status: "translating",
              progress: (data.progress ?? 0) * 100,
              stage: data.stage ?? "",
              stageProgress: (data.stageProgress ?? 0) * 100,
              stageCurrent: data.stageCurrent ?? 0,
              stageTotal: data.stageTotal ?? 0,
              partIndex: data.partIndex ?? 1,
              totalParts: data.totalParts ?? 1,
            }));
          } else if (data.type === "finish") {
            let resourceUsage: ResourceUsage | null = null;
            if (data.result?.resource_usage) {
              const ru = data.result.resource_usage;
              resourceUsage = {
                totalSeconds: ru.total_seconds ?? null,
                peakMemoryUsage: ru.peak_memory_usage ?? null,
                characterCount: ru.character_count ?? null,
                tokenCount: ru.token_count ?? null,
                promptTokenCount: ru.prompt_token_count ?? null,
                completionTokenCount: ru.completion_token_count ?? null,
                cacheHitTokenCount: ru.cache_hit_token_count ?? null,
              };
            }

            const result: TranslationResult = {
              dualPdfUrl: data.result?.dual_pdf ?? null,
              monoPdfUrl: data.result?.mono_pdf ?? null,
              glossaryUrl: data.result?.glossary ?? null,
              totalSeconds: data.result?.total_seconds ?? 0,
              resourceUsage,
            };
            setTask((t) => ({
              ...t,
              status: "completed",
              progress: 100,
              result,
            }));
            ws.close();
          } else if (data.type === "error") {
            setTask((t) => ({
              ...t,
              status: "failed",
              error: data.message ?? "Unknown error",
            }));
            ws.close();
          }
        };

        ws.onerror = () => {
          setTask((t) => ({
            ...t,
            status: "failed",
            error: "WebSocket connection error",
          }));
        };

        ws.onclose = () => {
          wsRef.current = null;
        };
      } catch (err) {
        setTask((t) => ({
          ...t,
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    },
    [reset]
  );

  const cancelTranslation = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "cancel" }));
    }
    setTask((t) => ({ ...t, status: "cancelled" }));
  }, []);

  return {
    task,
    startTranslate,
    cancelTranslation,
    reset,
  };
}
