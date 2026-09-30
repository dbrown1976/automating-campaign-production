"use client";

import { useMemo, useState } from "react";
import type { AttentionItem, Campaign } from "@/data/campaigns";
import {
  activeCampaigns,
  allAttentionItems,
  archiveCampaign,
  duplicateCampaign,
  failReview,
  findDestination,
  getCampaign,
  historicalCampaigns,
  markAssetUnused,
  resetDemoState,
  signOffCampaign,
  visibleCampaigns,
  waivePoi,
  type DetailTab,
  type PrimaryTab,
} from "@/lib/demo-state";
import { CampaignsTable } from "./campaigns-table";
import { CampaignRail } from "./campaign-rail";
import { CampaignDetailPane } from "./detail-pane";
import { AttentionInbox } from "./attention-inbox";
import {
  ArchiveModal,
  DuplicateModal,
  FailReviewModal,
} from "./modals";

export function CampaignProductionApp() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => resetDemoState());
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>("campaigns");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [provenanceAssetId, setProvenanceAssetId] = useState<string | null>(
    null,
  );
  const [attentionProvenanceKey, setAttentionProvenanceKey] = useState<
    string | null
  >(null);
  const [failOpen, setFailOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const selectedCampaign = getCampaign(campaigns, selectedCampaignId);
  const visible = useMemo(() => visibleCampaigns(campaigns), [campaigns]);
  const active = useMemo(() => activeCampaigns(campaigns), [campaigns]);
  const historical = useMemo(() => historicalCampaigns(campaigns), [campaigns]);
  const attentionItems = useMemo(() => allAttentionItems(campaigns), [campaigns]);

  const selectCampaign = (id: string) => {
    setSelectedCampaignId(id);
    setDetailTab("overview");
    setProvenanceAssetId(null);
    setPrimaryTab("campaigns");
  };

  const closeDetail = () => {
    setSelectedCampaignId(null);
    setProvenanceAssetId(null);
  };

  const handleAttentionAction = (item: AttentionItem, action: string) => {
    if (!item.targetId) return;
    if (action === "waive_poi") {
      setCampaigns((current) => waivePoi(current, item.campaignId, item.targetId!));
    }
    if (action === "mark_unused") {
      setCampaigns((current) =>
        markAssetUnused(current, item.campaignId, item.targetId!),
      );
    }
    if (action === "find_destination") {
      setCampaigns((current) =>
        findDestination(current, item.campaignId, item.targetId!),
      );
    }
  };

  return (
    <div className="cp-app">
      <header className="cp-header">
        <div className="cp-header-main">
          <h1 className="cp-title">Campaign Production</h1>
          <div className="cp-primary-tabs" role="tablist" aria-label="Primary">
            <button
              type="button"
              role="tab"
              className="cp-tab"
              aria-selected={primaryTab === "attention"}
              data-active={primaryTab === "attention"}
              onClick={() => {
                setPrimaryTab("attention");
                closeDetail();
              }}
            >
              Attention
              {attentionItems.length > 0 ? ` (${attentionItems.length})` : ""}
            </button>
            <button
              type="button"
              role="tab"
              className="cp-tab"
              aria-selected={primaryTab === "campaigns"}
              data-active={primaryTab === "campaigns"}
              onClick={() => setPrimaryTab("campaigns")}
            >
              Campaigns
            </button>
          </div>
        </div>
      </header>

      <main className="cp-body">
        {primaryTab === "attention" ? (
          <AttentionInbox
            items={attentionItems}
            campaigns={campaigns}
            provenanceKey={attentionProvenanceKey}
            onPrimaryAction={(item) => {
              if (item.primaryAction.action) {
                handleAttentionAction(item, item.primaryAction.action);
              }
            }}
            onSecondaryAction={handleAttentionAction}
            onShowProvenance={setAttentionProvenanceKey}
            onHideProvenance={() => setAttentionProvenanceKey(null)}
          />
        ) : null}

        {primaryTab === "campaigns" && !selectedCampaign ? (
          <div className="cp-stack-lg">
            <CampaignsTable
              title="Active"
              campaigns={active}
              selectedId={selectedCampaignId}
              onSelect={selectCampaign}
            />
            <CampaignsTable
              title="Historical"
              campaigns={historical}
              selectedId={selectedCampaignId}
              onSelect={selectCampaign}
            />
          </div>
        ) : null}

        {primaryTab === "campaigns" && selectedCampaign ? (
          <div className="cp-split">
            <CampaignRail
              campaigns={visible}
              selectedId={selectedCampaign.id}
              onSelect={selectCampaign}
            />
            <CampaignDetailPane
              campaign={selectedCampaign}
              detailTab={detailTab}
              provenanceAssetId={provenanceAssetId}
              onDetailTabChange={setDetailTab}
              onClose={closeDetail}
              onShowProvenance={setProvenanceAssetId}
              onHideProvenance={() => setProvenanceAssetId(null)}
              onWaivePoi={(assetId) =>
                setCampaigns((current) =>
                  waivePoi(current, selectedCampaign.id, assetId),
                )
              }
              onMarkUnused={(assetId) =>
                setCampaigns((current) =>
                  markAssetUnused(current, selectedCampaign.id, assetId),
                )
              }
              onFindDestination={(assetId) =>
                setCampaigns((current) =>
                  findDestination(current, selectedCampaign.id, assetId),
                )
              }
              onFailReview={() => setFailOpen(true)}
              onSignOff={() =>
                setCampaigns((current) =>
                  signOffCampaign(current, selectedCampaign.id),
                )
              }
              onDuplicate={() => setDuplicateOpen(true)}
              onArchive={() => setArchiveOpen(true)}
            />
          </div>
        ) : null}
      </main>

      <aside className="cp-demo" aria-label="Demo controls">
        <p className="cp-demo-label">Demo controls</p>
        <p className="cp-demo-copy">
          Prototype tooling. Resets local demo state to the canonical seed.
        </p>
        <button
          type="button"
          className="cp-button"
          onClick={() => {
            setCampaigns(resetDemoState());
            setSelectedCampaignId(null);
            setPrimaryTab("campaigns");
            setDetailTab("overview");
            setProvenanceAssetId(null);
            setAttentionProvenanceKey(null);
            setFailOpen(false);
            setDuplicateOpen(false);
            setArchiveOpen(false);
          }}
        >
          Reset demo
        </button>
      </aside>

      <FailReviewModal
        opened={failOpen}
        campaign={selectedCampaign}
        onClose={() => setFailOpen(false)}
        onConfirm={(targetId, comment) => {
          if (!selectedCampaign) return;
          setCampaigns((current) =>
            failReview(current, selectedCampaign.id, targetId, comment),
          );
          setFailOpen(false);
          setDetailTab("overview");
        }}
      />

      <DuplicateModal
        key={selectedCampaign?.id ?? "duplicate"}
        opened={duplicateOpen}
        campaign={selectedCampaign}
        onClose={() => setDuplicateOpen(false)}
        onConfirm={(options) => {
          if (!selectedCampaign) return;
          setCampaigns((current) =>
            duplicateCampaign(current, selectedCampaign.id, options),
          );
          setDuplicateOpen(false);
        }}
      />

      <ArchiveModal
        opened={archiveOpen}
        campaign={selectedCampaign}
        onClose={() => setArchiveOpen(false)}
        onConfirm={() => {
          if (!selectedCampaign) return;
          setCampaigns((current) =>
            archiveCampaign(current, selectedCampaign.id),
          );
          setArchiveOpen(false);
          closeDetail();
        }}
      />
    </div>
  );
}
