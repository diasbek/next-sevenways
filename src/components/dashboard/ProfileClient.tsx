"use client";

import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDashT } from "@/components/dashboard/DashLocaleProvider";
import { DashStatusBadge } from "@/components/dashboard/DashStatusBadge";
import {
  DashCrudPage,
  DashForm,
  DashTextInput,
  valuesToFormData,
} from "@/components/dashboard/ds";
import {
  changePasswordAction,
  updateProfileAction,
} from "@/app/dashboard/(app)/profile/actions";
import type { AdminRole } from "@/lib/cms/auth-shared";
import type { DashCopy } from "@/i18n/dashboard";
import { dashBtnPrimary, dashCardPad } from "@/styles/dashboard";

export type ProfileClientProps = {
  email: string;
  displayName: string;
  role: AdminRole;
};

function mapErr(err: unknown, t: DashCopy): string {
  const code = err instanceof Error ? err.message : "";
  switch (code) {
    case "wrong_password":
      return t.errors.wrongPassword;
    case "password_mismatch":
      return t.errors.passwordMismatch;
    case "password_too_short":
      return t.errors.passwordMin.replace("{n}", "8");
    case "display_name_required":
      return t.errors.required;
    default:
      return code || t.errors.generic;
  }
}

export function ProfileClient(props: ProfileClientProps) {
  const t = useDashT();
  const router = useRouter();

  return (
    <DashCrudPage title={t.profile.title} lead={t.profile.lead}>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={dashCardPad}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="m-0 text-sm font-semibold text-ink">
              {t.profile.sectionProfile}
            </h2>
            <DashStatusBadge kind="role" value={props.role} />
          </div>
          <p className="m-0 mb-4 text-sm text-black/45">{props.email}</p>
          <DashForm
            enableReinitialize
            initialValues={{ displayName: props.displayName }}
            schema={Yup.object({
              displayName: Yup.string().trim().required(t.errors.required),
            })}
            successMessage={t.profile.profileSaved}
            errorMessage={t.errors.saveFailed}
            onSubmit={async (values) => {
              try {
                await updateProfileAction(valuesToFormData(values));
                router.refresh();
              } catch (err) {
                throw new Error(mapErr(err, t));
              }
            }}
          >
            {({ isSubmitting }) => (
              <div className="space-y-3">
                <DashTextInput
                  name="displayName"
                  label={t.profile.displayName}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={dashBtnPrimary}
                >
                  {t.profile.saveProfile}
                </button>
              </div>
            )}
          </DashForm>
        </section>

        <section className={dashCardPad}>
          <h2 className="m-0 mb-4 text-sm font-semibold text-ink">
            {t.profile.sectionPassword}
          </h2>
          <DashForm
            initialValues={{
              current_password: "",
              new_password: "",
              confirm_password: "",
            }}
            schema={Yup.object({
              current_password: Yup.string().required(t.errors.required),
              new_password: Yup.string()
                .min(8, t.errors.passwordMin.replace("{n}", "8"))
                .required(t.errors.required),
              confirm_password: Yup.string()
                .required(t.errors.required)
                .oneOf([Yup.ref("new_password")], t.errors.passwordMismatch),
            })}
            successMessage={t.profile.passwordChanged}
            errorMessage={t.errors.saveFailed}
            onSubmit={async (values, helpers) => {
              try {
                await changePasswordAction(valuesToFormData(values));
                helpers.resetForm();
              } catch (err) {
                throw new Error(mapErr(err, t));
              }
            }}
          >
            {({ isSubmitting }) => (
              <div className="space-y-3">
                <DashTextInput
                  name="current_password"
                  label={t.profile.currentPassword}
                  type="password"
                  autoComplete="current-password"
                />
                <DashTextInput
                  name="new_password"
                  label={t.profile.newPassword}
                  type="password"
                  autoComplete="new-password"
                />
                <DashTextInput
                  name="confirm_password"
                  label={t.profile.confirmPassword}
                  type="password"
                  autoComplete="new-password"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={dashBtnPrimary}
                >
                  {t.profile.changePassword}
                </button>
              </div>
            )}
          </DashForm>
        </section>
      </div>
    </DashCrudPage>
  );
}
