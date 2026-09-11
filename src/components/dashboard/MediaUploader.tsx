"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { cn } from "@/lib/cn";
import { dashBtnSecondary, dashCard } from "@/styles/dashboard";

type MediaUploaderProps = {
  onUploaded?: (result: { path: string; url: string }) => void;
  accept?: string;
};

export function MediaUploader({
  onUploaded,
  accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml",
}: MediaUploaderProps) {
  const t = useDashT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      setBusy(true);
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/dashboard/media/upload/", {
          method: "POST",
          body,
        });
        const json = (await res.json()) as {
          ok?: boolean;
          path?: string;
          url?: string;
          error?: string;
        };
        if (!res.ok || !json.path) {
          throw new Error(json.error || "upload_failed");
        }
        const url = json.url || `/media/${json.path.replace(/^\/+/, "")}`;
        onUploaded?.({ path: json.path, url });
        toast.success(t.media.uploaded);
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : t.media.uploadFailed,
        );
      } finally {
        setBusy(false);
      }
    },
    [onUploaded, router, t.media.uploadFailed, t.media.uploaded],
  );

  const onPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) await uploadFile(file);
  };

  return (
    <div className={`${dashCard} space-y-4 p-5`}>
      <div>
        <p className="m-0 text-sm font-semibold text-ink">{t.media.uploadTitle}</p>
        <p className="m-0 mt-1 text-xs text-black/45">{t.media.uploadHint}</p>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed border-black/15 bg-[#fafbfc] transition",
          dragOver ? "border-primary bg-primary-soft/40" : "",
          busy ? "opacity-60" : "",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void uploadFile(file);
        }}
      >
        <div className="grid place-items-center gap-3 px-4 py-10 text-center">
          <p className="m-0 text-sm text-black/45">
            {busy ? t.media.uploading : t.media.uploadHint}
          </p>
          <label className={cn(dashBtnSecondary, "cursor-pointer")}>
            {t.media.chooseFile}
            <input
              type="file"
              accept={accept}
              disabled={busy}
              onChange={onPick}
              className="sr-only"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
