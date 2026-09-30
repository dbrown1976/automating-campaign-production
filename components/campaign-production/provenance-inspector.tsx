import type { Asset, Campaign } from "@/data/campaigns";
import { ExternalLink } from "./external-link";

export function ProvenanceInspector({
  campaign,
  asset,
  onClose,
}: {
  campaign: Campaign;
  asset: Asset;
  onClose: () => void;
}) {
  const provenance = asset.provenance;
  if (!provenance) return null;

  const sources = campaign.sources.filter((source) =>
    provenance.sourceIds.includes(source.id),
  );

  return (
    <div className="cp-provenance" role="region" aria-label="Provenance summary">
      <div className="cp-inline-actions" style={{ justifyContent: "space-between" }}>
        <h4>Why this asset?</h4>
        <button type="button" className="cp-button" data-variant="ghost" onClick={onClose}>
          Close
        </button>
      </div>
      <p>{provenance.summary}</p>
      <p className="cp-meta">
        Source file: {asset.originalFilename} · Interpretation: {provenance.mode}
      </p>
      {sources.length > 0 ? (
        <ul>
          {sources.map((source) => (
            <li key={source.id}>
              <ExternalLink href={source.url}>{source.name}</ExternalLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
