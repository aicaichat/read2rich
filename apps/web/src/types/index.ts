export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Session {
  id: string;
  title: string;
  initial_idea: string;
  status: 'active' | 'completed' | 'archived';
  current_requirements: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface GeneratedPrompt {
  id: string;
  session_id: string;
  type?: string;
  content?: string;
  summary?: string;
  code_prompt?: string;
  pm_prompt?: string;
  status: 'draft' | 'confirmed' | 'used';
  created_at: string;
}

export interface CodeGeneration {
  id: number;
  prompt_id: string;
  type?: string;
  content?: string;
  generated_code?: string;
  file_structure?: Record<string, any>;
  pm_plan?: string;
  model_used?: string;
  status: string;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface SessionCreateForm {
  title?: string;
  initial_idea: string;
}

export interface MessageCreateForm {
  content: string;
} 