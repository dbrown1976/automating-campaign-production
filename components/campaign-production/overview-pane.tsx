import type { AttentionItem, Campaign } from "@/data/campaigns";
import { assetById } from "@/lib/demo-state";
import { ExternalLink } from "./external-link";
import { ProvenanceInspector } from "./provenance-inspector";

export function OverviewPane({
  campaign,
  provenanceAssetId,
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
  provenanceAssetId: string | null;
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
  if (campaign.status === "needs_attention") {
    return (
      <div className="cp-stack-lg">
        <div>
          <h3 className="cp-section-label">What needs human intervention?</h3>
          <p className="cp-meta">
            Resolve or waive these items before the campaign can progress.
          </p>
        </div>
        <div className="cp-attention-list">
          {campaign.attention.map((item) => (
            <AttentionOverviewRow
              key={item.id}
              campaign={campaign}
              item={item}
              provenanceAssetId={provenanceAssetId}
              onShowProvenance={onShowProvenance}
              onHideProvenance={onHideProvenance}
              onWaivePoi={onWaivePoi}
              onMarkUnused={onMarkUnused}
              onFindDestination={onFindDestination}
            />
          ))}
        </div>
      </div>
    );
  }

  if (campaign.status === "needs_review") {
    return (
      <div className="cp-stack-lg">
        <div className="cp-review-banner">
          <p className="cp-item-title">Ready for high-level structural review</p>
          <p className="cp-meta">
            Automated assembly is complete enough to inspect graph shape, linked
            assets, delivery keys, and readiness checks. Detailed editing stays in
            CMS and DAM.
          </p>
        </div>
        <div className="cp-inline-actions">
          <button
            type="button"
            className="cp-button"
            data-variant="danger"
            onClick={onFailReview}
          >
            Fail review
          </button>
          <button
            type="button"
            className="cp-button"
            data-variant="primary"
            onClick={onSignOff}
          >
            Sign off
          </button>
        </div>
      </div>
    );
  }

  if (campaign.status === "signed_off") {
    return (
      <div className="cp-stack-lg">
        <div className="cp-signed-banner">
          <p className="cp-item-title">Signed off</p>
          <p className="cp-meta">
            Automated assembly has been accepted. The campaign remains available
            for retrieval, duplication, or archive.
          </p>
        </div>
        <div className="cp-inline-actions">
          <button type="button" className="cp-button" onClick={onDuplicate}>
            Duplicate
          </button>
          <button type="button" className="cp-button" onClick={onArchive}>
            Archive
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-empty">
      This campaign is {campaign.statusLabel.toLowerCase()}.
    </div>
  );
}

function AttentionOverviewRow({
  campaign,
  item,
  provenanceAssetId,
  onShowProvenance,
  onHideProvenance,
  onWaivePoi,
  onMarkUnused,
  onFindDestination,
}: {
  campaign: Campaign;
  item: AttentionItem;
  provenanceAssetId: string | null;
  onShowProvenance: (assetId: string) => void;
  onHideProvenance: () => void;
  onWaivePoi: (assetId: string) => void;
  onMarkUnused: (assetId: string) => void;
  onFindDestination: (assetId: string) => void;
}) {
  const asset = item.targetId ? assetById(campaign, item.targetId) : undefined;

  return (
    <div className="cp-stack">
      <div className="cp-attention-item">
        <div>
          <p className="cp-item-title">{item.title}</p>
          <p className="cp-item-subtitle">{item.subtitle}</p>
        </div>
        <div>
          <p className="cp-meta">{item.reason}</p>
          {item.reviewComment ? (
            <p className="cp-meta">Review comment: {item.reviewComment}</p>
          ) : null}
        </div>
        <div className="cp-inline-actions">
          {item.primaryAction.href ? (
            <ExternalLink href={item.primaryAction.href}>
              {item.primaryAction.label}
            </ExternalLink>
          ) : item.primaryAction.action === "find_destination" && item.targetId ? (
            <button
              type="button"
              className="cp-button"
              data-variant="primary"
              onClick={() => onFindDestination(item.targetId!)}
            >
              {item.primaryAction.label}
            </button>
          ) : null}

          {item.secondaryActions?.map((action) => {
            if (action.href) {
              return (
                <ExternalLink key={action.label} href={action.href}>
                  {action.label}
                </ExternalLink>
              );
            }
            if (action.action === "waive_poi" && item.targetId) {
              return (
                <button
                  key={action.label}
                  type="button"
                  className="cp-button"
                  onClick={() => onWaivePoi(item.targetId!)}
                >
                  {action.label}
                </button>
              );
            }
            if (action.action === "mark_unused" && item.targetId) {
              return (
                <button
                  key={action.label}
                  type="button"
                  className="cp-button"
                  onClick={() => onMarkUnused(item.targetId!)}
                >
                  {action.label}
                </button>
              );
            }
            if (action.action === "inspect_provenance" && item.targetId) {
              return (
                <button
                  key={action.label}
                  type="button"
                  className="cp-button"
                  data-variant="ghost"
                  onClick={() =>
                    provenanceAssetId === item.targetId
                      ? onHideProvenance()
                      : onShowProvenance(item.targetId!)
                  }
                >
                  {action.label}
                </button>
              );
            }
            return null;
          })}
        </div>
      </div>
      {provenanceAssetId === item.targetId && asset?.provenance ? (
        <div style={{ padding: "0 12px 12px" }}>
          <ProvenanceInspector
            campaign={campaign}
            asset={asset}
            onClose={onHideProvenance}
          />
        </div>
      ) : null}
    </div>
  );
}
