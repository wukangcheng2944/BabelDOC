import type { ModelPreset } from '@/types/config';

export const modelPresets: ModelPreset[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o Mini',
    model: 'gpt-4o-mini',
    baseUrl: 'https://api.openai.com/v1',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek Chat',
    model: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com/v1',
  },
  {
    id: 'qwen',
    name: 'Qwen',
    description: '通义千问 Plus',
    model: 'qwen-plus',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    sendDashscopeHeader: true,
  },
  {
    id: 'glm',
    name: 'GLM',
    description: '智谱 GLM-4-Flash',
    model: 'glm-4-flash',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  },
  {
    id: 'kimi',
    name: 'Kimi',
    description: 'Moonshot v1-8k',
    model: 'moonshot-v1-8k',
    baseUrl: 'https://api.moonshot.cn/v1',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: '本地模型',
    model: 'llama3',
    baseUrl: 'http://localhost:11434/v1',
    apiKeyOptional: true,
  },
  {
    id: 'custom',
    name: 'Custom',
    description: '自定义配置',
    model: '',
    baseUrl: '',
  },
];
