import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

const supabase = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY")
);

interface PromptRow {
  id: string;
  title: string;
  description: string;
  payload: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  payload: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

function mapPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    payload: row.payload,
    category: row.category,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export const db = {
  prompt: {
    async findMany(
      opts?: { orderBy?: { createdAt?: "asc" | "desc" } }
    ): Promise<Prompt[]> {
      const ascending = opts?.orderBy?.createdAt === "desc" ? false : true;
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending });
      if (error) throw error;
      return (data ?? []).map(mapPrompt);
    },

    async findUnique(opts: { where: { id: string } }): Promise<Prompt | null> {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", opts.where.id)
        .single();
      if (error) return null;
      return mapPrompt(data as PromptRow);
    },

    async create(opts: {
      data: {
        title: string;
        description: string;
        payload: string;
        category: string;
      };
    }): Promise<Prompt> {
      const { data, error } = await supabase
        .from("prompts")
        .insert({
          title: opts.data.title,
          description: opts.data.description,
          payload: opts.data.payload,
          category: opts.data.category,
        })
        .select()
        .single();
      if (error) throw error;
      return mapPrompt(data as PromptRow);
    },

    async delete(opts: { where: { id: string } }): Promise<void> {
      const { error } = await supabase
        .from("prompts")
        .delete()
        .eq("id", opts.where.id);
      if (error) throw error;
    },

    async count(): Promise<number> {
      const { count, error } = await supabase
        .from("prompts")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  },

  async $disconnect(): Promise<void> {
    // No-op for supabase-js (HTTP-based, no connection pool to close).
  },
};
