export const PROMPT_CATEGORIES = [
  "Image Prompts",
  "Video Prompts",
  "Vibe Coding",
  "Agent Persona",
] as const;

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

export const CATEGORY_META: Record<
  PromptCategory,
  { code: string; accent: string }
> = {
  "Image Prompts": { code: "IMG", accent: "text-neon" },
  "Video Prompts": { code: "VID", accent: "text-silver" },
  "Vibe Coding": { code: "COD", accent: "text-neon" },
  "Agent Persona": { code: "AGT", accent: "text-silver" },
};

export function isPromptCategory(value: string): value is PromptCategory {
  return (PROMPT_CATEGORIES as readonly string[]).includes(value);
}

export interface PromptDTO {
  id: string;
  title: string;
  description: string;
  payload: string;
  category: string;
  createdAt: string;
}
