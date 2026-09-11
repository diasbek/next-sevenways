"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { DashCrudPage } from "@/components/dashboard/ds";
import { exportCmsBundleAction } from "@/app/dashboard/(app)/export/actions";
import {
  dashBtnPrimary,
  dashCardPad,
} from "@/styles/dashboard";

export function ExportAdminClient({ cmsReady }: { cmsReady: boolean }) {
  const t = useDashT();
  const [busy, setBusy] = useState(false);

  return (
    <DashCrudPage
      title="CMS export"
      lead="Download a JSON backup of destinations, offices, news, site copy, operators, legal and settings."
    >
      {!cmsReady ? (
        <p className={`${dashCardPad} text-sm text-black/55`}>
          Connect Supabase to export CMS tables.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="m-0 text-sm text-black/55">
            Does not include media files or payment secrets — only content rows.
          </p>
          <button
            type="button"
            disabled={busy}
            className={dashBtnPrimary}
            onClick={async () => {
              setBusy(true);
              try {
                const bundle = await exportCmsBundleAction();
                const blob = new Blob([JSON.stringify(bundle, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `sevenways-cms-${bundle.exportedAt.slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success(t.form.successDefault);
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : t.errors.saveFailed,
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Exporting…" : "Download JSON backup"}
          </button>
        </div>
      )}
    </DashCrudPage>
  );
}
