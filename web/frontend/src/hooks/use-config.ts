import { createContext, useContext, useReducer, type Dispatch } from "react";
import type { BabelDocConfig, ConfigAction, ModelPreset } from "@/types/config";
import { defaultConfig } from "@/lib/defaults";

function configReducer(
  state: BabelDocConfig,
  action: ConfigAction
): BabelDocConfig {
  switch (action.type) {
    case "SET_FIELD":
      return applyLinkages({ ...state, [action.field]: action.value });

    case "APPLY_PRESET":
      return applyPreset(state, action.preset);

    case "APPLY_COMPATIBILITY":
      return {
        ...state,
        enhanceCompatibility: true,
        skipClean: true,
        dualTranslateFirst: true,
        disableRichTextTranslate: true,
      };

    case "APPLY_OCR_WORKAROUND":
      return {
        ...state,
        ocrWorkaround: true,
        skipScannedDetection: true,
        disableRichTextTranslate: true,
        removeNonFormulaLines: false,
      };

    case "RESET":
      return { ...defaultConfig };

    case "IMPORT":
      return applyLinkages({ ...defaultConfig, ...action.config });

    default:
      return state;
  }
}

function applyPreset(
  state: BabelDocConfig,
  preset: ModelPreset
): BabelDocConfig {
  return {
    ...state,
    openaiModel: preset.model,
    openaiBaseUrl: preset.baseUrl,
    sendDashscopeHeader: preset.sendDashscopeHeader ?? false,
  };
}

function applyLinkages(state: BabelDocConfig): BabelDocConfig {
  const next = { ...state };

  // enhanceCompatibility overrides
  if (next.enhanceCompatibility) {
    next.skipClean = true;
    next.dualTranslateFirst = true;
    next.disableRichTextTranslate = true;
  }

  // ocrWorkaround overrides
  if (next.ocrWorkaround) {
    next.skipScannedDetection = true;
    next.disableRichTextTranslate = true;
    next.removeNonFormulaLines = false;
  }

  // autoEnableOcrWorkaround resets ocr settings
  if (next.autoEnableOcrWorkaround) {
    next.ocrWorkaround = false;
    next.skipScannedDetection = false;
  }

  return next;
}

export interface ConfigContextValue {
  config: BabelDocConfig;
  dispatch: Dispatch<ConfigAction>;
  setField: <K extends keyof BabelDocConfig>(
    field: K,
    value: BabelDocConfig[K]
  ) => void;
}

export const ConfigContext = createContext<ConfigContextValue>({
  config: defaultConfig,
  dispatch: () => {},
  setField: () => {},
});

export function useConfig() {
  return useContext(ConfigContext);
}

export function useConfigReducer() {
  const [config, dispatch] = useReducer(configReducer, defaultConfig);

  const setField = <K extends keyof BabelDocConfig>(
    field: K,
    value: BabelDocConfig[K]
  ) => {
    dispatch({ type: "SET_FIELD", field, value: value as BabelDocConfig[keyof BabelDocConfig] });
  };

  return { config, dispatch, setField };
}
