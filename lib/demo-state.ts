import {
  type AttentionItem,
  type Campaign,
  type CampaignStatus,
  createCanonicalDemoState,
} from "@/data/campaigns";

export type PrimaryTab = "attention" | "campaigns";
export type DetailTab = "overview" | "content" | "assets";

export const statusLabel = (status: CampaignStatus): string => {
  switch (status) {
    case "needs_attention":
      return "Needs attention";
    case "needs_review":
      return "Needs review";
    case "signed_off":
      return "Signed off";
    case "assembling":
      return "Assembling";
    case "archived":
      return "Archived";
  }
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const formatGoLive = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${day} ${MONTHS[month - 1]} ${year}`;
};

export const visibleCampaigns = (campaigns: Campaign[]): Campaign[] =>
  campaigns.filter((campaign) => campaign.status !== "archived");

export const activeCampaigns = (campaigns: Campaign[]): Campaign[] =>
  visibleCampaigns(campaigns).filter(
    (campaign) =>
      campaign.status === "assembling" ||
      campaign.status === "needs_attention" ||
      campaign.status === "needs_review",
  );

export const historicalCampaigns = (campaigns: Campaign[]): Campaign[] =>
  visibleCampaigns(campaigns).filter(
    (campaign) => campaign.status === "signed_off",
  );

export const allAttentionItems = (campaigns: Campaign[]): AttentionItem[] =>
  campaigns.flatMap((campaign) =>
    campaign.attention.map((item) => ({
      ...item,
      campaignId: campaign.id,
    })),
  );

export const getCampaign = (
  campaigns: Campaign[],
  id: string | null,
): Campaign | null =>
  id ? (campaigns.find((campaign) => campaign.id === id) ?? null) : null;

export const contentById = (campaign: Campaign, id: string) =>
  campaign.content.find((item) => item.id === id);

export const assetById = (campaign: Campaign, id: string) =>
  campaign.assets.find((item) => item.id === id);

export const rootContentIds = (campaign: Campaign): string[] => {
  const childIds = new Set(
    campaign.content.flatMap((item) => item.childIds),
  );
  return campaign.content
    .filter((item) => !childIds.has(item.id))
    .map((item) => item.id);
};

export const resetDemoState = (): Campaign[] => createCanonicalDemoState();

export const updateCampaign = (
  campaigns: Campaign[],
  campaignId: string,
  updater: (campaign: Campaign) => Campaign,
): Campaign[] =>
  campaigns.map((campaign) =>
    campaign.id === campaignId ? updater(campaign) : campaign,
  );

export const waivePoi = (
  campaigns: Campaign[],
  campaignId: string,
  assetId: string,
): Campaign[] =>
  updateCampaign(campaigns, campaignId, (campaign) => ({
    ...campaign,
    assets: campaign.assets.map((asset) =>
      asset.id === assetId
        ? { ...asset, pointOfInterest: "waived" as const }
        : asset,
    ),
    attention: campaign.attention.filter(
      (item) =>
        !(item.targetId === assetId && item.reason.includes("Point of interest")),
    ),
  }));

export const markAssetUnused = (
  campaigns: Campaign[],
  campaignId: string,
  assetId: string,
): Campaign[] =>
  updateCampaign(campaigns, campaignId, (campaign) => ({
    ...campaign,
    assets: campaign.assets.map((asset) =>
      asset.id === assetId
        ? { ...asset, relationship: "unused" as const }
        : asset,
    ),
    attention: campaign.attention.filter((item) => item.targetId !== assetId),
  }));

export const findDestination = (
  campaigns: Campaign[],
  campaignId: string,
  assetId: string,
): Campaign[] =>
  updateCampaign(campaigns, campaignId, (campaign) => {
    const slide = campaign.content.find((item) =>
      item.name.toLowerCase().includes("accessories"),
    );
    if (!slide) return campaign;

    return {
      ...campaign,
      assets: campaign.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              relationship: "linked" as const,
              linkedFrom: [{ contentId: slide.id, field: "Alternate image" }],
            }
          : asset,
      ),
      content: campaign.content.map((item) =>
        item.id === slide.id
          ? {
              ...item,
              assetIds: item.assetIds.includes(assetId)
                ? item.assetIds
                : [...item.assetIds, assetId],
            }
          : item,
      ),
      attention: campaign.attention.filter((item) => item.targetId !== assetId),
    };
  });

export const signOffCampaign = (
  campaigns: Campaign[],
  campaignId: string,
): Campaign[] =>
  updateCampaign(campaigns, campaignId, (campaign) => ({
    ...campaign,
    status: "signed_off",
    statusLabel: "Signed off",
    review: { available: false },
    attention: [],
  }));

export const failReview = (
  campaigns: Campaign[],
  campaignId: string,
  targetId: string,
  comment: string,
): Campaign[] =>
  updateCampaign(campaigns, campaignId, (campaign) => {
    const content = contentById(campaign, targetId);
    const asset = assetById(campaign, targetId);
    const title = content?.name ?? asset?.filename ?? "Campaign object";
    const subtitle = content?.contentType ?? (asset ? "Asset" : "Campaign");
    const attentionItem: AttentionItem = {
      id: `review-fail-${campaignId}-${targetId}-${Date.now()}`,
      level: content ? "content" : asset ? "asset" : "campaign",
      campaignId,
      title,
      subtitle,
      reason: "Review feedback requires attention.",
      targetId,
      primaryAction: content
        ? { label: "Open content", href: content.cmsUrl }
        : asset
          ? { label: "Open in DAM", href: asset.damUrl }
          : { label: "Open source", href: campaign.sourceTicket.url },
      secondaryActions: [],
      reviewComment: comment,
    };

    return {
      ...campaign,
      status: "needs_attention",
      statusLabel: "Needs attention",
      review: {
        available: false,
        comment,
      },
      attention: [attentionItem, ...campaign.attention],
    };
  });

export const archiveCampaign = (
  campaigns: Campaign[],
  campaignId: string,
): Campaign[] =>
  updateCampaign(campaigns, campaignId, (campaign) => ({
    ...campaign,
    status: "archived",
    statusLabel: "Archived",
  }));

export const duplicateCampaign = (
  campaigns: Campaign[],
  campaignId: string,
  options: {
    cmsFolderName: string;
    cmsLocation: string;
    duplicateAssets: boolean;
    damFolderName?: string;
    damLocation?: string;
  },
): Campaign[] => {
  const source = campaigns.find((campaign) => campaign.id === campaignId);
  if (!source) return campaigns;

  const stamp = Date.now();
  const newId = `${source.id}-copy-${stamp}`;
  const contentIdMap = new Map(
    source.content.map((item) => [item.id, `${item.id}-copy-${stamp}`]),
  );
  const assetIdMap = new Map(
    source.assets.map((asset) => [asset.id, `${asset.id}-copy-${stamp}`]),
  );

  const duplicated: Campaign = {
    ...structuredClone(source),
    id: newId,
    name: `${source.name} (copy)`,
    status: "needs_review",
    statusLabel: "Needs review",
    cmsFolder: {
      name: options.cmsFolderName,
      path: `${options.cmsLocation} / ${options.cmsFolderName}`,
      url: `/cms/folders/${newId}`,
    },
    damFolder: options.duplicateAssets
      ? {
          name: options.damFolderName || `${source.name} assets`,
          path: `${options.damLocation || "Campaign Photography / Copies"} / ${options.damFolderName || source.name}`,
          url: `/dam/folders/${newId}`,
        }
      : { ...source.damFolder },
    content: source.content.map((item) => ({
      ...item,
      id: contentIdMap.get(item.id)!,
      cmsPath: `${options.cmsLocation} / ${options.cmsFolderName}`,
      cmsUrl: `${item.cmsUrl}-copy-${stamp}`,
      childIds: item.childIds.map((childId) => contentIdMap.get(childId)!),
      assetIds: item.assetIds.map((assetId) =>
        options.duplicateAssets ? assetIdMap.get(assetId)! : assetId,
      ),
    })),
    assets: options.duplicateAssets
      ? source.assets.map((asset) => ({
          ...asset,
          id: assetIdMap.get(asset.id)!,
          damPath: `${options.damLocation || "Campaign Photography / Copies"} / ${options.damFolderName || source.name}`,
          damUrl: `${asset.damUrl}-copy-${stamp}`,
          linkedFrom: asset.linkedFrom.map((link) => ({
            ...link,
            contentId: contentIdMap.get(link.contentId)!,
          })),
        }))
      : structuredClone(source.assets),
    attention: [],
    review: { available: true },
  };

  return [duplicated, ...campaigns];
};
