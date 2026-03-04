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
}

export type ConfigAction =
  | { type: 'SET_FIELD'; field: keyof BabelDocConfig; value: BabelDocConfig[keyof BabelDocConfig] }
  | { type: 'APPLY_PRESET'; preset: ModelPreset }
  | { type: 'APPLY_COMPATIBILITY' }
  | { type: 'APPLY_OCR_WORKAROUND' }
  | { type: 'RESET' }
  | { type: 'IMPORT'; config: Partial<BabelDocConfig> };
