import { ProviderId } from './keys';

export interface AiRequest {
  system: string;
  user: string;
  jsonMode?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface AiTextResult {
  text: string;
  model: string;
}

export interface ProviderOperationArgs {
  apiKey: string;
  provider: ProviderId;
  keyId: string;
}

export interface FailoverResult<T> {
  result: T;
  provider: ProviderId;
  keyId: string;
  attempts: number;
  latencyMs: number;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface GenerateResult {
  projectName: string;
  description: string;
  files: GeneratedFile[];
  setup?: {
    install?: string[];
    dev?: string;
    build?: string;
  };
  notes?: string[];
}

export interface ChatFileChange {
  path: string;
  content?: string;
  language?: string;
  action?: 'create' | 'update' | 'delete';
}

export interface ChatResult {
  summary: string;
  files: ChatFileChange[];
}
