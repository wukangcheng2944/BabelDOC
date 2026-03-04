import type { BabelDocConfig, TranslationResult } from '@/types/config';

const API_BASE = '/api';

export async function uploadFile(file: File): Promise<{ fileId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
  return res.json();
}

export async function uploadGlossary(file: File): Promise<{ fileId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload?type=glossary`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Glossary upload failed: ${res.statusText}`);
  return res.json();
}

export async function startTranslation(
  fileId: string,
  config: BabelDocConfig,
  glossaryIds: string[],
): Promise<{ taskId: string }> {
  const res = await fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId, config, glossaryIds }),
  });
  if (!res.ok) throw new Error(`Start translation failed: ${res.statusText}`);
  return res.json();
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
