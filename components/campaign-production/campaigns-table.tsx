import type { Campaign } from "@/data/campaigns";
import { formatGoLive } from "@/lib/demo-state";
import { CampaignStatusBadge } from "./status-badge";
import { ExternalLink } from "./external-link";

export function CampaignsTable({
  title,
  campaigns,
  selectedId,
  onSelect,
}: {
  title: string;
  campaigns: Campaign[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (campaigns.length === 0) {
    return null;
  }

  return (
    <section className="cp-stack">
      <h2 className="cp-section-label">{title}</h2>
      <div className="cp-table-wrap">
        <table className="cp-table">
          <thead>
            <tr>
              <th scope="col">Campaign</th>
              <th scope="col">Status</th>
              <th scope="col">Go live</th>
              <th scope="col">Source</th>
              <th scope="col">CMS</th>
              <th scope="col">DAM</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="cp-row"
                data-selected={selectedId === campaign.id}
                tabIndex={0}
                onClick={() => onSelect(campaign.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(campaign.id);
                  }
                }}
              >
                <td>
                  <div className="cp-campaign-name">{campaign.name}</div>
                </td>
                <td>
                  <CampaignStatusBadge
                    status={campaign.status}
                    label={campaign.statusLabel}
                  />
                </td>
                <td>{formatGoLive(campaign.goLiveDate)}</td>
                <td>
                  <ExternalLink href={campaign.sourceTicket.url}>
                    {campaign.sourceTicket.id}
                  </ExternalLink>
                </td>
                <td>
                  <ExternalLink href={campaign.cmsFolder.url}>
                    {campaign.cmsFolder.name}
                  </ExternalLink>
                </td>
                <td>
                  <ExternalLink href={campaign.damFolder.url}>
                    {campaign.damFolder.name}
                  </ExternalLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
