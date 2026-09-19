export type CampaignStatus =
  | "assembling"
  | "needs_attention"
  | "needs_review"
  | "signed_off"
  | "archived";

export type WorkflowStatus =
  | "ready"
  | "in_review"
  | "changes_required"
  | "draft";

export type ContentItem = {
  id: string;
  name: string;
  contentType: string;
  workflowStatus: WorkflowStatus;
  workflowLabel: string;
  assignee?: string;
  validates: boolean;
  deliveryKey?: string;
  cmsPath: string;
  cmsUrl: string;
  childIds: string[];
  assetIds: string[];
  provenance?: {
    mode: "direct" | "inferred" | "generated";
    summary: string;
    sourceIds: string[];
  };
};

export type Asset = {
  id: string;
  filename: string;
  originalFilename: string;
  kind: "image" | "video";
  damPath: string;
  damUrl: string;
  namingState: "accepted" | "suggested" | "ignored";
  suggestedFilename?: string;
  pointOfInterest: "set" | "missing" | "waived" | "not_applicable";
  transcodeProfile: "set" | "missing" | "waived" | "not_applicable";
  relationship: "linked" | "unlinked" | "unused";
  linkedFrom: Array<{
    contentId: string;
    field: string;
  }>;
  provenance?: {
    mode: "direct" | "inferred" | "generated";
    summary: string;
    sourceIds: string[];
  };
};

export type AttentionItem = {
  id: string;
  level: "campaign" | "content" | "asset";
  campaignId: string;
  title: string;
  subtitle?: string;
  reason: string;
  targetId?: string;
  primaryAction: {
    label: string;
    href?: string;
    action?: string;
  };
  secondaryActions?: Array<{
    label: string;
    href?: string;
    action?: string;
  }>;
  reviewComment?: string;
};

export type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  statusLabel: string;
  goLiveDate: string;
  sourceTicket: {
    system: "Jira";
    id: string;
    title: string;
    url: string;
    state: "active" | "wont_do";
  };
  cmsFolder: {
    name: string;
    path: string;
    url: string;
  };
  damFolder: {
    name: string;
    path: string;
    url: string;
  };
  sources: Array<{
    id: string;
    name: string;
    type: "ticket" | "document" | "spreadsheet" | "archive" | "asset";
    url: string;
  }>;
  content: ContentItem[];
  assets: Asset[];
  attention: AttentionItem[];
  review?: {
    available: boolean;
    comment?: string;
  };
};

export const canonicalCampaigns: Campaign[] = [
  {
    id: "autumn-trail",
    name: "Autumn Trail",
    status: "needs_attention",
    statusLabel: "Needs attention",
    goLiveDate: "2026-09-21",
    sourceTicket: {
      system: "Jira",
      id: "CAM-1842",
      title: "Autumn Trail campaign",
      url: "https://jira.example.com/browse/CAM-1842",
      state: "active",
    },
    cmsFolder: {
      name: "Autumn Trail",
      path: "Campaigns / 2026 / Autumn / Autumn Trail",
      url: "/cms/folders/autumn-trail",
    },
    damFolder: {
      name: "Autumn Trail",
      path: "Campaign Photography / 2026 / Autumn Trail",
      url: "/dam/folders/autumn-trail",
    },
    sources: [
      {
        id: "source-ticket",
        name: "CAM-1842",
        type: "ticket",
        url: "https://jira.example.com/browse/CAM-1842",
      },
      {
        id: "source-brief",
        name: "Autumn Trail campaign brief.docx",
        type: "document",
        url: "/source/autumn-trail-campaign-brief",
      },
      {
        id: "source-content",
        name: "Autumn Trail content.xlsx",
        type: "spreadsheet",
        url: "/source/autumn-trail-content",
      },
      {
        id: "source-assets",
        name: "Autumn Trail assets.zip",
        type: "archive",
        url: "/source/autumn-trail-assets",
      },
    ],
    content: [
      {
        id: "homepage",
        name: "W39-CAM1842-Autumn-Trail-Homepage",
        contentType: "Page",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        deliveryKey: "/autumn-trail",
        cmsPath: "Campaigns / 2026 / Autumn / Autumn Trail / Web",
        cmsUrl: "/cms/content/homepage",
        childIds: ["hero-banner", "homepage-carousel", "promotional-banner"],
        assetIds: [],
        provenance: {
          mode: "direct",
          summary: "The campaign brief requests an Autumn Trail homepage.",
          sourceIds: ["source-brief"],
        },
      },
      {
        id: "hero-banner",
        name: "W39-CAM1842-Autumn-Trail-Hero-Banner",
        contentType: "Hero Banner",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        assignee: "Priya Shah",
        validates: true,
        cmsPath:
          "Campaigns / 2026 / Autumn / Autumn Trail / Web / Homepage",
        cmsUrl: "/cms/content/hero-banner",
        childIds: [],
        assetIds: ["asset-hero"],
        provenance: {
          mode: "inferred",
          summary:
            "Mapped from the homepage hero section in the supplied campaign brief.",
          sourceIds: ["source-brief", "source-content"],
        },
      },
      {
        id: "homepage-carousel",
        name: "W39-CAM1842-Autumn-Trail-Homepage-Carousel",
        contentType: "Carousel",
        workflowStatus: "in_review",
        workflowLabel: "In review",
        assignee: "Maya Patel",
        validates: true,
        cmsPath:
          "Campaigns / 2026 / Autumn / Autumn Trail / Web / Homepage",
        cmsUrl: "/cms/content/homepage-carousel",
        childIds: ["slide-trail-pro", "slide-ridge", "slide-accessories"],
        assetIds: [],
        provenance: {
          mode: "direct",
          summary:
            "The campaign brief specifies a homepage carousel featuring Trail Pro, Ridge and Accessories.",
          sourceIds: ["source-brief"],
        },
      },
      {
        id: "slide-trail-pro",
        name: "W39-CAM1842-Autumn-Trail-Trail-Pro-Carousel-Slide",
        contentType: "Carousel Slide",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        cmsPath:
          "Campaigns / 2026 / Autumn / Autumn Trail / Web / Homepage",
        cmsUrl: "/cms/content/trail-pro-slide",
        childIds: [],
        assetIds: ["asset-trail-pro"],
        provenance: {
          mode: "direct",
          summary: "Trail Pro is the first range named for the carousel.",
          sourceIds: ["source-brief", "source-content"],
        },
      },
      {
        id: "slide-ridge",
        name: "W39-CAM1842-Autumn-Trail-Ridge-Carousel-Slide",
        contentType: "Carousel Slide",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        cmsPath:
          "Campaigns / 2026 / Autumn / Autumn Trail / Web / Homepage",
        cmsUrl: "/cms/content/ridge-slide",
        childIds: [],
        assetIds: ["asset-ridge"],
        provenance: {
          mode: "direct",
          summary: "Ridge is the second range named for the carousel.",
          sourceIds: ["source-brief", "source-content"],
        },
      },
      {
        id: "slide-accessories",
        name: "W39-CAM1842-Autumn-Trail-Accessories-Carousel-Slide",
        contentType: "Carousel Slide",
        workflowStatus: "changes_required",
        workflowLabel: "Changes required",
        assignee: "Maya Patel",
        validates: false,
        cmsPath:
          "Campaigns / 2026 / Autumn / Autumn Trail / Web / Homepage",
        cmsUrl: "/cms/content/accessories-slide",
        childIds: [],
        assetIds: ["asset-accessories"],
        provenance: {
          mode: "direct",
          summary: "Accessories is the third range named for the carousel.",
          sourceIds: ["source-brief", "source-content"],
        },
      },
      {
        id: "promotional-banner",
        name: "W39-CAM1842-Autumn-Trail-Promotional-Banner",
        contentType: "Promotional Banner",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        cmsPath:
          "Campaigns / 2026 / Autumn / Autumn Trail / Web / Homepage",
        cmsUrl: "/cms/content/promotional-banner",
        childIds: [],
        assetIds: ["asset-mobile"],
        provenance: {
          mode: "inferred",
          summary:
            "Created from the secondary homepage promotion described in the brief.",
          sourceIds: ["source-brief"],
        },
      },
      {
        id: "email",
        name: "W39-CAM1842-Autumn-Trail-Email",
        contentType: "Email",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        cmsPath: "Campaigns / 2026 / Autumn / Autumn Trail / Email",
        cmsUrl: "/cms/content/autumn-trail-email",
        childIds: ["email-hero"],
        assetIds: [],
        provenance: {
          mode: "direct",
          summary: "Email is listed as a campaign channel in the source ticket.",
          sourceIds: ["source-ticket", "source-brief"],
        },
      },
      {
        id: "email-hero",
        name: "W39-CAM1842-Autumn-Trail-Email-Hero",
        contentType: "Email Hero",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        cmsPath: "Campaigns / 2026 / Autumn / Autumn Trail / Email",
        cmsUrl: "/cms/content/autumn-trail-email-hero",
        childIds: [],
        assetIds: [],
        provenance: {
          mode: "inferred",
          summary:
            "Created from the supplied email section and mapped copy in the content spreadsheet.",
          sourceIds: ["source-brief", "source-content"],
        },
      },
    ],
    assets: [
      {
        id: "asset-hero",
        filename: "autumn-trail-hero.jpg",
        originalFilename: "IMG_4832.jpg",
        kind: "image",
        damPath: "Campaign Photography / 2026 / Autumn Trail / Hero",
        damUrl: "/dam/assets/autumn-trail-hero",
        namingState: "accepted",
        pointOfInterest: "set",
        transcodeProfile: "not_applicable",
        relationship: "linked",
        linkedFrom: [{ contentId: "hero-banner", field: "Image" }],
        provenance: {
          mode: "inferred",
          summary:
            "Imported from the ticket asset package and matched to the homepage hero.",
          sourceIds: ["source-assets", "source-brief"],
        },
      },
      {
        id: "asset-trail-pro",
        filename: "autumn-trail-trail-pro.jpg",
        originalFilename: "trail1.jpg",
        kind: "image",
        damPath: "Campaign Photography / 2026 / Autumn Trail / Product",
        damUrl: "/dam/assets/trail-pro",
        namingState: "accepted",
        pointOfInterest: "set",
        transcodeProfile: "not_applicable",
        relationship: "linked",
        linkedFrom: [{ contentId: "slide-trail-pro", field: "Image" }],
      },
      {
        id: "asset-ridge",
        filename: "autumn-trail-ridge.jpg",
        originalFilename: "ridge_final2.jpg",
        kind: "image",
        damPath: "Campaign Photography / 2026 / Autumn Trail / Product",
        damUrl: "/dam/assets/ridge",
        namingState: "accepted",
        pointOfInterest: "missing",
        transcodeProfile: "not_applicable",
        relationship: "linked",
        linkedFrom: [{ contentId: "slide-ridge", field: "Image" }],
        provenance: {
          mode: "inferred",
          summary:
            "Matched to the Ridge carousel slide from filename and campaign brief context.",
          sourceIds: ["source-assets", "source-brief"],
        },
      },
      {
        id: "asset-accessories",
        filename: "autumn-trail-accessories.jpg",
        originalFilename: "accessories.jpg",
        kind: "image",
        damPath: "Campaign Photography / 2026 / Autumn Trail / Product",
        damUrl: "/dam/assets/accessories",
        namingState: "accepted",
        pointOfInterest: "set",
        transcodeProfile: "not_applicable",
        relationship: "linked",
        linkedFrom: [{ contentId: "slide-accessories", field: "Image" }],
      },
      {
        id: "asset-mobile",
        filename: "autumn-trail-mobile-banner.jpg",
        originalFilename: "mobile-banner.jpg",
        kind: "image",
        damPath: "Campaign Photography / 2026 / Autumn Trail / Promotional",
        damUrl: "/dam/assets/mobile-banner",
        namingState: "accepted",
        pointOfInterest: "set",
        transcodeProfile: "not_applicable",
        relationship: "linked",
        linkedFrom: [{ contentId: "promotional-banner", field: "Image" }],
      },
      {
        id: "asset-accessories-alt",
        filename: "autumn-trail-accessories-alt.jpg",
        originalFilename: "IMG_4891_alt.jpg",
        kind: "image",
        damPath: "Campaign Photography / 2026 / Autumn Trail / Product",
        damUrl: "/dam/assets/accessories-alt",
        namingState: "accepted",
        pointOfInterest: "set",
        transcodeProfile: "not_applicable",
        relationship: "unlinked",
        linkedFrom: [],
        provenance: {
          mode: "direct",
          summary:
            "Imported from the campaign asset package but not mapped into the assembled content graph.",
          sourceIds: ["source-assets"],
        },
      },
    ],
    attention: [
      {
        id: "attention-accessories-content",
        level: "content",
        campaignId: "autumn-trail",
        title: "W39-CAM1842-Autumn-Trail-Accessories-Carousel-Slide",
        subtitle: "Carousel Slide",
        reason: "This content item needs attention.",
        targetId: "slide-accessories",
        primaryAction: {
          label: "Open content",
          href: "/cms/content/accessories-slide",
        },
      },
      {
        id: "attention-ridge-poi",
        level: "asset",
        campaignId: "autumn-trail",
        title: "autumn-trail-ridge.jpg",
        subtitle: "Image",
        reason: "Point of interest required.",
        targetId: "asset-ridge",
        primaryAction: {
          label: "Open in DAM",
          href: "/dam/assets/ridge",
        },
        secondaryActions: [
          { label: "Ignore", action: "waive_poi" },
          { label: "Why this asset?", action: "inspect_provenance" },
        ],
      },
      {
        id: "attention-unlinked-asset",
        level: "asset",
        campaignId: "autumn-trail",
        title: "autumn-trail-accessories-alt.jpg",
        subtitle: "Unlinked asset",
        reason: "This campaign asset is not linked to content.",
        targetId: "asset-accessories-alt",
        primaryAction: {
          label: "Find destination",
          action: "find_destination",
        },
        secondaryActions: [
          { label: "Mark unused", action: "mark_unused" },
          { label: "Open in DAM", href: "/dam/assets/accessories-alt" },
        ],
      },
    ],
    review: {
      available: false,
    },
  },

  {
    id: "black-friday",
    name: "Black Friday",
    status: "needs_review",
    statusLabel: "Needs review",
    goLiveDate: "2026-09-25",
    sourceTicket: {
      system: "Jira",
      id: "CAM-1798",
      title: "Black Friday campaign",
      url: "https://jira.example.com/browse/CAM-1798",
      state: "active",
    },
    cmsFolder: {
      name: "Black Friday",
      path: "Campaigns / 2026 / Black Friday",
      url: "/cms/folders/black-friday",
    },
    damFolder: {
      name: "Black Friday",
      path: "Campaign Photography / 2026 / Black Friday",
      url: "/dam/folders/black-friday",
    },
    sources: [
      {
        id: "black-friday-ticket",
        name: "CAM-1798",
        type: "ticket",
        url: "https://jira.example.com/browse/CAM-1798",
      },
    ],
    content: [
      {
        id: "bf-homepage",
        name: "W39-CAM1798-Black-Friday-Homepage",
        contentType: "Page",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        deliveryKey: "/black-friday",
        cmsPath: "Campaigns / 2026 / Black Friday / Web",
        cmsUrl: "/cms/content/black-friday-homepage",
        childIds: ["bf-hero", "bf-offers-grid"],
        assetIds: [],
      },
      {
        id: "bf-hero",
        name: "W39-CAM1798-Black-Friday-Hero",
        contentType: "Hero Banner",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        cmsPath: "Campaigns / 2026 / Black Friday / Web",
        cmsUrl: "/cms/content/black-friday-hero",
        childIds: [],
        assetIds: ["bf-hero-asset"],
      },
      {
        id: "bf-offers-grid",
        name: "W39-CAM1798-Black-Friday-Offers-Grid",
        contentType: "Promo Grid",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        cmsPath: "Campaigns / 2026 / Black Friday / Web",
        cmsUrl: "/cms/content/black-friday-offers-grid",
        childIds: [],
        assetIds: [],
      },
    ],
    assets: [
      {
        id: "bf-hero-asset",
        filename: "black-friday-hero.jpg",
        originalFilename: "black_friday_hero_final.jpg",
        kind: "image",
        damPath: "Campaign Photography / 2026 / Black Friday / Hero",
        damUrl: "/dam/assets/black-friday-hero",
        namingState: "accepted",
        pointOfInterest: "set",
        transcodeProfile: "not_applicable",
        relationship: "linked",
        linkedFrom: [{ contentId: "bf-hero", field: "Image" }],
      },
    ],
    attention: [],
    review: {
      available: true,
    },
  },

  {
    id: "winter-running",
    name: "Winter Running",
    status: "needs_review",
    statusLabel: "Needs review",
    goLiveDate: "2026-10-03",
    sourceTicket: {
      system: "Jira",
      id: "CAM-1861",
      title: "Winter Running campaign",
      url: "https://jira.example.com/browse/CAM-1861",
      state: "active",
    },
    cmsFolder: {
      name: "Winter Running",
      path: "Campaigns / 2026 / Winter / Winter Running",
      url: "/cms/folders/winter-running",
    },
    damFolder: {
      name: "Winter Running",
      path: "Campaign Photography / 2026 / Winter Running",
      url: "/dam/folders/winter-running",
    },
    sources: [
      {
        id: "winter-running-ticket",
        name: "CAM-1861",
        type: "ticket",
        url: "https://jira.example.com/browse/CAM-1861",
      },
    ],
    content: [
      {
        id: "wr-homepage",
        name: "W40-CAM1861-Winter-Running-Homepage",
        contentType: "Page",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        deliveryKey: "/winter-running",
        cmsPath: "Campaigns / 2026 / Winter / Winter Running / Web",
        cmsUrl: "/cms/content/winter-running-homepage",
        childIds: ["wr-hero"],
        assetIds: [],
      },
      {
        id: "wr-hero",
        name: "W40-CAM1861-Winter-Running-Hero",
        contentType: "Hero Banner",
        workflowStatus: "ready",
        workflowLabel: "Ready",
        validates: true,
        cmsPath: "Campaigns / 2026 / Winter / Winter Running / Web",
        cmsUrl: "/cms/content/winter-running-hero",
        childIds: [],
        assetIds: ["wr-video"],
      },
    ],
    assets: [
      {
        id: "wr-video",
        filename: "winter-running-hero.mp4",
        originalFilename: "winter-running-master.mp4",
        kind: "video",
        damPath: "Campaign Photography / 2026 / Winter Running / Video",
        damUrl: "/dam/assets/winter-running-hero-video",
        namingState: "accepted",
        pointOfInterest: "not_applicable",
        transcodeProfile: "set",
        relationship: "linked",
        linkedFrom: [{ contentId: "wr-hero", field: "Video" }],
      },
    ],
    attention: [],
    review: {
      available: true,
    },
  },

  ...[
    ["summer-trail", "Summer Trail", "2026-06-18", "CAM-1512"],
    ["spring-reset", "Spring Reset", "2026-03-12", "CAM-1388"],
    ["winter-essentials", "Winter Essentials", "2025-11-06", "CAM-1194"],
    ["holiday-gifting", "Holiday Gifting", "2025-11-20", "CAM-1216"],
  ].map(([id, name, goLiveDate, ticket]) => ({
    id,
    name,
    status: "signed_off" as const,
    statusLabel: "Signed off",
    goLiveDate,
    sourceTicket: {
      system: "Jira" as const,
      id: ticket,
      title: `${name} campaign`,
      url: `https://jira.example.com/browse/${ticket}`,
      state: "active" as const,
    },
    cmsFolder: {
      name,
      path: `Campaigns / Historical / ${name}`,
      url: `/cms/folders/${id}`,
    },
    damFolder: {
      name,
      path: `Campaign Photography / Historical / ${name}`,
      url: `/dam/folders/${id}`,
    },
    sources: [
      {
        id: `${id}-ticket`,
        name: ticket,
        type: "ticket" as const,
        url: `https://jira.example.com/browse/${ticket}`,
      },
    ],
    content: [],
    assets: [],
    attention: [],
    review: {
      available: false,
    },
  })),
];

export const canonicalAttentionItems = canonicalCampaigns.flatMap(
  (campaign) => campaign.attention,
);

export const createCanonicalDemoState = (): Campaign[] =>
  structuredClone(canonicalCampaigns);
