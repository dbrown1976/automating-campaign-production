'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  IconArchive,
  IconArrowUpRight,
  IconCheck,
  IconCopy,
  IconX,
} from '@tabler/icons-react'
import {
  canonicalCampaigns,
  type AttentionItem,
  type Campaign,
  type CampaignStatus,
} from '@/data/campaigns'

const statusStyles: Record<CampaignStatus, string> = {
  needs_attention: 'status-badge status-attention',
  needs_review: 'status-badge status-review',
  signed_off: 'status-badge status-signed-off',
  assembling: 'status-badge status-assembling',
  archived: 'status-badge status-archived',
}

const cloneSeed = () => structuredClone(canonicalCampaigns) as Campaign[]

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function StatusBadge({ campaign }: { campaign: Campaign }) {
  return (
    <span className={statusStyles[campaign.status]}>
      {campaign.statusLabel}
    </span>
  )
}

function ExternalLink({
  href,
  children,
}: {
  href?: string
  children: React.ReactNode
}) {
  return (
    <a
      className="system-link"
      href={href || '#'}
      onClick={(event) => event.stopPropagation()}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <IconArrowUpRight size={13} stroke={1.7} aria-hidden="true" />
    </a>
  )
}

function displayName(content: Campaign['content'][number]) {
  const match = content.name.match(
    /^W\d+-CAM\d+-(.+)-(Homepage|Hero-Banner|Homepage-Carousel|Trail-Pro-Carousel-Slide|Ridge-Carousel-Slide|Accessories-Carousel-Slide|Promotional-Banner|Email|Email-Hero)$/,
  )

  if (match?.[1]) {
    const suffix = match[2]
      .replaceAll('-', ' ')
      .replace('Trail Pro Carousel Slide', 'Trail Pro Carousel Slide')
    return suffix
  }

  return content.name
}

function readableContentName(
  campaign: Campaign,
  contentId: string,
) {
  const content = campaign.content.find((item) => item.id === contentId)
  if (!content) return contentId

  if (content.contentType === 'Page') return 'Homepage'
  if (content.contentType === 'Carousel') return 'Homepage Carousel'
  if (content.contentType === 'Hero Banner') return 'Hero Banner'
  if (content.contentType === 'Promotional Banner') return 'Promotional Banner'
  if (content.contentType === 'Email') return 'Email'
  if (content.contentType === 'Email Hero') return 'Email Hero'

  if (content.contentType === 'Carousel Slide') {
    if (content.name.includes('Trail-Pro')) return 'Trail Pro Carousel Slide'
    if (content.name.includes('Ridge')) return 'Ridge Carousel Slide'
    if (content.name.includes('Accessories')) return 'Accessories Carousel Slide'
  }

  return displayName(content)
}

function assetReadiness(asset: Campaign['assets'][number]) {
  if (asset.kind === 'image') {
    if (asset.pointOfInterest === 'set') return 'POI set'
    if (asset.pointOfInterest === 'waived') return 'POI waived'
    if (asset.pointOfInterest === 'missing') return 'POI required'
    return null
  }

  if (asset.transcodeProfile === 'set') return 'Transcode profile set'
  if (asset.transcodeProfile === 'waived') return 'Transcode profile waived'
  if (asset.transcodeProfile === 'missing') return 'Transcode profile required'
  return null
}

function stopRowSelection(event: React.SyntheticEvent) {
  event.stopPropagation()
}

function CampaignTable({
  campaigns,
  onSelect,
  onDuplicate,
  onArchive,
}: {
  campaigns: Campaign[]
  onSelect: (campaign: Campaign) => void
  onDuplicate: (campaign: Campaign) => void
  onArchive: (campaign: Campaign) => void
}) {
  return (
    <div className="table-frame">
      <table className="campaign-table">
        <caption className="sr-only">Campaigns</caption>
        <thead>
          <tr>
            <th>Status</th>
            <th>Campaign</th>
            <th>Go live</th>
            <th>Source</th>
            <th>CMS</th>
            <th>DAM</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr
              key={campaign.id}
              tabIndex={0}
              onClick={() => onSelect(campaign)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  onSelect(campaign)
                }
              }}
            >
              <td>
                <StatusBadge campaign={campaign} />
              </td>
              <th scope="row">
                <span className="campaign-name">{campaign.name}</span>
              </th>
              <td className="date-cell">{formatDate(campaign.goLiveDate)}</td>
              <td>
                <ExternalLink href={campaign.sourceTicket.url}>
                  {campaign.sourceTicket.id}
                </ExternalLink>
              </td>
              <td>
                <ExternalLink href={campaign.cmsFolder.url}>
                  Open folder
                </ExternalLink>
              </td>
              <td>
                <ExternalLink href={campaign.damFolder.url}>
                  Open folder
                </ExternalLink>
              </td>
              <td className="campaign-table-actions" onClick={stopRowSelection}>
                {campaign.status === 'signed_off' ? (
                  <div className="table-action-stack">
                    <button
                      className="table-primary-action"
                      onClick={() => onDuplicate(campaign)}
                    >
                      Duplicate
                    </button>
                    <button
                      className="table-secondary-action"
                      onClick={() => onArchive(campaign)}
                    >
                      Archive
                    </button>
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CampaignRail({
  campaigns,
  selected,
  onSelect,
}: {
  campaigns: Campaign[]
  selected: Campaign
  onSelect: (campaign: Campaign) => void
}) {
  return (
    <aside className="campaign-rail" aria-label="Campaign selector">
      <div className="rail-heading">
        Campaigns <span>{campaigns.length}</span>
      </div>
      <div className="rail-list">
        {campaigns.map((campaign) => (
          <button
            className={`rail-item ${campaign.id === selected.id ? 'is-selected' : ''}`}
            key={campaign.id}
            onClick={() => onSelect(campaign)}
            aria-current={campaign.id === selected.id ? 'true' : undefined}
          >
            <StatusBadge campaign={campaign} />
            <span className="rail-item-name">{campaign.name}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

function ActionColumn({
  item,
  campaign,
  onResolve,
  onOpen,
  onInspect,
  resolving,
}: {
  item: AttentionItem
  campaign: Campaign
  onResolve: (item: AttentionItem, action: string) => void
  onOpen: (campaignId: string, targetId?: string) => void
  onInspect?: (targetId: string) => void
  resolving?: boolean
}) {
  if (resolving) {
    return (
      <div className="attention-actions resolved-action">
        <IconCheck size={15} />
        <span>Resolved</span>
      </div>
    )
  }

  const runPrimary = () => {
    if (item.primaryAction.href) {
      window.open(item.primaryAction.href, '_blank', 'noopener,noreferrer')
      return
    }
    onOpen(campaign.id, item.targetId)
  }

  return (
    <div className="attention-actions">
      <button className="primary-action-btn" onClick={runPrimary}>
        {item.primaryAction.label}
      </button>

      {item.secondaryActions?.map((action, index) => {
        if (action.href) {
          return (
            <ExternalLink key={index} href={action.href}>
              {action.label}
            </ExternalLink>
          )
        }

        if (action.action === 'inspect_provenance' && item.targetId) {
          return (
            <button
              key={index}
              className="secondary-action-btn"
              onClick={() => onInspect?.(item.targetId!)}
            >
              {action.label}
            </button>
          )
        }

        return (
          <button
            key={index}
            className="secondary-action-btn"
            onClick={() => action.action && onResolve(item, action.action)}
          >
            {action.label}
          </button>
        )
      })}
    </div>
  )
}

function ActionRow({
  item,
  campaign,
  onResolve,
  onOpen,
  onInspect,
  resolving,
  showCampaign,
}: {
  item: AttentionItem
  campaign: Campaign
  onResolve: (item: AttentionItem, action: string) => void
  onOpen: (campaignId: string, targetId?: string) => void
  onInspect?: (targetId: string) => void
  resolving?: boolean
  showCampaign?: boolean
}) {
  return (
    <div className={`attention-row ${resolving ? 'is-resolving' : ''}`}>
      <div className="attention-info">
        {showCampaign && (
          <div className="attention-campaign-context">{campaign.name}</div>
        )}
        <div className="attention-title">{item.title}</div>
        {item.subtitle && (
          <div className="attention-subtitle">{item.subtitle}</div>
        )}
        <div className="attention-reason">{item.reason}</div>
        {item.reviewComment && (
          <div className="review-comment">
            Review comment: {item.reviewComment}
          </div>
        )}
      </div>

      <ActionColumn
        item={item}
        campaign={campaign}
        onResolve={onResolve}
        onOpen={onOpen}
        onInspect={onInspect}
        resolving={resolving}
      />
    </div>
  )
}

function ProvenancePanel({
  campaign,
  assetId,
  onClose,
}: {
  campaign: Campaign
  assetId: string
  onClose: () => void
}) {
  const asset = campaign.assets.find((item) => item.id === assetId)
  if (!asset) return null

  const linkedTo = asset.linkedFrom[0]?.contentId
    ? readableContentName(campaign, asset.linkedFrom[0].contentId)
    : null

  return (
    <div className="provenance-panel">
      <div className="provenance-panel-header">
        <h3>Why this asset?</h3>
        <button className="secondary-action-btn" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="provenance-item">
        <span className="provenance-label">Asset</span>
        <span className="provenance-value">{asset.filename}</span>
      </div>

      {asset.provenance && (
        <>
          <div className="provenance-item">
            <span className="provenance-label">Mapping type</span>
            <span className="provenance-value">
              {asset.provenance.mode.charAt(0).toUpperCase() +
                asset.provenance.mode.slice(1)}
            </span>
          </div>
          <div className="provenance-item">
            <span className="provenance-label">Basis</span>
            <span className="provenance-value">
              {asset.provenance.summary}
            </span>
          </div>
          <div className="provenance-item">
            <span className="provenance-label">Sources</span>
            <span className="provenance-value provenance-links">
              {asset.provenance.sourceIds.map((sourceId) => {
                const source = campaign.sources.find(
                  (item) => item.id === sourceId,
                )
                return source ? (
                  <ExternalLink key={source.id} href={source.url}>
                    {source.name}
                  </ExternalLink>
                ) : null
              })}
            </span>
          </div>
        </>
      )}

      {linkedTo && (
        <div className="provenance-item">
          <span className="provenance-label">Linked to</span>
          <span className="provenance-value">{linkedTo}</span>
        </div>
      )}
    </div>
  )
}

function ActionsTab({
  campaign,
  resolvingIds,
  onResolve,
  onOpen,
  onFail,
  onSignOff,
  onDuplicate,
  onArchive,
}: {
  campaign: Campaign
  resolvingIds: Set<string>
  onResolve: (item: AttentionItem, action: string) => void
  onOpen: (campaignId: string, targetId?: string) => void
  onFail: () => void
  onSignOff: () => void
  onDuplicate: () => void
  onArchive: () => void
}) {
  const [provenanceAssetId, setProvenanceAssetId] = useState<string | null>(null)

  if (campaign.status === 'needs_attention') {
    const count = campaign.attention.length

    return (
      <div className="actions-view">
        <div className="progress-statement">
          <strong>
            {count} {count === 1 ? 'action' : 'actions'} to move to review
          </strong>
          <p>
            Resolve or waive these items. When none remain, {campaign.name}{' '}
            will move to Needs review.
          </p>
        </div>

        <div className="attention-items">
          {campaign.attention.map((item) => (
            <ActionRow
              key={item.id}
              item={item}
              campaign={campaign}
              onResolve={onResolve}
              onOpen={onOpen}
              onInspect={setProvenanceAssetId}
              resolving={resolvingIds.has(item.id)}
            />
          ))}
        </div>

        {provenanceAssetId && (
          <ProvenancePanel
            campaign={campaign}
            assetId={provenanceAssetId}
            onClose={() => setProvenanceAssetId(null)}
          />
        )}
      </div>
    )
  }

  if (campaign.status === 'needs_review') {
    return (
      <div className="actions-view">
        <div className="progress-statement">
          <strong>Ready for review</strong>
          <p>
            Automated assembly has no unresolved actions. Review the manifest
            and decide whether the overall structure is ready for detailed
            production work.
          </p>
        </div>

        <div className="review-decision-actions">
          <button className="primary-action-btn" onClick={onSignOff}>
            Sign off
          </button>
          <button className="secondary-action-btn" onClick={onFail}>
            Fail review
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="actions-view">
      <div className="signed-off-actions">
        <button className="primary-action-btn" onClick={onDuplicate}>
          <IconCopy size={14} />
          Duplicate
        </button>
        <button className="secondary-action-btn" onClick={onArchive}>
          <IconArchive size={14} />
          Archive
        </button>
      </div>
    </div>
  )
}

function Manifest({ campaign }: { campaign: Campaign }) {
  return (
    <div className="manifest-view">
      <section className="manifest-section">
        <h3>Content</h3>

        {campaign.content.map((content) => (
          <div className="manifest-row" key={content.id}>
            <div className="manifest-stack">
              <strong>{content.name}</strong>
              <span>{content.contentType}</span>
              <span>{content.workflowLabel}</span>
              {content.assignee && <span>{content.assignee}</span>}
              {content.deliveryKey && <span>{content.deliveryKey}</span>}
            </div>
            <ExternalLink href={content.cmsUrl}>Open in CMS</ExternalLink>
          </div>
        ))}
      </section>

      <section className="manifest-section">
        <h3>Assets</h3>

        {campaign.assets.map((asset) => {
          const linkedFrom = asset.linkedFrom[0]
            ? readableContentName(campaign, asset.linkedFrom[0].contentId)
            : null
          const readiness = assetReadiness(asset)

          return (
            <div className="manifest-row" key={asset.id}>
              <div className="manifest-stack">
                <strong>{asset.filename}</strong>
                <span>{asset.kind === 'image' ? 'Image' : 'Video'}</span>
                <span>
                  {asset.relationship === 'unused'
                    ? 'Unused'
                    : asset.relationship === 'unlinked'
                      ? 'Unlinked'
                      : linkedFrom
                        ? `Linked from ${linkedFrom}`
                        : 'Linked'}
                </span>
                {readiness && (
                  <span
                    className={
                      readiness.includes('required')
                        ? 'asset-status-warning'
                        : 'asset-status-ok'
                    }
                  >
                    {readiness}
                  </span>
                )}
              </div>

              <ExternalLink href={asset.damUrl}>Open in DAM</ExternalLink>
            </div>
          )
        })}
      </section>

      <section className="manifest-section">
        <h3>Locations</h3>

        <div className="manifest-location">
          <div className="manifest-stack">
            <strong>CMS folder</strong>
            <span>{campaign.cmsFolder.path}</span>
          </div>
          <ExternalLink href={campaign.cmsFolder.url}>Open folder</ExternalLink>
        </div>

        <div className="manifest-location">
          <div className="manifest-stack">
            <strong>DAM folder</strong>
            <span>{campaign.damFolder.path}</span>
          </div>
          <ExternalLink href={campaign.damFolder.url}>Open folder</ExternalLink>
        </div>
      </section>
    </div>
  )
}

function FailReviewModal({
  campaign,
  onCancel,
  onConfirm,
}: {
  campaign: Campaign
  onCancel: () => void
  onConfirm: (targetId: string, comment: string) => void
}) {
  const options = [
    ...campaign.content.map((content) => ({
      id: content.id,
      label: readableContentName(campaign, content.id),
      type: content.contentType,
    })),
    ...campaign.assets.map((asset) => ({
      id: asset.id,
      label: asset.filename,
      type: asset.kind === 'image' ? 'Image' : 'Video',
    })),
  ]

  const [targetId, setTargetId] = useState(options[0]?.id || '')
  const [comment, setComment] = useState('')

  return (
    <div className="modal-backdrop">
      <div
        className="review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fail-review-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Needs attention</p>
            <h3 id="fail-review-title">Fail review</h3>
          </div>
          <button
            className="icon-button"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <IconX size={18} />
          </button>
        </div>

        <label className="modal-field">
          Affected item
          <select
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label} — {option.type}
              </option>
            ))}
          </select>
        </label>

        <label className="modal-field">
          Comment
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Describe what needs attention"
            rows={4}
          />
        </label>

        <div className="modal-actions">
          <button className="secondary-action-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary-action-btn"
            disabled={!targetId || !comment.trim()}
            onClick={() => onConfirm(targetId, comment.trim())}
          >
            Fail review
          </button>
        </div>
      </div>
    </div>
  )
}

function ArchiveModal({
  campaign,
  onCancel,
  onConfirm,
}: {
  campaign: Campaign
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="modal-backdrop">
      <div
        className="review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Signed off campaign</p>
            <h3 id="archive-title">Archive {campaign.name}?</h3>
          </div>
          <button
            className="icon-button"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <IconX size={18} />
          </button>
        </div>

        <p className="modal-copy">
          The Campaign Production record will be removed from the normal
          campaign list. CMS content and DAM assets will not be changed.
        </p>

        <div className="modal-actions">
          <button className="secondary-action-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="primary-action-btn" onClick={onConfirm}>
            Archive
          </button>
        </div>
      </div>
    </div>
  )
}

function DuplicateModal({
  campaign,
  onCancel,
  onConfirm,
}: {
  campaign: Campaign
  onCancel: () => void
  onConfirm: () => void
}) {
  const [campaignName, setCampaignName] = useState(`${campaign.name} copy`)
  const [cmsFolderName, setCmsFolderName] = useState(campaign.name)
  const [cmsLocation, setCmsLocation] = useState('Campaigns / 2026')
  const [duplicateAssets, setDuplicateAssets] = useState(false)
  const [damFolderName, setDamFolderName] = useState(campaign.name)
  const [damLocation, setDamLocation] = useState('Campaign Photography / 2026')

  return (
    <div className="modal-backdrop">
      <div
        className="review-modal duplicate-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="duplicate-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Signed off campaign</p>
            <h3 id="duplicate-title">Duplicate {campaign.name}</h3>
          </div>
          <button
            className="icon-button"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <IconX size={18} />
          </button>
        </div>

        <label className="modal-field">
          Campaign name
          <input
            value={campaignName}
            onChange={(event) => setCampaignName(event.target.value)}
          />
        </label>

        <fieldset className="modal-fieldset">
          <legend>Content</legend>

          <label className="modal-field">
            CMS folder name
            <input
              value={cmsFolderName}
              onChange={(event) => setCmsFolderName(event.target.value)}
            />
          </label>

          <label className="modal-field">
            Location
            <input
              value={cmsLocation}
              onChange={(event) => setCmsLocation(event.target.value)}
            />
          </label>
        </fieldset>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={duplicateAssets}
            onChange={(event) => setDuplicateAssets(event.target.checked)}
          />
          <span>Duplicate campaign assets</span>
        </label>

        {duplicateAssets && (
          <fieldset className="modal-fieldset">
            <legend>Assets</legend>

            <label className="modal-field">
              DAM folder name
              <input
                value={damFolderName}
                onChange={(event) => setDamFolderName(event.target.value)}
              />
            </label>

            <label className="modal-field">
              Location
              <input
                value={damLocation}
                onChange={(event) => setDamLocation(event.target.value)}
              />
            </label>
          </fieldset>
        )}

        <p className="modal-copy">
          Content will be copied with new system IDs and the same human-readable
          names. If assets are not duplicated, the new content will continue to
          reference the existing DAM assets.
        </p>

        <div className="modal-actions">
          <button className="secondary-action-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="primary-action-btn"
            disabled={!campaignName.trim() || !cmsFolderName.trim()}
            onClick={onConfirm}
          >
            Duplicate
          </button>
        </div>
      </div>
    </div>
  )
}

function CampaignDetail({
  campaign,
  resolvingIds,
  onClose,
  onResolve,
  onOpen,
  onFailReview,
  onSignOff,
  onDuplicate,
  onArchive,
}: {
  campaign: Campaign
  resolvingIds: Set<string>
  onClose: () => void
  onResolve: (item: AttentionItem, action: string) => void
  onOpen: (campaignId: string, targetId?: string) => void
  onFailReview: (campaignId: string, targetId: string, comment: string) => void
  onSignOff: (campaignId: string) => void
  onDuplicate: (campaign: Campaign) => void
  onArchive: (campaign: Campaign) => void
}) {
  const [tab, setTab] = useState<'Actions' | 'Manifest'>(
    campaign.status === 'signed_off' ? 'Manifest' : 'Actions',
  )
  const [showFail, setShowFail] = useState(false)

  useEffect(() => {
    setTab(campaign.status === 'signed_off' ? 'Manifest' : 'Actions')
    setShowFail(false)
  }, [campaign.id, campaign.status])

  return (
    <section className="detail-pane" aria-label={`${campaign.name} details`}>
      <header className="detail-header">
        <div className="detail-title-row">
          <div className="detail-title-with-status">
            <StatusBadge campaign={campaign} />
            <h2>{campaign.name}</h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close campaign detail"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="detail-meta">
          <span>
            Go live <strong>{formatDate(campaign.goLiveDate)}</strong>
          </span>
          <ExternalLink href={campaign.sourceTicket.url}>
            {campaign.sourceTicket.id}
          </ExternalLink>
          <ExternalLink href={campaign.cmsFolder.url}>CMS</ExternalLink>
          <ExternalLink href={campaign.damFolder.url}>DAM</ExternalLink>
        </div>
      </header>

      <div
        className="detail-tabs"
        role="tablist"
        aria-label="Campaign detail sections"
      >
        {(['Actions', 'Manifest'] as const).map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? 'is-active' : ''}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="detail-body">
        {tab === 'Actions' ? (
          <ActionsTab
            campaign={campaign}
            resolvingIds={resolvingIds}
            onResolve={onResolve}
            onOpen={onOpen}
            onFail={() => setShowFail(true)}
            onSignOff={() => onSignOff(campaign.id)}
            onDuplicate={() => onDuplicate(campaign)}
            onArchive={() => onArchive(campaign)}
          />
        ) : (
          <Manifest campaign={campaign} />
        )}
      </div>

      {showFail && (
        <FailReviewModal
          campaign={campaign}
          onCancel={() => setShowFail(false)}
          onConfirm={(targetId, comment) => {
            setShowFail(false)
            onFailReview(campaign.id, targetId, comment)
          }}
        />
      )}
    </section>
  )
}

function AttentionView({
  campaigns,
  resolvingIds,
  onOpen,
  onResolve,
}: {
  campaigns: Campaign[]
  resolvingIds: Set<string>
  onOpen: (campaignId: string, targetId?: string) => void
  onResolve: (item: AttentionItem, action: string) => void
}) {
  const items = campaigns.flatMap((campaign) =>
    campaign.attention.map((item) => ({ item, campaign })),
  )

  return (
    <section className="attention-view">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Attention</p>
          <h2>Operational inbox</h2>
        </div>
        <span className="section-note" aria-live="polite">
          {items.length} unresolved
        </span>
      </div>

      <div className="attention-inbox">
        {items.map(({ item, campaign }) => (
          <ActionRow
            key={`${campaign.id}-${item.id}`}
            item={item}
            campaign={campaign}
            onResolve={onResolve}
            onOpen={onOpen}
            resolving={resolvingIds.has(item.id)}
            showCampaign
          />
        ))}
      </div>
    </section>
  )
}

export default function CampaignProduction() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(cloneSeed)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'Attention' | 'Campaigns'>(
    'Campaigns',
  )
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set())
  const [archiveCampaign, setArchiveCampaign] = useState<Campaign | null>(null)
  const [duplicateCampaign, setDuplicateCampaign] = useState<Campaign | null>(
    null,
  )

  const visibleCampaigns = campaigns.filter(
    (campaign) => campaign.status !== 'archived',
  )
  const selected =
    visibleCampaigns.find((campaign) => campaign.id === selectedId) || null
  const attentionCount = useMemo(
    () =>
      visibleCampaigns.reduce(
        (sum, campaign) => sum + campaign.attention.length,
        0,
      ),
    [visibleCampaigns],
  )

  const updateCampaign = (
    id: string,
    updater: (campaign: Campaign) => Campaign,
  ) => {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === id ? updater(campaign) : campaign,
      ),
    )
  }

  const resolve = (item: AttentionItem, action: string) => {
    if (!['waive_poi', 'mark_unused'].includes(action)) return

    setResolvingIds((current) => new Set(current).add(item.id))

    window.setTimeout(() => {
      updateCampaign(item.campaignId, (campaign) => {
        const assets = campaign.assets.map((asset) => {
          if (asset.id !== item.targetId) return asset

          if (action === 'waive_poi') {
            return { ...asset, pointOfInterest: 'waived' as const }
          }

          if (action === 'mark_unused') {
            return { ...asset, relationship: 'unused' as const }
          }

          return asset
        })

        const attention = campaign.attention.filter(
          (attentionItem) => attentionItem.id !== item.id,
        )

        return {
          ...campaign,
          assets,
          attention,
          status:
            attention.length === 0 ? 'needs_review' : campaign.status,
          statusLabel:
            attention.length === 0 ? 'Needs review' : campaign.statusLabel,
        }
      })

      setResolvingIds((current) => {
        const next = new Set(current)
        next.delete(item.id)
        return next
      })
    }, 360)
  }

  const openCampaign = (campaignId: string) => {
    setSelectedId(campaignId)
    setActiveView('Campaigns')
  }

  const failReview = (
    campaignId: string,
    targetId: string,
    comment: string,
  ) => {
    updateCampaign(campaignId, (campaign) => {
      const content = campaign.content.find((item) => item.id === targetId)
      const asset = campaign.assets.find((item) => item.id === targetId)

      const attentionItem: AttentionItem = {
        id: `review-${Date.now()}`,
        level: content ? 'content' : 'asset',
        campaignId,
        title: content ? content.name : asset?.filename || targetId,
        subtitle:
          content?.contentType ||
          (asset?.kind === 'image' ? 'Image' : 'Video'),
        reason: comment,
        targetId,
        reviewComment: comment,
        primaryAction: content
          ? { label: 'Open content', href: content.cmsUrl }
          : { label: 'Open in DAM', href: asset?.damUrl },
      }

      return {
        ...campaign,
        status: 'needs_attention',
        statusLabel: 'Needs attention',
        attention: [...campaign.attention, attentionItem],
      }
    })
  }

  const signOff = (campaignId: string) => {
    updateCampaign(campaignId, (campaign) => ({
      ...campaign,
      status: 'signed_off',
      statusLabel: 'Signed off',
    }))
  }

  const archive = (campaign: Campaign) => {
    updateCampaign(campaign.id, (current) => ({
      ...current,
      status: 'archived',
      statusLabel: 'Archived',
    }))
    setArchiveCampaign(null)
    if (selectedId === campaign.id) setSelectedId(null)
  }

  const reset = () => {
    setCampaigns(cloneSeed())
    setSelectedId(null)
    setActiveView('Campaigns')
    setResolvingIds(new Set())
    setArchiveCampaign(null)
    setDuplicateCampaign(null)
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <span className="brand-mark">A</span>
          <div>
            <p className="eyebrow">Amplience workspace</p>
            <h1>Campaign Production</h1>
          </div>
        </div>

        <div className="demo-controls">
          <span>Demo controls</span>
          <button onClick={reset}>Reset demo</button>
        </div>
      </header>

      <nav className="primary-nav" aria-label="Primary navigation">
        <button
          className={activeView === 'Attention' ? 'is-active' : ''}
          onClick={() => {
            setActiveView('Attention')
            setSelectedId(null)
          }}
        >
          Attention
          <span className="nav-count">{attentionCount}</span>
        </button>
        <button
          className={activeView === 'Campaigns' ? 'is-active' : ''}
          onClick={() => {
            setActiveView('Campaigns')
            setSelectedId(null)
          }}
        >
          Campaigns
        </button>
      </nav>

      <div className="page-content">
        {activeView === 'Attention' ? (
          <AttentionView
            campaigns={visibleCampaigns}
            resolvingIds={resolvingIds}
            onOpen={openCampaign}
            onResolve={resolve}
          />
        ) : selected ? (
          <div className="split-view">
            <CampaignRail
              campaigns={visibleCampaigns}
              selected={selected}
              onSelect={(campaign) => setSelectedId(campaign.id)}
            />
            <CampaignDetail
              campaign={selected}
              resolvingIds={resolvingIds}
              onClose={() => setSelectedId(null)}
              onResolve={resolve}
              onOpen={openCampaign}
              onFailReview={failReview}
              onSignOff={signOff}
              onDuplicate={setDuplicateCampaign}
              onArchive={setArchiveCampaign}
            />
          </div>
        ) : (
          <section className="campaigns-view">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Campaigns</p>
                <h2>Campaign assembly</h2>
              </div>
              <span className="section-note">
                {visibleCampaigns.length} campaigns
              </span>
            </div>

            <CampaignTable
              campaigns={visibleCampaigns}
              onSelect={(campaign) => setSelectedId(campaign.id)}
              onDuplicate={setDuplicateCampaign}
              onArchive={setArchiveCampaign}
            />
          </section>
        )}
      </div>

      {archiveCampaign && (
        <ArchiveModal
          campaign={archiveCampaign}
          onCancel={() => setArchiveCampaign(null)}
          onConfirm={() => archive(archiveCampaign)}
        />
      )}

      {duplicateCampaign && (
        <DuplicateModal
          campaign={duplicateCampaign}
          onCancel={() => setDuplicateCampaign(null)}
          onConfirm={() => setDuplicateCampaign(null)}
        />
      )}
    </main>
  )
}

export { formatDate }
export const canonicalCampaignSeed = canonicalCampaigns
