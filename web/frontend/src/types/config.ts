export type WatermarkOutputMode = 'watermarked' | 'no_watermark' | 'both';

export type OutputMode = 'dual_and_mono' | 'dual_only' | 'mono_only';

export type PrimaryFontFamily = 'serif' | 'sans-serif' | 'script' | null;

export interface BabelDocConfig {
  // File
  langIn: string;
  langOut: string;
  pages: string;

  // Translation Service
  openaiModel: string;
  openaiBaseUrl: string;
  openaiApiKey: string;
  customSystemPrompt: string;
  enableJsonModeIfRequested: boolean;
  sendDashscopeHeader: boolean;
  noSendTemperature: boolean;
  openaiReasoning: string;

  // Term Extraction
  autoExtractGlossary: boolean;
  saveAutoExtractedGlossary: boolean;
  useIndependentTermModel: boolean;
  openaiTermExtractionModel: string;
  openaiTermExtractionBaseUrl: string;
  openaiTermExtractionApiKey: string;
  openaiTermExtractionReasoning: string;

  // Output
  outputMode: OutputMode;
  watermarkOutputMode: WatermarkOutputMode;
  useAlternatingPagesDual: boolean;
  dualTranslateFirst: boolean;
  onlyIncludeTranslatedPage: boolean;
  primaryFontFamily: PrimaryFontFamily;

  // PDF Processing
  skipClean: boolean;
  disableRichTextTranslate: boolean;
  enhanceCompatibility: boolean;
  mergeAlternatingLineNumbers: boolean;
  splitShortLines: boolean;
  shortLineSplitFactor: number;
  minTextLength: number;
  skipFormRender: boolean;
  skipCurveRender: boolean;
  enableGraphicElementProcess: boolean;
  formularFontPattern: string;
  formularCharPattern: string;
  addFormulaPlaceholdHint: boolean;
  disableSameTextFallback: boolean;
  removeNonFormulaLines: boolean;
  nonFormulaLineIouThreshold: number;
  figureTableProtectionThreshold: number;
  skipFormulaOffsetCalculation: boolean;

  // OCR
  ocrWorkaround: boolean;
  autoEnableOcrWorkaround: boolean;
  skipScannedDetection: boolean;

  // Performance
  qps: number;
  poolMaxWorkers: number | null;
  termPoolMaxWorkers: number | null;
  maxPagesPerPart: number | null;
  reportInterval: number;

  // Advanced
  debug: boolean;
  skipTranslation: boolean;
  onlyParseGeneratePdf: boolean;
  ignoreCache: boolean;
  translateTableText: boolean;
  showCharBox: boolean;
}

export interface ModelPreset {
  id: string;
  name: string;
  description: string;
  model: string;
  baseUrl: string;
  sendDashscopeHeader?: boolean;
  apiKeyOptional?: boolean;
}

/** Per-preset saved fields — each preset independently stores its own API config. */
export interface PresetSavedFields {
  openaiModel: string;
  openaiBaseUrl: string;
  openaiApiKey: string;
  customSystemPrompt: string;
  enableJsonModeIfRequested: boolean;
  sendDashscopeHeader: boolean;
  noSendTemperature: boolean;
  openaiReasoning: string;
}

export type PresetStorageMap = Record<string, PresetSavedFields>;

export interface LanguageOption {
  code: string;
  nameEn: string;
  nameZh: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface ResourceUsage {
  totalSeconds: number | null;
  peakMemoryUsage: number | null;
  characterCount: number | null;
  tokenCount: number | null;
  promptTokenCount: number | null;
  completionTokenCount: number | null;
  cacheHitTokenCount: number | null;
}

export interface TranslationTask {
  id: string;
  status: 'pending' | 'uploading' | 'translating' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  stage: string;
  stageProgress: number;
  stageCurrent: number;
  stageTotal: number;
  partIndex: number;
  totalParts: number;
  error: string | null;
  result: TranslationResult | null;
}

export interface TranslationResult {
  dualPdfUrl: string | null;
  monoPdfUrl: string | null;
  glossaryUrl: string | null;
  totalSeconds: number;
  resourceUsage: ResourceUsage | null;
}

export interface TokenEstimate {
  pageCount: number;
  characterCount: number;
  estimatedTokens: number;
  model: string;
  estimatedCostUsd: number | null;
}

export interface TaskHistoryEntry {
  taskId: string;
  filename: string;
  model: string;
  langIn: string;
  langOut: string;
  status: 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt: string;
  totalSeconds: number | null;
  pageCount: number | null;
  tokenCount: number | null;
  promptTokenCount: number | null;
  completionTokenCount: number | null;
  cacheHitTokenCount: number | null;
  peakMemoryUsage: number | null;
  characterCount: number | null;
  error: string | null;
  dualPdfUrl: string | null;
  monoPdfUrl: string | null;
  glossaryUrl: string | null;
}

export interface HistoryListResponse {
  items: TaskHistoryEntry[];
  total: number;
  offset: number;
  limit: number;
}

export type ConfigAction =
  | { type: 'SET_FIELD'; field: keyof BabelDocConfig; value: BabelDocConfig[keyof BabelDocConfig] }
  | { type: 'SWITCH_PRESET'; presetId: string }
  | { type: 'APPLY_COMPATIBILITY' }
  | { type: 'APPLY_OCR_WORKAROUND' }
  | { type: 'RESET' }
  | { type: 'IMPORT'; config: Partial<BabelDocConfig> };
