'use client'

import { useState } from 'react'
import { IconArrowUpRight, IconChevronRight, IconX } from '@tabler/icons-react'
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
              <th scope="row"><span className="campaign-name">{campaign.name}</span><span className="campaign-ticket">{campaign.sourceTicket.id}</span></th>
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

function CampaignDetail({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  const [tab, setTab] = useState('Overview')
  return (
    <section className="detail-pane" aria-label={`${campaign.name} details`}>
      <header className="detail-header">
        <div className="detail-title-row">
          <div><p className="eyebrow">Campaign detail</p><h2>{campaign.name}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close campaign detail"><IconX size={18} /></button>
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
        {['Overview', 'Content', 'Assets'].map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? 'is-active' : ''} onClick={() => setTab(item)}>{item}</button>)}
      </div>
      <div className="detail-body">
        <p className="eyebrow">{tab}</p>
        <h3>{tab === 'Overview' ? 'Assembly overview' : `${tab} view`}</h3>
        <p className="placeholder-copy">{tab === 'Overview' ? 'This campaign is ready to inspect. Detailed production work continues in the connected CMS and DAM.' : `The ${tab.toLowerCase()} surface will appear here in the next iteration.`}</p>
        {tab === 'Overview' && <div className="detail-callout"><IconChevronRight size={16} aria-hidden="true" /><span>{campaign.status === 'needs_attention' ? 'Human intervention is required before assembly can progress.' : campaign.status === 'needs_review' ? 'Automated assembly is ready for high-level structural review.' : 'Automated assembly has been signed off.'}</span></div>}
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
