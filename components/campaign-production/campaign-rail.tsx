import type { Campaign } from "@/data/campaigns";
import { CampaignStatusBadge } from "./status-badge";

export function CampaignRail({
  campaigns,
  selectedId,
  onSelect,
}: {
  campaigns: Campaign[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="cp-rail" aria-label="Campaign selector">
      <div className="cp-rail-header">Campaigns</div>
      <div className="cp-rail-list">
        {campaigns.map((campaign) => (
          <button
            key={campaign.id}
            type="button"
            className="cp-rail-item"
            data-selected={selectedId === campaign.id}
            onClick={() => onSelect(campaign.id)}
          >
            <span className="cp-rail-name">{campaign.name}</span>
            <CampaignStatusBadge
              status={campaign.status}
              label={campaign.statusLabel}
            />
          </button>
        ))}
      </div>
    </aside>
  );
}
