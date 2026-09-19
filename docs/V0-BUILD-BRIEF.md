# v0 Build Brief: Campaign Production POC

Build the first interactive Campaign Production prototype from the existing repo.

Before writing UI code, read:

- `AGENTS.md`
- `docs/PRODUCT-CONTRACT.md`
- `docs/DESIGN-SYSTEM.md`
- `docs/FIGMA-AUDIT.md`
- `data/campaigns.ts`
- `styles/tokens.css`

Use React/Next.js, TypeScript, Mantine, and the existing Amplience design-system rules in the repo.

Do not add shadcn unless explicitly instructed later.

## Goal of this first build

Prove the Campaign Production shell and interaction model.

The critical interaction is:

**full Campaigns table -> select a campaign -> transform in situ into split view -> inspect Overview / Content / Assets -> switch campaigns from compact rail -> close detail -> return to full table**

Do not build real AI, CMS, DAM, or Jira integrations.

Use only local state and the canonical demo data.

---

## Top-level navigation

Page title:

**Campaign Production**

Primary tabs:

- **Attention**
- **Campaigns**

Default selected tab:

**Campaigns**

Do not add other global navigation.

---

## Campaigns: full-width state

When no campaign is selected, show a full-width semantic table.

Columns:

- Campaign
- Status
- Go live
- Source
- CMS
- DAM

Use the campaigns in `data/campaigns.ts`.

Show the canonical default state:

Active:
- Autumn Trail — Needs attention
- Black Friday — Needs review
- Winter Running — Needs review

Historical:
- Summer Trail — Signed off
- Spring Reset — Signed off
- Winter Essentials — Signed off
- Holiday Gifting — Signed off

Use compact status badges.

The entire row is selectable except the wayfinding links.

Clicking:
- Source must not select the row
- CMS must not select the row
- DAM must not select the row

Use external-link treatment where appropriate.

Do not put each row in a card.

---

## Campaigns: split-view state

Clicking the selectable part of a campaign row must not navigate away.

Transform the same screen into a master-detail layout.

Left:
- approximately 30-35% width
- compact campaign selector
- show only campaign name and status
- selected campaign clearly highlighted

Right:
- approximately 65-70% width
- selected campaign detail pane

Clicking another campaign in the compact left rail updates the detail pane immediately.

Include a close control in the detail pane.

Closing the detail pane restores the full-width campaign table.

This interaction should feel continuous rather than like navigation to another page.

---

## Detail pane

Header shows:

- campaign name
- campaign status
- compact secondary metadata:
  - go-live date
  - source-ticket link
  - CMS-folder link
  - DAM-folder link

Primary tabs:

- Overview
- Content
- Assets

Default:

Overview

Do not add an AI tab.

---

## Overview

For a Needs attention campaign, answer:

**What needs human intervention?**

For Autumn Trail, render the derived attention items from `data/campaigns.ts`.

At minimum include:

1. The Accessories carousel slide content item
   - identify the content name
   - content type
   - Needs attention state
   - **Open content**

2. `autumn-trail-ridge.jpg`
   - Point of interest required
   - **Open in DAM**
   - **Ignore**
   - secondary **Why this asset?**

3. `autumn-trail-accessories-alt.jpg`
   - Unlinked asset
   - **Find destination**
   - **Mark unused**
   - **Open in DAM**

Keep this lightweight. Do not reproduce detailed CMS validation messages.

For Needs review campaigns, Overview should indicate that automated assembly is ready for a high-level structural review.

For Signed off campaigns, show signed-off state plus campaign actions:
- Duplicate
- Archive

---

## Content tab

The Content tab is an expandable content graph, not a flat list and not a free-form node diagram.

For Autumn Trail render the hierarchy from `data/campaigns.ts`:

- Homepage
  - Hero Banner
    - referenced asset
  - Homepage Carousel
    - Trail Pro Carousel Slide
      - referenced asset
    - Ridge Carousel Slide
      - referenced asset
    - Accessories Carousel Slide
      - referenced asset
  - Promotional Banner
    - referenced asset

Also show the Email branch where appropriate.

For each content row show only useful context:
- name
- content type
- workflow status
- assignee where present
- delivery key for Page content
- expand/collapse where it has children
- Open in CMS action when selected or expanded

Referenced assets should appear as compact secondary child rows.

Do not make every node a card.

---

## Assets tab

Group assets into:

### Linked

Show:
- filename
- where it is linked from
- image POI state
- video transcode-profile state
- DAM location where useful
- Open in DAM

### Unlinked

Show campaign assets that are not referenced by content.

For the Autumn Trail unlinked asset expose:
- Find destination
- Mark unused
- Open in DAM

Unlinked is not automatically a failure.

---

## Provenance progressive disclosure

Provenance is secondary.

Do not show full provenance on every row.

Level 1:
- normal object/action view
- secondary **Why?** affordance only where useful

Level 2:
- concise provenance summary
- source file
- direct / inferred / generated
- short explanation of what was derived

Level 3:
- links back to source evidence

For the first build, it is enough to implement the Level 2 summary for the Autumn Trail Ridge asset and its source links.

Do not describe this as hidden AI reasoning.

---

## Review interaction

Black Friday and Winter Running start in **Needs review**.

Review is intentionally high-level.

The user should be able to inspect:
- graph shape
- linked assets
- unlinked items
- delivery key for Page content
- POI checks
- video transcode-profile checks
- content and asset deep links

Provide two review actions:

- **Fail review**
- **Sign off**

### Fail review

Require:
- affected object selection
- comment

Then:
- change campaign state to Needs attention
- attach the comment to the resulting attention item
- make it appear in Attention

### Sign off

Change campaign state to Signed off.

Do not implement multi-stage approval.

---

## Signed-off campaign actions

Every signed-off campaign exposes:

- **Duplicate**
- **Archive**

### Duplicate

Open a modal.

Content is always duplicated.

Ask for:
- CMS destination folder name
- CMS destination location

Explain that:
- all content items are copied
- copied items get new unique IDs
- human-readable names are preserved
- internal relationships are recreated between the copies

Assets are optional.

Include checkbox:

**Duplicate campaign assets**

If checked ask for:
- DAM destination folder name
- DAM destination location

If unchecked, copied content continues to reference the existing assets.

Do not add any replace-assets workflow.

### Archive

Use a confirmation modal.

Archive the Campaign Production record in local state.

Do not archive underlying CMS/DAM objects from this ordinary signed-off action.

---

## Attention tab

Use a production-inbox pattern.

Show actionable interventions across campaigns rather than grouping primarily by campaign.

In the canonical state, the main Attention entries come from Autumn Trail.

When a review campaign is failed, its new review-feedback item should appear here.

Keep each item compact:
- campaign
- affected object
- object type where useful
- reason
- primary action
- secondary Why? only where useful

Do not turn Attention into an analytics dashboard.

---

## Demo controls

Add a small, visually separate **Demo controls** affordance.

It is prototype tooling, not Campaign Production functionality.

At minimum include:

**Reset demo**

Reset must restore the complete canonical state from `data/campaigns.ts`, including:
- statuses
- review comments
- archived campaigns
- duplicate campaigns
- ignored POI requests
- linked/unlinked asset state
- other local mutations

---

## Design-system requirements

Use `styles/tokens.css`.

Use IBM Plex typography.

Use Amplience component grammar from `docs/DESIGN-SYSTEM.md`.

Mantine is the fallback implementation layer.

Do not use the archived Figma table component directly.

Avoid:
- generic shadcn styling
- excessive rounded cards
- gradients
- AI glows
- sparkle/robot icons
- large KPI cards
- dashboard charts
- oversized typography
- excessive shadows

Aim for:
- dense but calm enterprise UI
- compact rows
- clear hierarchy
- restrained borders
- strong alignment
- obvious selected/hover/focus states
- progressive disclosure

## Accessibility

- semantic table in full Campaigns state
- visible keyboard focus
- status communicated with text, not colour alone
- links inside rows remain separately operable
- expand/collapse controls keyboard operable
- modal focus handling
- meaningful labels for buttons and controls

## Scope rule

Do not invent additional product areas.

Do not implement:
- chatbot
- content-generation prompt
- real backend
- real API integrations
- analytics
- scheduling
- publishing
- asset replacement
- full CMS editor
- full DAM

Prioritise making the shell interaction polished and convincing before adding anything else.
