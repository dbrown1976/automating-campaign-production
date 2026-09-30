import { IconX } from "@tabler/icons-react";
import type { Campaign } from "@/data/campaigns";
import type { DetailTab } from "@/lib/demo-state";
import { formatGoLive } from "@/lib/demo-state";
import { CampaignStatusBadge } from "./status-badge";
import { ExternalLink } from "./external-link";
import { OverviewPane } from "./overview-pane";
import { ContentGraphTree } from "./content-graph";
import { AssetReadinessList } from "./assets-list";

const detailTabs: Array<{ id: DetailTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "content", label: "Content" },
  { id: "assets", label: "Assets" },
];

export function CampaignDetailPane({
  campaign,
  detailTab,
  provenanceAssetId,
  onDetailTabChange,
  onClose,
  onShowProvenance,
  onHideProvenance,
  onWaivePoi,
  onMarkUnused,
  onFindDestination,
  onFailReview,
  onSignOff,
  onDuplicate,
  onArchive,
}: {
  campaign: Campaign;
  detailTab: DetailTab;
  provenanceAssetId: string | null;
  onDetailTabChange: (tab: DetailTab) => void;
  onClose: () => void;
  onShowProvenance: (assetId: string) => void;
  onHideProvenance: () => void;
  onWaivePoi: (assetId: string) => void;
  onMarkUnused: (assetId: string) => void;
  onFindDestination: (assetId: string) => void;
  onFailReview: () => void;
  onSignOff: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
}) {
  return (
    <section className="cp-detail" aria-label={`${campaign.name} detail`}>
      <header className="cp-detail-header">
        <div className="cp-detail-heading">
          <div className="cp-detail-title-row">
            <h2 className="cp-detail-title">{campaign.name}</h2>
            <CampaignStatusBadge
              status={campaign.status}
              label={campaign.statusLabel}
            />
          </div>
          <div className="cp-detail-meta">
            <span className="cp-detail-meta-item">
              Go live {formatGoLive(campaign.goLiveDate)}
            </span>
            <span className="cp-detail-meta-item">
              <ExternalLink href={campaign.sourceTicket.url}>
                {campaign.sourceTicket.id}
              </ExternalLink>
            </span>
            <span className="cp-detail-meta-item">
              <ExternalLink href={campaign.cmsFolder.url}>CMS folder</ExternalLink>
            </span>
            <span className="cp-detail-meta-item">
              <ExternalLink href={campaign.damFolder.url}>DAM folder</ExternalLink>
            </span>
          </div>
        </div>
        <button
          type="button"
          className="cp-icon-button"
          aria-label="Close campaign detail"
          onClick={onClose}
        >
          <IconX size={18} stroke={1.5} />
        </button>
      </header>

      <div
        className="cp-detail-tabs"
        role="tablist"
        aria-label="Campaign detail"
      >
        {detailTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`detail-tab-${tab.id}`}
            aria-controls={`detail-panel-${tab.id}`}
            aria-selected={detailTab === tab.id}
            className="cp-tab"
            data-active={detailTab === tab.id}
            data-testid={`detail-tab-${tab.id}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDetailTabChange(tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="cp-detail-body" role="tabpanel">
        {detailTab === "overview" ? (
          <OverviewPane
            campaign={campaign}
            provenanceAssetId={provenanceAssetId}
            onShowProvenance={onShowProvenance}
            onHideProvenance={onHideProvenance}
            onWaivePoi={onWaivePoi}
            onMarkUnused={onMarkUnused}
            onFindDestination={onFindDestination}
            onFailReview={onFailReview}
            onSignOff={onSignOff}
            onDuplicate={onDuplicate}
            onArchive={onArchive}
          />
        ) : null}
        {detailTab === "content" ? <ContentGraphTree campaign={campaign} /> : null}
        {detailTab === "assets" ? (
          <AssetReadinessList
            campaign={campaign}
            provenanceAssetId={provenanceAssetId}
            onShowProvenance={onShowProvenance}
            onHideProvenance={onHideProvenance}
            onMarkUnused={onMarkUnused}
            onFindDestination={onFindDestination}
          />
        ) : null}
      </div>
    </section>
  );
}
