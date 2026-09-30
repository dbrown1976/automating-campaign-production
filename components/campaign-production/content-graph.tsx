import { useState } from "react";
import type { Campaign, ContentItem } from "@/data/campaigns";
import {
  assetById,
  contentById,
  rootContentIds,
} from "@/lib/demo-state";
import { WorkflowBadge } from "./status-badge";
import { ExternalLink } from "./external-link";

function ContentNode({
  campaign,
  item,
  depth,
  expanded,
  onToggle,
}: {
  campaign: Campaign;
  item: ContentItem;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) {
  const hasChildren = item.childIds.length > 0 || item.assetIds.length > 0;
  const isOpen = expanded.has(item.id);

  return (
    <>
      <div className="cp-tree-row" style={{ ["--depth" as string]: depth }}>
        <div className="cp-tree-main">
          <span className="cp-tree-indent" style={{ width: depth * 18 }} />
          {hasChildren ? (
            <button
              type="button"
              className="cp-tree-toggle"
              aria-expanded={isOpen}
              aria-label={isOpen ? `Collapse ${item.name}` : `Expand ${item.name}`}
              onClick={() => onToggle(item.id)}
            >
              {isOpen ? "−" : "+"}
            </button>
          ) : (
            <span className="cp-tree-spacer" />
          )}
          <span className="cp-tree-name" title={item.name}>
            {item.name}
          </span>
        </div>
        <span className="cp-meta">{item.contentType}</span>
        <WorkflowBadge label={item.workflowLabel} />
        <span className="cp-meta">{item.assignee ?? "—"}</span>
        <span className="cp-inline-actions">
          {item.deliveryKey ? (
            <span className="cp-meta" style={{ fontFamily: "var(--font-mono)" }}>
              {item.deliveryKey}
            </span>
          ) : null}
          {(isOpen || !hasChildren) && (
            <ExternalLink href={item.cmsUrl}>Open in CMS</ExternalLink>
          )}
        </span>
      </div>

      {isOpen
        ? item.childIds.map((childId) => {
            const child = contentById(campaign, childId);
            if (!child) return null;
            return (
              <ContentNode
                key={child.id}
                campaign={campaign}
                item={child}
                depth={depth + 1}
                expanded={expanded}
                onToggle={onToggle}
              />
            );
          })
        : null}

      {isOpen
        ? item.assetIds.map((assetId) => {
            const asset = assetById(campaign, assetId);
            if (!asset) return null;
            return (
              <div
                key={asset.id}
                className="cp-tree-row"
                data-kind="asset"
                style={{ ["--depth" as string]: depth + 1 }}
              >
                <div className="cp-tree-main">
                  <span
                    className="cp-tree-indent"
                    style={{ width: (depth + 1) * 18 }}
                  />
                  <span className="cp-tree-spacer" />
                  <span className="cp-tree-name">{asset.filename}</span>
                </div>
                <span className="cp-meta">Referenced asset</span>
                <span className="cp-meta">
                  {asset.kind === "image"
                    ? `POI ${asset.pointOfInterest}`
                    : `Transcode ${asset.transcodeProfile}`}
                </span>
                <span className="cp-meta">—</span>
                <ExternalLink href={asset.damUrl}>Open in DAM</ExternalLink>
              </div>
            );
          })
        : null}
    </>
  );
}

export function ContentGraphTree({ campaign }: { campaign: Campaign }) {
  const roots = rootContentIds(campaign);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(roots.slice(0, 1)),
  );

  const onToggle = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (campaign.content.length === 0) {
    return (
      <div className="cp-empty">
        No content graph is available for this signed-off campaign in the demo
        seed.
      </div>
    );
  }

  return (
    <div className="cp-stack">
      <p className="cp-meta">
        Expandable content graph with referenced assets shown as secondary rows.
      </p>
      <div className="cp-tree" role="tree">
        {roots.map((rootId) => {
          const item = contentById(campaign, rootId);
          if (!item) return null;
          return (
            <ContentNode
              key={item.id}
              campaign={campaign}
              item={item}
              depth={0}
              expanded={expanded}
              onToggle={onToggle}
            />
          );
        })}
      </div>
    </div>
  );
}
