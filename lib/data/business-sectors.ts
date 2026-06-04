import {
  businessSectors,
  type BusinessSector,
} from "@/lib/business-sectors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BusinessSectorRow } from "@/types/database";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function mergeSector(row: BusinessSectorRow): BusinessSector {
  const localSector =
    businessSectors.find((sector) => sector.key === row.key) ??
    businessSectors.find((sector) => normalize(sector.name) === normalize(row.name));

  if (!localSector) {
    return {
      key: row.key,
      name: row.name,
      description: row.description ?? "Sector preparado para personalización futura.",
      compatibleModules: ["SocialIA", "ReviewIA", "LeadIA", "InsightIA"],
      socialContentTypes: ["Promoción", "Consejo", "Novedad", "Caso real"],
      bookingLabel: "Reservas",
      leadLabel: "Clientes interesados",
      terminology: {
        clientes: "clientes",
        reservas: "reservas",
        servicios: "servicios",
      },
    };
  }

  return {
    ...localSector,
    key: row.key,
    name: row.name,
    description: row.description ?? localSector.description,
  };
}

export async function getBusinessSectors(): Promise<BusinessSector[]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return businessSectors;
  }

  const { data, error } = await supabase
    .from("business_sectors")
    .select("*")
    .order("name");

  if (error || !data?.length) {
    return businessSectors;
  }

  return data.map(mergeSector);
}

export async function getBusinessSectorById(
  sectorId: string | null,
): Promise<BusinessSector | null> {
  if (!sectorId) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("business_sectors")
    .select("*")
    .eq("id", sectorId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mergeSector(data);
}
