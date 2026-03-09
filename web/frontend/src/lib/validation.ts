import type { BabelDocConfig } from '@/types/config';
import { modelPresets } from '@/lib/presets';
import type { Locale } from '@/i18n';
import { t } from '@/i18n';

export interface ValidationError {
  field: string;
  message: string;
}

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

function isLocalUrl(url: string): boolean {
  return url.includes('localhost') || url.includes('127.0.0.1');
}

export function validateConfig(
  config: BabelDocConfig,
  hasFile: boolean,
  locale: Locale,
  activePresetId?: string,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!hasFile) {
    errors.push({ field: 'file', message: t(locale, 'validation.fileRequired') });
  }

  // Check if current preset has apiKeyOptional
  const activePreset = activePresetId
    ? modelPresets.find((p) => p.id === activePresetId)
    : null;
  const apiKeyOptional = activePreset?.apiKeyOptional ?? false;

  if (!config.openaiApiKey && !isLocalUrl(config.openaiBaseUrl) && !apiKeyOptional) {
    errors.push({ field: 'openaiApiKey', message: t(locale, 'validation.apiKeyRequired') });
  }

  if (!config.openaiModel) {
    errors.push({ field: 'openaiModel', message: t(locale, 'validation.modelRequired') });
  }

  if (!config.langIn) {
    errors.push({ field: 'langIn', message: t(locale, 'validation.langInRequired') });
  }

  if (!config.langOut) {
    errors.push({ field: 'langOut', message: t(locale, 'validation.langOutRequired') });
  }

  if (config.pages) {
    const pagesRegex = /^(\d+(-\d*)?)(,\s*\d+(-\d*)?)*$/;
    if (!pagesRegex.test(config.pages)) {
      errors.push({ field: 'pages', message: t(locale, 'validation.pagesInvalid') });
    }
  }

  if (config.qps < 1 || config.qps > 100) {
    errors.push({ field: 'qps', message: t(locale, 'validation.qpsRange') });
  }

  if (config.shortLineSplitFactor < 0 || config.shortLineSplitFactor > 1) {
    errors.push({ field: 'shortLineSplitFactor', message: t(locale, 'validation.splitFactorRange') });
  }

  // Independent term model validation
  if (config.useIndependentTermModel) {
    if (!config.openaiTermExtractionModel) {
      errors.push({ field: 'openaiTermExtractionModel', message: t(locale, 'validation.termModelRequired') });
    }
    if (!config.openaiTermExtractionApiKey && !isLocalUrl(config.openaiTermExtractionBaseUrl)) {
      errors.push({ field: 'openaiTermExtractionApiKey', message: t(locale, 'validation.termApiKeyRequired') });
    }
    if (!config.openaiTermExtractionBaseUrl) {
      errors.push({ field: 'openaiTermExtractionBaseUrl', message: t(locale, 'validation.termBaseUrlRequired') });
    }
  }

  return errors;
}

export function validateFileSize(file: File, locale: Locale): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return t(locale, 'validation.fileTooLarge');
  }
  return null;
}
