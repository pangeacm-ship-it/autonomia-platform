import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { selectMetaPageAction } from "./actions";
import type { SocialConnection } from "@/types/database";
import type { FacebookPage } from "@/lib/integrations/meta-oauth";

type PickerData = {
  companyId: string;
  platform: SocialConnection["platform"];
  pages: FacebookPage[];
};

export default async function MetaPagePickerPage() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get("autonomia_meta_pages")?.value ?? null;

  if (!encoded) redirect("/dashboard/conexiones?meta=error");

  let pickerData: PickerData;

  try {
    pickerData = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as PickerData;
  } catch {
    redirect("/dashboard/conexiones?meta=error");
  }

  const { pages, platform } = pickerData;
  const platformLabel = platform === "instagram" ? "Instagram" : "Facebook";

  return (
    <section className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-2xl font-black">
              f
            </div>
            <h1 className="text-2xl font-black">Selecciona tu página</h1>
            <p className="mt-2 text-sm text-slate-400">
              Elige la página de Facebook que quieres conectar con {platformLabel} en AutonomIA.
            </p>
          </div>

          {/* Pages list */}
          <div className="space-y-3">
            {pages.map((page) => {
              const hasInstagram = Boolean(page.instagram_business_account?.id);

              return (
                <form key={page.id} action={selectMetaPageAction}>
                  <input type="hidden" name="pageId" value={page.id} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] p-5 text-left transition hover:border-violet-400/40 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-black">{page.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{page.category}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300">
                          Facebook
                        </span>
                        {hasInstagram ? (
                          <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-bold text-fuchsia-300">
                            + Instagram
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {hasInstagram ? (
                      <p className="mt-3 text-xs text-emerald-300">
                        ✓ Cuenta de Instagram Business vinculada — se conectará automáticamente
                      </p>
                    ) : (
                      <p className="mt-3 text-xs text-slate-500">
                        Sin cuenta de Instagram Business asociada a esta página
                      </p>
                    )}
                  </button>
                </form>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Solo se conectará la página que selecciones. Podrás cambiarla más tarde desde Conexiones.
          </p>
        </div>
      </div>
    </section>
  );
}
