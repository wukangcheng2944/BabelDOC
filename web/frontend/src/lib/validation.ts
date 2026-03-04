import type { BabelDocConfig } from '@/types/config';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateConfig(config: BabelDocConfig, hasFile: boolean): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!hasFile) {
    errors.push({ field: 'file', message: 'Please upload a PDF file' });
  }

  if (!config.openaiApiKey && !config.openaiBaseUrl.includes('localhost')) {
    errors.push({ field: 'openaiApiKey', message: 'API Key is required' });
  }

  if (!config.openaiModel) {
    errors.push({ field: 'openaiModel', message: 'Model name is required' });
  }

  if (!config.langIn) {
    errors.push({ field: 'langIn', message: 'Source language is required' });
  }

  if (!config.langOut) {
    errors.push({ field: 'langOut', message: 'Target language is required' });
  }

  if (config.pages) {
    const pagesRegex = /^(\d+(-\d*)?)(,\s*\d+(-\d*)?)*$/;
    if (!pagesRegex.test(config.pages)) {
      errors.push({ field: 'pages', message: 'Invalid page range format' });
    }
  }

  if (config.qps < 1 || config.qps > 100) {
    errors.push({ field: 'qps', message: 'QPS must be between 1 and 100' });
  }

  if (config.shortLineSplitFactor < 0 || config.shortLineSplitFactor > 1) {
    errors.push({ field: 'shortLineSplitFactor', message: 'Split factor must be between 0 and 1' });
  }

  return errors;
}
