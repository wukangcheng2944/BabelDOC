import { createContext, useContext, useReducer, useEffect, type Dispatch } from "react";
import type {
  BabelDocConfig,
  ConfigAction,
  PresetSavedFields,
  PresetStorageMap,
} from "@/types/config";
import { defaultConfig } from "@/lib/defaults";
import { modelPresets } from "@/lib/presets";

// ── localStorage keys ──────────────────────────────────────────────
const STORAGE_KEY_PRESETS = "babeldoc-preset-storage";
const STORAGE_KEY_ACTIVE = "babeldoc-active-preset";

// ── Preset-specific fields (the fields that get saved/restored per preset) ──
const PRESET_FIELDS: (keyof PresetSavedFields)[] = [
  "openaiModel",
  "openaiBaseUrl",
  "openaiApiKey",
  "customSystemPrompt",
  "enableJsonModeIfRequested",
  "sendDashscopeHeader",
  "noSendTemperature",
  "openaiReasoning",
];

function extractPresetFields(config: BabelDocConfig): PresetSavedFields {
  return {
    openaiModel: config.openaiModel,
    openaiBaseUrl: config.openaiBaseUrl,
    openaiApiKey: config.openaiApiKey,
    customSystemPrompt: config.customSystemPrompt,
    enableJsonModeIfRequested: config.enableJsonModeIfRequested,
    sendDashscopeHeader: config.sendDashscopeHeader,
    noSendTemperature: config.noSendTemperature,
    openaiReasoning: config.openaiReasoning,
  };
}

function applyPresetFields(
  config: BabelDocConfig,
  fields: PresetSavedFields
): BabelDocConfig {
  return { ...config, ...fields };
}

// ── Build initial per-preset defaults from the static preset definitions ──
function buildDefaultPresetStorage(): PresetStorageMap {
  const map: PresetStorageMap = {};
  for (const p of modelPresets) {
    map[p.id] = {
      openaiModel: p.model,
      openaiBaseUrl: p.baseUrl,
      openaiApiKey: "",
      customSystemPrompt: "",
      enableJsonModeIfRequested: false,
      sendDashscopeHeader: p.sendDashscopeHeader ?? false,
      noSendTemperature: false,
      openaiReasoning: "",
    };
  }
  return map;
}

// ── Persistence helpers ────────────────────────────────────────────
function loadPresetStorage(): PresetStorageMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRESETS);
    if (raw) {
      const parsed = JSON.parse(raw) as PresetStorageMap;
      // Merge with defaults so newly-added presets always have entries
      const defaults = buildDefaultPresetStorage();
      for (const id of Object.keys(defaults)) {
        if (!parsed[id]) parsed[id] = defaults[id];
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return buildDefaultPresetStorage();
}

function savePresetStorage(map: PresetStorageMap) {
  try {
    localStorage.setItem(STORAGE_KEY_PRESETS, JSON.stringify(map));
  } catch {
    // ignore
  }
}

function loadActivePresetId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE) ?? "openai";
  } catch {
    return "openai";
  }
}

function saveActivePresetId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE, id);
  } catch {
    // ignore
  }
}

// ── Combined state ─────────────────────────────────────────────────
interface ConfigState {
  config: BabelDocConfig;
  activePresetId: string;
  presetStorage: PresetStorageMap;
}

function buildInitialState(): ConfigState {
  const presetStorage = loadPresetStorage();
  const activePresetId = loadActivePresetId();
  const saved = presetStorage[activePresetId];
  const config = saved
    ? applyPresetFields(defaultConfig, saved)
    : defaultConfig;
  return { config, activePresetId, presetStorage };
}

// ── Reducer ────────────────────────────────────────────────────────
function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
    case "SET_FIELD": {
      const newConfig = applyLinkages({
        ...state.config,
        [action.field]: action.value,
      });

      // If the changed field is a preset field, also update the active preset storage
      const newStorage = { ...state.presetStorage };
      if (PRESET_FIELDS.includes(action.field as keyof PresetSavedFields)) {
        newStorage[state.activePresetId] = extractPresetFields(newConfig);
      }

      return { ...state, config: newConfig, presetStorage: newStorage };
    }

    case "SWITCH_PRESET": {
      const { presetId } = action;
      // Save current fields to old preset
      const newStorage = { ...state.presetStorage };
      newStorage[state.activePresetId] = extractPresetFields(state.config);

      // Load saved fields from new preset
      const saved = newStorage[presetId];
      const newConfig = saved
        ? applyPresetFields(state.config, saved)
        : state.config;

      return {
        config: newConfig,
        activePresetId: presetId,
        presetStorage: newStorage,
      };
    }

    case "APPLY_COMPATIBILITY":
      return {
        ...state,
        config: {
          ...state.config,
          enhanceCompatibility: true,
          skipClean: true,
          dualTranslateFirst: true,
          disableRichTextTranslate: true,
        },
      };

    case "APPLY_OCR_WORKAROUND":
      return {
        ...state,
        config: {
          ...state.config,
          ocrWorkaround: true,
          skipScannedDetection: true,
          disableRichTextTranslate: true,
          removeNonFormulaLines: false,
        },
      };

    case "RESET": {
      const freshStorage = buildDefaultPresetStorage();
      return {
        config: defaultConfig,
        activePresetId: "openai",
        presetStorage: freshStorage,
      };
    }

    case "IMPORT": {
      const imported = applyLinkages({ ...defaultConfig, ...action.config });
      const newStorage = { ...state.presetStorage };
      newStorage[state.activePresetId] = extractPresetFields(imported);
      return { ...state, config: imported, presetStorage: newStorage };
    }

    default:
      return state;
  }
}

function applyLinkages(state: BabelDocConfig): BabelDocConfig {
  const next = { ...state };

  if (next.enhanceCompatibility) {
    next.skipClean = true;
    next.dualTranslateFirst = true;
    next.disableRichTextTranslate = true;
  }

  if (next.ocrWorkaround) {
    next.skipScannedDetection = true;
    next.disableRichTextTranslate = true;
    next.removeNonFormulaLines = false;
  }

  if (next.autoEnableOcrWorkaround) {
    next.ocrWorkaround = false;
    next.skipScannedDetection = false;
  }

  return next;
}

// ── Context ────────────────────────────────────────────────────────
export interface ConfigContextValue {
  config: BabelDocConfig;
  dispatch: Dispatch<ConfigAction>;
  setField: <K extends keyof BabelDocConfig>(
    field: K,
    value: BabelDocConfig[K]
  ) => void;
  activePresetId: string;
  presetStorage: PresetStorageMap;
}

export const ConfigContext = createContext<ConfigContextValue>({
  config: defaultConfig,
  dispatch: () => {},
  setField: () => {},
  activePresetId: "openai",
  presetStorage: {},
});

export function useConfig() {
  return useContext(ConfigContext);
}

export function useConfigReducer() {
  const [state, dispatch] = useReducer(configReducer, undefined, buildInitialState);

  // Persist to localStorage on every change
  useEffect(() => {
    savePresetStorage(state.presetStorage);
    saveActivePresetId(state.activePresetId);
  }, [state.presetStorage, state.activePresetId]);

  const setField = <K extends keyof BabelDocConfig>(
    field: K,
    value: BabelDocConfig[K]
  ) => {
    dispatch({
      type: "SET_FIELD",
      field,
      value: value as BabelDocConfig[keyof BabelDocConfig],
    });
  };

  return {
    config: state.config,
    dispatch,
    setField,
    activePresetId: state.activePresetId,
    presetStorage: state.presetStorage,
  };
}
