import { requireDashboardUser } from "@/lib/cms/auth";
import { OFFICES } from "@/data/offices";

export default async function OfficesAdminPage() {
  await requireDashboardUser("offices");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Offices</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Seed offices below. Persist edits in{" "}
          <code className="rounded bg-black/5 px-1">sw_offices</code>.
        </p>
      </div>
      <ul className="divide-y divide-black/5 rounded-2xl border border-black/8 bg-white">
        {OFFICES.map((o) => (
          <li key={o.id} className="px-4 py-3 text-sm">
            <p className="font-medium">
              {o.name.en} · {o.city.en}
            </p>
            <p className="mt-1 text-ink-muted">{o.address.en}</p>
            <p className="mt-1 text-ink-muted">{o.phones.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
