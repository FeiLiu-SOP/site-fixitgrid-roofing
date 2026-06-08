/**
 * FixitGrid Dispatch Shell — page-level “console” skin (FixitGrid only).
 * SSOT: docs/FIXITGRID_INFRA_BRIEF_ROLLBACK_AND_SCALE.md
 */
export function isFixitgridDispatchShell(args: {
  isFixitGridSite: boolean;
  infraBriefPanel?: boolean | null;
  fixitgridDispatchShell?: boolean | null;
}): boolean {
  if (!args.isFixitGridSite) return false;
  if (args.fixitgridDispatchShell === true) return true;
  return args.infraBriefPanel === true;
}

export const FIXITGRID_DISPATCH_SHELL_FAQ_TITLE = "Intake desk — common questions";
