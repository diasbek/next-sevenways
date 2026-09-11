"use client";

import { updateLeadStatusAction } from "./actions";

export function LeadStatusForm({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  return (
    <form action={updateLeadStatusAction}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        className="rounded-lg border border-black/10 px-2 py-1"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {["new", "in_progress", "won", "lost", "spam"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
