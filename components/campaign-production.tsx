'use client'

import { useState } from 'react'
import { IconArrowUpRight, IconChevronRight, IconChevronDown, IconX, IconCopy, IconArchive } from '@tabler/icons-react'
import { canonicalCampaigns, type Campaign, type CampaignStatus } from '@/data/campaigns' 

const statusStyles: Record<CampaignStatus, string> = {
  needs_attention: 'status-badge status-attention',
  needs_review: 'status-badge status-review',
  signed_off: 'status-badge status-signed-off',
  assembling: 'status-badge status-assembling',
  archived: 'status-badge status-archived',
}

function StatusBadge({ campaign }: { campaign: Campaign }) {
  return <span className={statusStyles[campaign.status]}>{campaign.statusLabel}</span>
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="system-link" href={href} onClick={(event) => event.stopPropagation()}>
      {children}
      <IconArrowUpRight size={13} stroke={1.7} aria-hidden="true" />
    </a>
  )
}

function contentDisplayName(name: string, contentType: string) {
  if (contentType === 'Page') return 'Homepage'
  if (contentType === 'Email') return 'Email'
  if (contentType === 'Hero Banner') return 'Hero Banner'
  if (contentType === 'Promotional Banner') return 'Promotional Banner'
  if (contentType === 'Carousel') return 'Homepage Carousel'
  if (contentType === 'Carousel Slide') {
    const match = name.match(/Trail-Pro|Ridge|Accessories/)
    return `${match?.[0] ?? name} Carousel Slide`.replace('Trail-Pro', 'Trail Pro')
  }
  if (contentType === 'Email Hero') return 'Email Hero'
  if (contentType === 'Promo Grid') return 'Offers Grid'
  return name
}

function CampaignTable({ onSelect }: { onSelect: (campaign: Campaign) => void }) {
  return (
    <div className="table-frame">
      <table className="campaign-table">
        <caption className="sr-only">Campaigns</caption>
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
          {canonicalCampaigns.map((campaign) => (
            <tr key={campaign.id} onClick={() => onSelect(campaign)} tabIndex={0} onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onSelect(campaign)
            }}>
              <th scope="row"><span className="campaign-name">{campaign.name}</span></th>
              <td><StatusBadge campaign={campaign} /></td>
              <td className="date-cell">{formatDate(campaign.goLiveDate)}</td>
              <td><ExternalLink href={campaign.sourceTicket.url}>{campaign.sourceTicket.id}</ExternalLink></td>
              <td><ExternalLink href={campaign.cmsFolder.url}>Open folder</ExternalLink></td>
              <td><ExternalLink href={campaign.damFolder.url}>Open folder</ExternalLink></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CampaignRail({ selected, onSelect }: { selected: Campaign; onSelect: (campaign: Campaign) => void }) {
  return (
    <aside className="campaign-rail" aria-label="Campaign selector">
      <div className="rail-heading">Campaigns <span>{canonicalCampaigns.length}</span></div>
      <div className="rail-list">
        {canonicalCampaigns.map((campaign) => (
          <button className={`rail-item ${campaign.id === selected.id ? 'is-selected' : ''}`} key={campaign.id} onClick={() => onSelect(campaign)} aria-current={campaign.id === selected.id ? 'true' : undefined}>
            <span className="rail-item-name">{campaign.name}</span>
            <StatusBadge campaign={campaign} />
          </button>
        ))}
      </div>
    </aside>
  )
}

function ContentTreeNode({ contentId, campaign, expanded: initialExpanded, onShowProvenance }: { contentId: string; campaign: Campaign; expanded?: boolean; onShowProvenance?: (assetId: string) => void }) {
  const [expanded, setExpanded] = useState(initialExpanded ?? false)
  const content = campaign.content.find(c => c.id === contentId)
  if (!content) return null

  const hasChildren = content.childIds.length > 0 || content.assetIds.length > 0
  const workflowColors: Record<string, string> = {
    ready: 'workflow-ready',
    in_review: 'workflow-review',
    changes_required: 'workflow-changes',
    draft: 'workflow-draft',
  }

  return (
    <div key={contentId} className="content-tree-node">
      <div className="content-node-row">
        {hasChildren && (
          <button className="expand-toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
            {expanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
          </button>
        )}
        {!hasChildren && <span className="expand-toggle-spacer" />}
        <div className="content-node-info">
          <span className="content-node-name">{contentDisplayName(content.name, content.contentType)}</span>
          <span className="content-type-badge">{content.contentType}</span>
          <span className={`workflow-status ${workflowColors[content.workflowStatus]}`}>{content.workflowLabel}</span>
          {content.assignee && <span className="assignee">{content.assignee}</span>}
          {content.deliveryKey && <span className="delivery-key">{content.deliveryKey}</span>}
        </div>
        <ExternalLink href={content.cmsUrl}>Open in CMS</ExternalLink>
      </div>
      {expanded && hasChildren && (
        <div className="content-tree-children">
          {content.childIds.map(childId => (
            <ContentTreeNode key={childId} contentId={childId} campaign={campaign} onShowProvenance={onShowProvenance} />
          ))}
          {content.assetIds.map(assetId => {
            const asset = campaign.assets.find(a => a.id === assetId)
            return asset ? (
              <div key={assetId} className="asset-ref-row">
                <span className="asset-ref-icon">◆</span>
                <span className="asset-filename">{asset.filename}</span>
                <ExternalLink href={asset.damUrl}>Open in DAM</ExternalLink>
              </div>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

function OverviewTab({ campaign, onShowProvenance }: { campaign: Campaign; onShowProvenance?: (assetId: string) => void }) {
  if (campaign.status === 'needs_attention') {
    return (
      <div className="overview-content">
        <div className="attention-items">
          {campaign.attention.map(item => (
            <div key={item.id} className="attention-row">
              <div className="attention-info">
                <div className="attention-title">{item.title}</div>
                {item.subtitle && <div className="attention-subtitle">{item.subtitle}</div>}
                <div className="attention-reason">{item.reason}</div>
              </div>
              <div className="attention-actions">
                {item.primaryAction.href ? (
                  <ExternalLink href={item.primaryAction.href}>{item.primaryAction.label}</ExternalLink>
                ) : (
                  <span className="action-label">{item.primaryAction.label}</span>
                )}
                {item.secondaryActions?.map((action, i) => (
                  <button
                    key={i}
                    className="secondary-action-btn"
                    onClick={() => action.action === 'inspect_provenance' && onShowProvenance?.(item.targetId!)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (campaign.status === 'needs_review') {
    return (
      <div className="overview-content">
        <div className="review-readiness">
          <p className="review-message">Automated assembly is complete and ready for high-level structural review.</p>
          <p className="review-subtext">Review the Content and Assets tabs to assess the overall shape of the campaign.</p>
        </div>
      </div>
    )
  }

  if (campaign.status === 'signed_off') {
    return (
      <div className="overview-content">
        <div className="signed-off-info">
          <p className="signed-off-message">This campaign has been signed off and is ready for detailed production work.</p>
        </div>
      </div>
    )
  }

  return null
}

function ContentTab({ campaign }: { campaign: Campaign }) {
  // Find root content items (those not referenced as children by other items)
  const allChildIds = new Set(campaign.content.flatMap(c => c.childIds))
  const rootIds = campaign.content.filter(c => !allChildIds.has(c.id)).map(c => c.id)

  return (
    <div className="content-tree">
      {rootIds.map(rootId => (
        <ContentTreeNode key={rootId} contentId={rootId} campaign={campaign} expanded={true} />
      ))}
    </div>
  )
}

function AssetsTab({ campaign }: { campaign: Campaign }) {
  const linked = campaign.assets.filter(a => a.relationship === 'linked')
  const unlinked = campaign.assets.filter(a => a.relationship === 'unlinked')

  return (
    <div className="assets-section">
      {linked.length > 0 && (
        <div className="asset-group">
          <h4 className="asset-group-title">Linked</h4>
          {linked.map(asset => (
            <div key={asset.id} className="asset-row">
              <div className="asset-info">
                <span className="asset-filename">{asset.filename}</span>
                {asset.linkedFrom.length > 0 && (
                  <span className="asset-linked-from">from {asset.linkedFrom[0].contentId}</span>
                )}
                {asset.pointOfInterest === 'missing' && <span className="asset-status-warning">POI required</span>}
                {asset.transcodeProfile === 'set' && <span className="asset-status-ok">Profile set</span>}
              </div>
              <ExternalLink href={asset.damUrl}>Open in DAM</ExternalLink>
            </div>
          ))}
        </div>
      )}
      {unlinked.length > 0 && (
        <div className="asset-group">
          <h4 className="asset-group-title">Unlinked</h4>
          {unlinked.map(asset => (
            <div key={asset.id} className="asset-row unlinked">
              <div className="asset-info">
                <span className="asset-filename">{asset.filename}</span>
                <span className="asset-status-unlinked">Unlinked</span>
              </div>
              <div className="asset-actions">
                <button className="secondary-action-btn">Find destination</button>
                <button className="secondary-action-btn">Mark unused</button>
                <ExternalLink href={asset.damUrl}>Open in DAM</ExternalLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CampaignDetail({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const [tab, setTab] = useState('Overview')
  const [showProvenance, setShowProvenance] = useState<string | null>(null)

  const asset = showProvenance ? campaign.assets.find(a => a.id === showProvenance) : null
  const linkedContent = asset?.linkedFrom[0]?.contentId ? campaign.content.find(c => c.id === asset.linkedFrom[0].contentId) : null

  return (
    <section className="detail-pane" aria-label={`${campaign.name} details`}>
      <header className="detail-header">
        <div className="detail-title-row">
          <div><p className="eyebrow">Campaign detail</p><h2>{campaign.name}</h2></div>
          <div className="detail-header-actions">
            {campaign.status === 'signed_off' && (
              <>
                <button className="icon-button" title="Duplicate campaign"><IconCopy size={18} /></button>
                <button className="icon-button" title="Archive campaign"><IconArchive size={18} /></button>
              </>
            )}
            <button className="icon-button" onClick={onClose} aria-label="Close campaign detail"><IconX size={18} /></button>
          </div>
        </div>
        <div className="detail-meta">
          <StatusBadge campaign={campaign} />
          <span>Go live <strong>{formatDate(campaign.goLiveDate)}</strong></span>
          <ExternalLink href={campaign.sourceTicket.url}>{campaign.sourceTicket.id}</ExternalLink>
          <ExternalLink href={campaign.cmsFolder.url}>CMS</ExternalLink>
          <ExternalLink href={campaign.damFolder.url}>DAM</ExternalLink>
        </div>
      </header>
      <div className="detail-tabs" role="tablist" aria-label="Campaign detail sections">
        {['Overview', 'Content', 'Assets'].map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? 'is-active' : ''} onClick={() => { setTab(item); setShowProvenance(null) }}>{item}</button>)}
      </div>
      <div className="detail-body">
        {showProvenance && asset && (
          <div className="provenance-panel">
            <button className="provenance-back" onClick={() => setShowProvenance(null)}>← Back to Overview</button>
            <div className="provenance-content">
              <h4 className="provenance-title">Why this asset?</h4>
              <div className="provenance-item">
                <span className="provenance-label">Asset:</span>
                <span className="provenance-value">{asset.filename}</span>
              </div>
              {asset.provenance && (
                <>
                  <div className="provenance-item">
                    <span className="provenance-label">Source package:</span>
                    <span className="provenance-value provenance-links">{asset.provenance.sourceIds.map(sourceId => { const source = campaign.sources.find(item => item.id === sourceId); return source ? <ExternalLink key={source.id} href={source.url}>{source.name}</ExternalLink> : null })}</span>
                  </div>
                  <div className="provenance-item">
                    <span className="provenance-label">Mapping type:</span>
                    <span className="provenance-value">{asset.provenance.mode}</span>
                  </div>
                  <div className="provenance-item">
                    <span className="provenance-label">Reasoning:</span>
                    <span className="provenance-value">{asset.provenance.summary}</span>
                  </div>
                </>
              )}
              {linkedContent && (
                <div className="provenance-item">
                  <span className="provenance-label">Linked to:</span>
                  <span className="provenance-value">{linkedContent.name}</span>
                </div>
              )}
            </div>
          </div>
        )}
        {!showProvenance && (
          <>
            <p className="eyebrow">{tab}</p>
            <h3>{tab === 'Overview' ? 'Assembly overview' : `${tab} view`}</h3>
            {tab === 'Overview' && <OverviewTab campaign={campaign} onShowProvenance={setShowProvenance} />}
            {tab === 'Content' && <ContentTab campaign={campaign} />}
            {tab === 'Assets' && <AssetsTab campaign={campaign} />}
            {tab === 'Overview' && campaign.status === 'needs_attention' && (
              <div className="detail-callout">
                <IconChevronRight size={16} aria-hidden="true" />
                <span>Human intervention is required before assembly can progress.</span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`))
}

export default function CampaignProduction() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [activeView, setActiveView] = useState('Campaigns')

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup"><span className="brand-mark">A</span><div><p className="eyebrow">Amplience workspace</p><h1>Campaign Production</h1></div></div>
        <div className="demo-controls"><span>Demo controls</span><button onClick={() => setSelectedCampaign(null)}>Reset demo</button></div>
      </header>
      <nav className="primary-nav" aria-label="Primary navigation">
        {['Attention', 'Campaigns'].map((view) => <button key={view} className={activeView === view ? 'is-active' : ''} onClick={() => setActiveView(view)}>{view}{view === 'Attention' && <span className="nav-count">3</span>}</button>)}
      </nav>
      <div className="page-content">
        {activeView === 'Attention' ? <div className="empty-state"><p className="eyebrow">Attention</p><h2>No attention view in this iteration</h2><p>Campaign attention workflows will be added after the Campaigns interaction is established.</p></div> : selectedCampaign ? <div className="split-view"><CampaignRail selected={selectedCampaign} onSelect={setSelectedCampaign} /><CampaignDetail campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} /></div> : <><div className="section-heading"><div><p className="eyebrow">Campaigns</p><h2>Campaign assembly</h2></div><span className="section-note">{canonicalCampaigns.length} campaigns</span></div><CampaignTable onSelect={setSelectedCampaign} /></>}
      </div>
    </main>
  )
}

export { formatDate }

// Keep the canonical seed import visible to the component boundary for demo resets.
export const canonicalCampaignSeed = canonicalCampaigns

// v0 Design System Showcase Page
// The shell intentionally stays local and uses canonical demo state only.
