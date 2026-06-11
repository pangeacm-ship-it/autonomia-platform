import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AiConversation, AiMessage } from "@/types/database";

export async function getCompanyConversations(companyId: string): Promise<AiConversation[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return [];

  const { data } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("company_id", companyId)
    .eq("channel", "dashboard")
    .neq("status", "archived")
    .order("updated_at", { ascending: false })
    .limit(20);

  return (data ?? []) as AiConversation[];
}

export async function getConversationMessages(conversationId: string): Promise<AiMessage[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return [];

  const { data } = await supabase
    .from("ai_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return (data ?? []) as AiMessage[];
}

export async function createConversation(companyId: string, title: string): Promise<string | null> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return null;

  const { data } = await supabase
    .from("ai_conversations")
    .insert({
      company_id: companyId,
      channel: "dashboard",
      status: "open",
      title,
      module_key: "centro_ia",
    })
    .select("id")
    .single();

  return data?.id ?? null;
}

export async function saveMessage({
  conversationId,
  companyId,
  role,
  content,
}: {
  conversationId: string;
  companyId: string;
  role: AiMessage["role"];
  content: string;
}): Promise<void> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) return;

  await Promise.all([
    supabase.from("ai_messages").insert({
      conversation_id: conversationId,
      company_id: companyId,
      role,
      content,
      metadata: {},
    }),
    supabase
      .from("ai_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId),
  ]);
}
