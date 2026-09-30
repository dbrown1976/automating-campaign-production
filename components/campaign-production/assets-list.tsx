import type { Asset, Campaign } from "@/data/campaigns";
import { contentById } from "@/lib/demo-state";
import { ExternalLink } from "./external-link";
import { ProvenanceInspector } from "./provenance-inspector";

function readinessLabel(asset: Asset): string {
  if (asset.kind === "image") {
    if (asset.pointOfInterest === "missing") return "POI required";
    if (asset.pointOfInterest === "waived") return "POI waived";
    if (asset.pointOfInterest === "set") return "POI set";
    return "POI n/a";
  }
  if (asset.transcodeProfile === "missing") return "Transcode required";
  if (asset.transcodeProfile === "waived") return "Transcode waived";
  if (asset.transcodeProfile === "set") return "Transcode set";
  return "Transcode n/a";
}

function AssetGroup({
  title,
  assets,
  campaign,
  provenanceAssetId,
  onShowProvenance,
  onHideProvenance,
  onMarkUnused,
  onFindDestination,
}: {
  title: string;
  assets: Asset[];
  campaign: Campaign;
  provenanceAssetId: string | null;
  onShowProvenance: (assetId: string) => void;
  onHideProvenance: () => void;
  onMarkUnused: (assetId: string) => void;
  onFindDestination: (assetId: string) => void;
}) {
  if (assets.length === 0) return null;

  return (
    <section className="cp-stack">
      <h3 className="cp-section-label">{title}</h3>
      <div className="cp-asset-list">
        {assets.map((asset) => {
          const linkedFrom = asset.linkedFrom
            .map((link) => contentById(campaign, link.contentId)?.name)
            .filter(Boolean)
            .join(", ");

          return (
            <div key={asset.id} className="cp-stack">
              <div className="cp-asset-row">
                <div>
                  <p className="cp-item-title">{asset.filename}</p>
                  <p className="cp-item-subtitle">{asset.damPath}</p>
                </div>
                <div>
                  <p className="cp-meta">
                    {asset.relationship === "linked"
                      ? `Linked from ${linkedFrom || "content"}`
                      : asset.relationship === "unused"
                        ? "Marked unused"
                        : "Not linked to content"}
                  </p>
                  <p className="cp-meta">{readinessLabel(asset)}</p>
                </div>
                <div className="cp-inline-actions">
                  {asset.relationship === "unlinked" ? (
                    <>
                      <button
                        type="button"
                        className="cp-button"
                        data-variant="primary"
                        onClick={() => onFindDestination(asset.id)}
                      >
                        Find destination
                      </button>
                      <button
                        type="button"
                        className="cp-button"
                        onClick={() => onMarkUnused(asset.id)}
                      >
                        Mark unused
                      </button>
                    </>
                  ) : null}
                  <ExternalLink href={asset.damUrl}>Open in DAM</ExternalLink>
                  {asset.provenance ? (
                    <button
                      type="button"
                      className="cp-button"
                      data-variant="ghost"
                      onClick={() =>
                        provenanceAssetId === asset.id
                          ? onHideProvenance()
                          : onShowProvenance(asset.id)
                      }
                    >
                      Why?
                    </button>
                  ) : null}
                </div>
              </div>
              {provenanceAssetId === asset.id ? (
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
    </section>
  );
}

export function AssetReadinessList({
  campaign,
  provenanceAssetId,
  onShowProvenance,
  onHideProvenance,
  onMarkUnused,
  onFindDestination,
}: {
  campaign: Campaign;
  provenanceAssetId: string | null;
  onShowProvenance: (assetId: string) => void;
  onHideProvenance: () => void;
  onMarkUnused: (assetId: string) => void;
  onFindDestination: (assetId: string) => void;
}) {
  const linked = campaign.assets.filter(
    (asset) => asset.relationship === "linked",
  );
  const unlinked = campaign.assets.filter(
    (asset) => asset.relationship === "unlinked",
  );

  if (campaign.assets.length === 0) {
    return (
      <div className="cp-empty">
        No assets are available for this signed-off campaign in the demo seed.
      </div>
    );
  }

  return (
    <div className="cp-stack-lg">
      <AssetGroup
        title="Linked"
        assets={linked}
        campaign={campaign}
        provenanceAssetId={provenanceAssetId}
        onShowProvenance={onShowProvenance}
        onHideProvenance={onHideProvenance}
        onMarkUnused={onMarkUnused}
        onFindDestination={onFindDestination}
      />
      <AssetGroup
        title="Unlinked"
        assets={unlinked}
        campaign={campaign}
        provenanceAssetId={provenanceAssetId}
        onShowProvenance={onShowProvenance}
        onHideProvenance={onHideProvenance}
        onMarkUnused={onMarkUnused}
        onFindDestination={onFindDestination}
      />
    </div>
  );
}
