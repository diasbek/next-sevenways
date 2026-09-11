"use client";

import { useLeadStatusLabels } from "@/components/dashboard/DashStatusBadge";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { updateLeadStatusAction } from "@/app/dashboard/(app)/leads/actions";
import { dashSelect } from "@/styles/dashboard";
import { toast } from "react-toastify";

export const LEAD_STATUSES = [
  "new",
  "in_progress",
  "won",
  "lost",
  "spam",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function LeadStatusSelect({
  id,
  status,
  action = updateLeadStatusAction,
  disabled = false,
}: {
  id: string;
  status: string;
  action?: (formData: FormData) => Promise<void>;
  disabled?: boolean;
}) {
  const t = useDashT();
  const labels = useLeadStatusLabels();

  if (disabled) {
    return (
      <span className="text-xs text-black/45">{labels[status] ?? status}</span>
    );
  }

  return (
    <form
      action={async (fd) => {
        try {
          await action(fd);
          toast.success(t.form.successDefault);
        } catch {
          toast.error(t.errors.saveFailed);
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className={`${dashSelect} max-w-[11rem] py-1.5 text-xs`}
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {labels[s] ?? s}
          </option>
        ))}
      </select>
    </form>
  );
}
