"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CopyButton } from "@/components/dashboard/CopyButton";
import {
  useDashLocale,
  useDashT,
} from "@/components/dashboard/DashLocaleProvider";
import {
  DashCrudPage,
  DashListView,
  DashRowActions,
} from "@/components/dashboard/ds";
import { MediaUploader } from "@/components/dashboard/MediaUploader";
import { dashFormat, dashIntlLocale } from "@/i18n/dashboard";
import { formatDashDate } from "@/lib/cms/lead-display";
import { dashBtnSecondary } from "@/styles/dashboard";

export type MediaListItem = {
  id: string;
  path: string;
  filename: string;
  url: string;
  mime_type?: string | null;
  size_bytes?: number | null;
  created_at?: string | null;
};

function formatBytes(size: number | null | undefined, locale: string) {
  if (size == null || size <= 0) return "—";
  const kb = size / 1024;
  if (kb < 1024) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(kb)} KB`;
  }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(kb / 1024)} MB`;
}

export function MediaListClient({
  files,
  canWrite,
  deleteAction,
}: {
  files: MediaListItem[];
  canWrite: boolean;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const t = useDashT();
  const router = useRouter();
  const { locale } = useDashLocale();
  const intlLocale = dashIntlLocale(locale);

  return (
    <DashCrudPage
      title={t.media.title}
      lead={t.media.lead}
      secondaryActions={
        <Link href="/dashboard/news/new/" className={dashBtnSecondary}>
          {t.media.toEditor}
        </Link>
      }
    >
      {canWrite ? <MediaUploader /> : null}

      <DashListView
        storageKey="media"
        rows={files}
        rowKey={(f) => f.id}
        emptyTitle={t.media.emptyTitle}
        emptyLead={t.media.emptyLead}
        defaultView="cards"
        defaultSortId="created"
        defaultSortDir="desc"
        columns={[
          {
            id: "preview",
            header: t.list.cover,
            hideInCard: true,
            cell: (f) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={f.url}
                alt=""
                className="size-14 rounded-lg bg-black/[0.03] object-contain"
              />
            ),
          },
          {
            id: "name",
            header: t.list.file,
            searchText: (f) => `${f.filename} ${f.url} ${f.path}`,
            sortValue: (f) => f.filename,
            cell: (f) => (
              <div className="min-w-0">
                <p className="m-0 truncate font-medium text-ink">{f.filename}</p>
                <p className="m-0 mt-0.5 break-all font-mono text-[0.65rem] text-black/45">
                  {f.url}
                </p>
              </div>
            ),
          },
          {
            id: "size",
            header: t.list.size,
            hideInCard: true,
            sortValue: (f) => f.size_bytes ?? -1,
            cell: (f) => (
              <span className="text-xs text-black/45">
                {formatBytes(f.size_bytes, intlLocale)}
              </span>
            ),
          },
          {
            id: "created",
            header: t.list.created,
            sortValue: (f) => f.created_at ?? "",
            cell: (f) => (
              <span className="text-xs text-black/45">
                {f.created_at ? formatDashDate(f.created_at, intlLocale) : "—"}
              </span>
            ),
          },
        ]}
        actions={(f) => (
          <DashRowActions
            extra={
              <div className="inline-flex flex-nowrap items-center gap-2">
                <CopyButton value={f.url} />
                <a
                  href={f.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.7rem] font-semibold text-primary hover:underline"
                >
                  {t.common.open}
                </a>
              </div>
            }
            confirmTitle={t.media.deleteConfirm}
            confirmLead={dashFormat(t.media.deleteLead, { name: f.filename })}
            onDelete={
              canWrite
                ? async () => {
                    const fd = new FormData();
                    fd.set("id", f.id);
                    fd.set("path", f.path);
                    await deleteAction(fd);
                    router.refresh();
                  }
                : undefined
            }
          />
        )}
        renderCard={(f, actionsNode) => (
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.url}
              alt=""
              className="aspect-[16/10] w-full bg-black/[0.03] object-contain"
            />
            <div className="space-y-2 p-3">
              <div className="min-w-0">
                <p className="m-0 truncate text-sm font-semibold text-ink">
                  {f.filename}
                </p>
                <p className="m-0 mt-0.5 text-xs text-black/45">
                  {f.created_at
                    ? formatDashDate(f.created_at, intlLocale)
                    : ""}
                </p>
                <p className="m-0 mt-1 break-all font-mono text-[0.65rem] text-black/40">
                  {f.url}
                </p>
              </div>
              {actionsNode}
            </div>
          </div>
        )}
      />
    </DashCrudPage>
  );
}
