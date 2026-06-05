"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import type { Post, PostStatus } from "@/types/database";

type PostInput = {
  company_id: string;
  title: string;
  content: string;
  channels: string[];
  status?: PostStatus;
  scheduled_at?: string | null;
  is_demo?: boolean;
  created_by?: string | null;
};

const fallbackPosts: Post[] = [
  {
    id: "fallback-post-draft",
    company_id: "demo-company-empty",
    created_by: null,
    module_key: "socialia",
    channel: "instagram",
    channels: ["instagram", "facebook"],
    title: "Nueva propuesta destacada de la semana",
    content:
      "Comparte una novedad de tu negocio con un mensaje cercano y preparado para revisar antes de publicar.",
    media_urls: null,
    status: "draft",
    scheduled_at: null,
    published_at: null,
    is_demo: true,
    archived_at: null,
    deleted_at: null,
    created_at: "2026-06-01T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "fallback-post-scheduled",
    company_id: "demo-company-empty",
    created_by: null,
    module_key: "socialia",
    channel: "facebook",
    channels: ["facebook"],
    title: "Promoción semanal",
    content:
      "Publicación interna programada en AutonomIA. Todavía no se enviará a redes reales.",
    media_urls: null,
    status: "scheduled",
    scheduled_at: "2026-06-07T10:00:00.000Z",
    published_at: null,
    is_demo: true,
    archived_at: null,
    deleted_at: null,
    created_at: "2026-06-01T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
  },
];

function normalizeChannels(value: string | string[]) {
  const channels = Array.isArray(value) ? value : [value];

  if (channels.includes("both")) {
    return ["instagram", "facebook"];
  }

  return channels.length ? channels : ["instagram"];
}

function primaryChannel(channels: string[]) {
  return channels[0] ?? "instagram";
}

function cleanPostInput(data: PostInput) {
  const channels = normalizeChannels(data.channels);

  return {
    company_id: data.company_id,
    module_key: "socialia",
    channel: primaryChannel(channels),
    channels,
    title: data.title.trim() || "Publicación sin título",
    content: data.content.trim(),
    status: data.status ?? "draft",
    scheduled_at: data.scheduled_at || null,
    is_demo: Boolean(data.is_demo),
    created_by: data.created_by ?? null,
  };
}

export async function getCompanyPosts(companyId: string): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackPosts;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("company_id", companyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return companyId.startsWith("demo-") ? fallbackPosts : [];
  }

  return data as Post[];
}

export async function createPost(data: PostInput) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase no está configurado." };
  }

  const payload = cleanPostInput(data);

  if (!payload.content) {
    return { ok: false, message: "El contenido es obligatorio." };
  }

  const { error } = await supabase.from("posts").insert(payload);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/socialia");
  return { ok: true, message: "Publicación guardada." };
}

export async function updatePost(postId: string, data: Partial<PostInput>) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase no está configurado." };
  }

  const channels = data.channels ? normalizeChannels(data.channels) : undefined;
  const payload: Partial<Post> = {
    updated_at: new Date().toISOString(),
  };

  if (data.title !== undefined) {
    payload.title = data.title.trim() || "Publicación sin título";
  }

  if (data.content !== undefined) {
    payload.content = data.content.trim();
  }

  if (channels) {
    payload.channels = channels;
    payload.channel = primaryChannel(channels);
  }

  if (data.scheduled_at !== undefined) {
    payload.scheduled_at = data.scheduled_at || null;
  }

  if (data.is_demo !== undefined) {
    payload.is_demo = data.is_demo;
  }

  if (data.status !== undefined) {
    payload.status = data.status;
  }

  const { error } = await supabase
    .from("posts")
    .update(payload)
    .eq("id", postId)
    .is("deleted_at", null);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/socialia");
  return { ok: true, message: "Publicación actualizada." };
}

export async function approvePost(postId: string) {
  return updatePostStatus(postId, "approved", {});
}

export async function schedulePost(postId: string, scheduledAt: string) {
  return updatePostStatus(postId, "scheduled", {
    scheduled_at: scheduledAt,
  });
}

export async function cancelPost(postId: string) {
  return updatePostStatus(postId, "canceled", {});
}

export async function archivePost(postId: string) {
  return updatePostStatus(postId, "archived", {
    archived_at: new Date().toISOString(),
  });
}

async function updatePostStatus(
  postId: string,
  status: PostStatus,
  extra: Partial<Post>,
) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase no está configurado." };
  }

  const { error } = await supabase
    .from("posts")
    .update({
      status,
      ...extra,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/socialia");
  return { ok: true, message: "Estado actualizado." };
}

export async function createPostFormAction(formData: FormData) {
  const requestedStatus = String(formData.get("status") ?? "draft") as PostStatus;
  const channel = String(formData.get("channel") ?? "instagram");
  const scheduledAt = String(formData.get("scheduledAt") ?? "") || null;
  const status =
    requestedStatus === "scheduled" && !scheduledAt
      ? "pending_approval"
      : requestedStatus;
  const profileContext = await getCurrentProfileContext();

  await createPost({
    company_id: String(formData.get("companyId") ?? ""),
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    channels: normalizeChannels(channel),
    status,
    scheduled_at: scheduledAt,
    is_demo: formData.get("isDemo") === "on",
    created_by:
      profileContext.isFallback || !profileContext.profile?.id
        ? null
        : profileContext.profile.id,
  });
}

export async function updatePostFormAction(formData: FormData) {
  await updatePost(String(formData.get("postId") ?? ""), {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    channels: normalizeChannels(String(formData.get("channel") ?? "instagram")),
    scheduled_at: String(formData.get("scheduledAt") ?? "") || null,
    is_demo: formData.get("isDemo") === "on",
  });
}

export async function approvePostFormAction(formData: FormData) {
  await approvePost(String(formData.get("postId") ?? ""));
}

export async function schedulePostFormAction(formData: FormData) {
  const scheduledAt = String(formData.get("scheduledAt") ?? "");
  if (!scheduledAt) {
    return;
  }
  await schedulePost(String(formData.get("postId") ?? ""), scheduledAt);
}

export async function cancelPostFormAction(formData: FormData) {
  await cancelPost(String(formData.get("postId") ?? ""));
}

export async function archivePostFormAction(formData: FormData) {
  await archivePost(String(formData.get("postId") ?? ""));
}
