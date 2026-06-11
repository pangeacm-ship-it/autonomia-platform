"use server";

import { upsertCompanyAiSettings } from "@/lib/data/ai-settings";
import type { CompanyAiSettings } from "@/types/database";

type SaveAiSettingsInput = {
  companyId: string;
  tone: string;
  main_goal: string | null;
  custom_instructions: string | null;
  automation_level: CompanyAiSettings["automation_level"];
  approval_required: boolean;
};

export async function saveAiSettingsAction(
  input: SaveAiSettingsInput
): Promise<{ ok: boolean; error?: string }> {
  return upsertCompanyAiSettings(input.companyId, {
    tone: input.tone,
    main_goal: input.main_goal,
    custom_instructions: input.custom_instructions,
    automation_level: input.automation_level,
    approval_required: input.approval_required,
  });
}
