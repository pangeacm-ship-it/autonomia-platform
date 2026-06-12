"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { saveMetaPageSelection, type FacebookPage } from "@/lib/integrations/meta-oauth";
import type { SocialConnection } from "@/types/database";

type PickerData = {
  companyId: string;
  platform: SocialConnection["platform"];
  userAccessToken: string;
  tokenExpiresAt: string | null;
  scopes: string[];
  pages: FacebookPage[];
};

export async function selectMetaPageAction(formData: FormData) {
  const pageId = formData.get("pageId") as string;

  const cookieStore = await cookies();
  const encoded = cookieStore.get("autonomia_meta_pages")?.value ?? null;

  if (!encoded || !pageId) redirect("/dashboard/conexiones?meta=error");

  let pickerData: PickerData;

  try {
    pickerData = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as PickerData;
  } catch {
    redirect("/dashboard/conexiones?meta=error");
  }

  const page = pickerData.pages.find((p) => p.id === pageId);

  if (!page) redirect("/dashboard/conexiones?meta=error");

  const result = await saveMetaPageSelection({
    companyId: pickerData.companyId,
    platform: pickerData.platform,
    page,
    userAccessToken: pickerData.userAccessToken,
    tokenExpiresAt: pickerData.tokenExpiresAt,
    scopes: pickerData.scopes,
  });

  // Clear the picker cookie
  cookieStore.set("autonomia_meta_pages", "", { maxAge: 0, path: "/" });

  if (!result.ok) redirect("/dashboard/conexiones?meta=error");

  redirect("/dashboard/conexiones?meta=connected");
}
