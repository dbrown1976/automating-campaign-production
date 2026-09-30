import type { CampaignStatus } from "@/data/campaigns";

export function CampaignStatusBadge({
  status,
  label,
}: {
  status: CampaignStatus;
  label: string;
}) {
  return (
    <span className="cp-status" data-status={status}>
      {label}
    </span>
  );
}

export function WorkflowBadge({ label }: { label: string }) {
  return <span className="cp-workflow">{label}</span>;
}
