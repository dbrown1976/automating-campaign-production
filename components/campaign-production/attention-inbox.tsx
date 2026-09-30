import type { AttentionItem, Campaign } from "@/data/campaigns";
import { ExternalLink } from "./external-link";
import { ProvenanceInspector } from "./provenance-inspector";
import { assetById } from "@/lib/demo-state";

export function AttentionInbox({
  items,
  campaigns,
  provenanceKey,
  onPrimaryAction,
  onSecondaryAction,
  onShowProvenance,
  onHideProvenance,
}: {
  items: AttentionItem[];
  campaigns: Campaign[];
  provenanceKey: string | null;
  onPrimaryAction: (item: AttentionItem) => void;
  onSecondaryAction: (item: AttentionItem, action: string) => void;
  onShowProvenance: (key: string) => void;
  onHideProvenance: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="cp-empty">
        No interventions need attention right now.
      </div>
    );
  }

  return (
    <div className="cp-attention-list">
      {items.map((item) => {
        const campaign = campaigns.find((entry) => entry.id === item.campaignId);
        const asset =
          item.targetId && campaign
            ? assetById(campaign, item.targetId)
            : undefined;
        const key = `${item.campaignId}:${item.id}`;

        return (
          <div key={item.id} className="cp-stack">
            <div className="cp-attention-item" data-compact="true">
              <div>
                <p className="cp-item-title">{campaign?.name ?? item.campaignId}</p>
                <p className="cp-item-subtitle">{item.level}</p>
              </div>
              <div>
                <p className="cp-item-title">{item.title}</p>
                <p className="cp-item-subtitle">
                  {item.subtitle}
                  {item.reviewComment ? ` · “${item.reviewComment}”` : ""}
                </p>
              </div>
              <div>
                <p className="cp-meta">{item.reason}</p>
              </div>
              <div className="cp-inline-actions">
                {item.primaryAction.href ? (
                  <ExternalLink href={item.primaryAction.href}>
                    {item.primaryAction.label}
                  </ExternalLink>
                ) : (
                  <button
                    type="button"
                    className="cp-button"
                    data-variant="primary"
                    onClick={() => onPrimaryAction(item)}
                  >
                    {item.primaryAction.label}
                  </button>
                )}
                {item.secondaryActions?.map((action) =>
                  action.href ? (
                    <ExternalLink key={action.label} href={action.href}>
                      {action.label}
                    </ExternalLink>
                  ) : (
                    <button
                      key={action.label}
                      type="button"
                      className="cp-button"
                      data-variant={
                        action.action === "inspect_provenance" ? "ghost" : undefined
                      }
                      onClick={() => {
                        if (action.action === "inspect_provenance") {
                          provenanceKey === key
                            ? onHideProvenance()
                            : onShowProvenance(key);
                          return;
                        }
                        if (action.action) {
                          onSecondaryAction(item, action.action);
                        }
                      }}
                    >
                      {action.label}
                    </button>
                  ),
                )}
              </div>
            </div>
            {provenanceKey === key && campaign && asset?.provenance ? (
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
      })}
    </div>
  );
}
