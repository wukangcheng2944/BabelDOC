import type { BabelDocConfig, TranslationResult, TokenEstimate, HistoryListResponse } from '@/types/config';

const API_BASE = '/api';

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function convertKeysToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value;
  }
  return result;
}

export async function uploadFile(file: File): Promise<{ fileId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  const data = await res.json();
  return { fileId: data.file_id ?? data.fileId };
}

export async function uploadGlossary(file: File): Promise<{ fileId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload?type=glossary`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Glossary upload failed: ${res.statusText}`);
  const data = await res.json();
  return { fileId: data.file_id ?? data.fileId };
}

export async function startTranslation(
  fileId: string,
  config: BabelDocConfig,
  glossaryIds: string[],
): Promise<{ taskId: string }> {
  const snakeConfig = convertKeysToSnake(config as unknown as Record<string, unknown>);
  const res = await fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file_id: fileId,
      config: snakeConfig,
      glossary_ids: glossaryIds,
    }),
  });
  if (!res.ok) throw new Error(`Start translation failed: ${res.statusText}`);
  const data = await res.json();
  return { taskId: data.task_id ?? data.taskId };
}

export async function getTaskStatus(taskId: string): Promise<{
  status: string;
  progress: number;
  stage: string;
  result: TranslationResult | null;
  error: string | null;
}> {
  const res = await fetch(`${API_BASE}/translate/${taskId}/status`);
  if (!res.ok) throw new Error(`Status check failed: ${res.statusText}`);
  return res.json();
}

export function getDownloadUrl(taskId: string, type: 'dual' | 'mono' | 'glossary'): string {
  return `${API_BASE}/download/${taskId}/${type}`;
}

export function createTranslationWebSocket(taskId: string): WebSocket {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return new WebSocket(`${protocol}//${host}/ws/translate/${taskId}`);
}

// Token estimation
export async function estimateTokens(file: File, model: string): Promise<TokenEstimate> {
  // First upload the file to get a file_id, then call estimate
  const { fileId } = await uploadFile(file);
  const res = await fetch(`${API_BASE}/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_id: fileId, model }),
  });
  if (!res.ok) throw new Error(`Estimate failed: ${res.statusText}`);
  const data = await res.json();
  return {
    pageCount: data.page_count,
    characterCount: data.character_count,
    estimatedTokens: data.estimated_tokens,
    model: data.model,
    estimatedCostUsd: data.estimated_cost_usd,
  };
}

// History
export async function fetchHistory(params: {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  offset?: number;
  limit?: number;
}): Promise<HistoryListResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.startDate) searchParams.set('start_date', params.startDate);
  if (params.endDate) searchParams.set('end_date', params.endDate);
  if (params.offset != null) searchParams.set('offset', String(params.offset));
  if (params.limit != null) searchParams.set('limit', String(params.limit));

  const res = await fetch(`${API_BASE}/history?${searchParams.toString()}`);
  if (!res.ok) throw new Error(`History fetch failed: ${res.statusText}`);
  const data = await res.json();
  return {
    items: (data.items ?? []).map((item: Record<string, unknown>) => ({
      taskId: item.task_id,
      filename: item.filename,
      model: item.model,
      langIn: item.lang_in,
      langOut: item.lang_out,
      status: item.status,
      startedAt: item.started_at,
      completedAt: item.completed_at,
      totalSeconds: item.total_seconds,
      pageCount: item.page_count,
      tokenCount: item.token_count,
      promptTokenCount: item.prompt_token_count,
      completionTokenCount: item.completion_token_count,
      cacheHitTokenCount: item.cache_hit_token_count,
      peakMemoryUsage: item.peak_memory_usage,
      characterCount: item.character_count,
      error: item.error,
      dualPdfUrl: item.dual_pdf_url,
      monoPdfUrl: item.mono_pdf_url,
      glossaryUrl: item.glossary_url,
    })),
    total: data.total as number,
    offset: data.offset as number,
    limit: data.limit as number,
  };
}

export async function deleteHistoryEntry(taskId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/history/${taskId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
}
