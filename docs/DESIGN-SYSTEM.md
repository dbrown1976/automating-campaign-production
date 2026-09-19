# Campaign Production POC: Design System Contract

Version: 0.1  
Source: Amplience AI Playground Design System  
Implementation precedence: **Amplience -> Mantine -> bespoke**

## Purpose

This contract translates the relevant Amplience Figma grammar into implementation rules for Campaign Production.

The goal is not to reproduce the whole design system. The goal is to give v0, Cursor, and human contributors a small, durable Campaign Production kit that:

- looks and behaves like Amplience
- reuses the existing component grammar
- uses Mantine as the fallback implementation layer
- avoids generic AI-dashboard styling
- prevents agents inventing unnecessary component variants

Use the Figma system's **Current** mode, not Legacy.

## Component precedence

For every UI need:

1. Reuse the Amplience component/pattern if it exists and is suitable.
2. Otherwise use the corresponding Mantine primitive themed with Amplience tokens.
3. Build bespoke React only where neither adequately supports the interaction.

Do not introduce generic shadcn components when an Amplience or Mantine equivalent exists.

## Important finding: table

The audited Figma system contains `ARCHIVE/Table`.

Treat it as historical reference only.

For Campaign Production:

- use Mantine Table or semantic HTML as the structural implementation
- apply Amplience typography, colours, spacing, borders, selection states, and interaction grammar
- build the split-view behaviour specifically for Campaign Production

Do not port the archived table component directly.

## Core POC component subset

### Amplience patterns to use

- Badge
- Button
- IconButton
- CloseButton
- Link
- Tabs
- Checkbox
- Drawer
- Modal
- FieldSet
- TextInput
- TextArea where available
- StatusMessage, sparingly
- Tooltip
- existing icon system

### Campaign Production compositions

These are POC compositions, not new global design-system primitives:

- CampaignsTable
- CampaignRail
- CampaignDetailPane
- CampaignStatusBadge
- ContentGraphTree
- AssetReadinessList
- AttentionItem
- ProvenanceInspector
- SourceEvidencePanel
- DemoControls

## Badge

Figma component: `Badge`  
Published key: `ee96e5388cf196ceb41c38e8acb9e9cfbe765857`

Observed properties:

- label text
- optional icon
- icon position
- sizes XS, SM, MD, LG, XL

Use Badge for compact status signalling:

- Needs attention
- Needs review
- Signed off
- Assembling
- actual CMS workflow statuses

Never rely on badge colour alone. Always include a text label.

## Tabs

Figma components:

- `tab`
- `tab/outline`

Published keys:

- `cd68f12e0c8871434dcad1b24524bb9e30c3a0e6`
- `916fe49ed8291b682f57bef290e41355e5f04180`

Observed states include:

- Default
- Hover
- Error
- Inactive
- Blank

Blank is a layout workaround and must not be selected semantically.

Use the system tab grammar for:

- Attention / Campaigns
- Overview / Content / Assets

Do not create an AI-specific tab style.

## Drawer

Figma component: `Drawer`  
Published key: `d966902e5e2d08035991f4f4e1fa5a4bfaf30f36`

Observed sizes:

- Small, ~30%
- Medium, ~60%
- Large, ~90%

Use Drawer only for focused secondary investigation or small interventions where preserving context is valuable.

The main Campaigns split view is **not** a Drawer. It is a persistent master-detail layout.

Do not stack drawers.

## Modal

Use Modal for:

- Duplicate campaign
- consequential archive confirmation
- other explicit confirmation steps if later required

Do not use Modal to recreate CMS or DAM editing.

## FieldSet

Figma component: `FieldSet`  
Published key: `d10630b5e251aa01bd556502095c9f108b8bb255`

Observed states:

- Default
- Error
- Inactive

Observed styles:

- Default
- Fill
- Unstyled

Use FieldSet only when related information or controls genuinely need semantic grouping.

Do not put every section in a fieldset.

## Link

Observed states:

- Default
- Hover
- Focus

Use Link for:

- Jira source ticket
- CMS folder
- DAM folder
- Open in CMS
- Open in DAM
- source-evidence links

External-system links should use the established external-link icon where appropriate.

Links inside campaign rows must not trigger row selection.

## Button family

Published Amplience Design System components include:

- Button
- Button/Small
- Button/Medium
- Button/Large
- IconButton/Small
- IconButton/Medium
- IconButton/Large
- CloseButton

Primary Button key:

`a20580d00b0046f6b3fc2b292d07ff7172e5f51b`

Use for:

- review pass/fail
- duplicate/archive
- modal confirmations
- focused intervention actions

Use ordinary Link for wayfinding where a button is unnecessary.

## Checkbox

Use Checkbox in the Duplicate modal for:

`Duplicate campaign assets`

Do not add unrelated checkbox configuration to the first POC.

## StatusMessage

Use the current StatusMessage, never the component explicitly marked old.

Semantic types observed:

- Success
- Danger
- Warning
- Information

Use sparingly for consequential campaign-level notices or meaningful confirmations. Do not use it for every readiness signal.

## Typography

The system uses IBM Plex Sans and IBM Plex Mono.

### Headings

| Style | Family | Weight | Size | Line height |
| --- | --- | ---: | ---: | ---: |
| h1 | IBM Plex Sans | 400 | 28px | 40px |
| h2 | IBM Plex Sans | 500 | 22px | 38px |
| h3 | IBM Plex Sans | 400 | 16px | 28px |
| title | IBM Plex Sans | 700 | 16px | 28px |

### Body

| Style | Weight | Size | Line height |
| --- | ---: | ---: | ---: |
| Body Bold | 700 | 14px | 24px |
| Body Medium | 500 | 14px | 24px |
| Body Regular | 400 | 14px | 24px |

### Caption

| Style | Family | Weight | Size | Line height |
| --- | --- | ---: | ---: | ---: |
| caption-bold | IBM Plex Sans | 700 | 12px | 14px |
| caption-medium | IBM Plex Sans | 500 | 12px | 14px |
| caption-regular | IBM Plex Sans | 400 | 12px | 14px |
| caption-mono-bold | IBM Plex Mono | 700 | 12px | 14px |
| caption-mono-regular | IBM Plex Mono | 400 | 12px | 16px |

Campaign Production should default to 14px body and 12px operational metadata.

Do not inflate typography to marketing-dashboard sizes.

## Spacing

Current spacing variables:

| Token | Value |
| --- | ---: |
| Spacing/01 | 2px |
| Spacing/02 | 4px |
| Spacing/03 | 8px |
| Spacing/04 | 12px |
| Spacing/05 | 20px |
| Spacing/06 | 24px |
| Spacing/07 | 30px |
| Spacing/08 | 40px |
| Spacing/09 | 50px |
| Spacing/10 | 80px |

Prefer:

- 8px for tight internal relationships
- 12px for compact row/control spacing
- 20px and 24px for section padding
- 30px and 40px for major section separation

Avoid one-off values where a token works.

## Radius

Current radius variables:

| Token | Value |
| --- | ---: |
| None | 0px |
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 100px |

Do not over-round the interface. Prefer restrained radii and borders over card-heavy styling.

## Core colour tokens

Use Current mode.

### Ocean / neutral

| Token | Hex |
| --- | --- |
| White | #FFFFFF |
| Ocean-100 | #002C42 |
| Ocean-80 | #335668 |
| Ocean-65 | #597684 |
| Ocean-30 | #B2C0C6 |
| Ocean-15 | #D9DFE3 |
| Ocean-05 | #F2F4F6 |
| Ocean-03 | #F7F9F9 |
| Onyx-100 | #0A1E29 |

### Primary

| Token | Hex |
| --- | --- |
| Primary-100 | #0374DD |
| Primary-80 | #3590E4 |
| Primary-65 | #5BA5E9 |
| Primary-50 | #81BAEE |
| Primary-10 | #E6F1FC |
| Primary-05 | #F2F8FD |

### Danger

| Token | Hex |
| --- | --- |
| Danger-100 | #E22840 |
| Danger-10 | #FCE9EC |
| Danger-05 | #FEF4F5 |

### Warning

| Token | Hex |
| --- | --- |
| Warning-100 | #EC7520 |
| Warning-10 | #FDF1E9 |
| Warning-05 | #FEF8F4 |

### Success

| Token | Hex |
| --- | --- |
| Success-100 | #5AB513 |
| Success-10 | #EEF8E7 |
| Success-05 | #F7FBF3 |

### Information

| Token | Hex |
| --- | --- |
| Info-100 | #216083 |
| Info-05 | #F4F7F9 |

### Azure

| Token | Hex |
| --- | --- |
| Azure-100 | #B4C5F2 |
| Azure-50 | #D6DFF8 |
| Azure-25 | #ECF1FC |
| Azure-10 | #F8F9FE |

Use semantic colours according to meaning, not decoration.

## Workflow-status colours

The Figma system includes dedicated workflow-status paint styles.

These belong to the configurable CMS content workflow and must not be hardcoded into the campaign-lifecycle palette.

Campaign status and content workflow status are separate concepts.

## Shadows

Available:

- none
- xs
- sm
- md
- lg
- xl

Default to no shadow on tables and ordinary grouped content.

Use xs/sm only where elevation expresses a real layer. Reserve stronger elevation for Modal/Drawer.

## Campaign-status semantics

Suggested mapping:

- Needs attention -> Danger
- Needs review -> Warning or Information, choose one consistent treatment
- Signed off -> Success
- Assembling -> Information or neutral
- Archived -> neutral Ocean treatment

Do not use arbitrary CMS workflow-status colours for campaign lifecycle states.

## Content graph styling

Use:

- indentation
- expand/collapse affordances
- restrained guide lines where useful
- content name as primary text
- content type/workflow/assignee as secondary information
- referenced assets as secondary child rows
- inline readiness markers

Do not:

- use a free-form node network
- place every node in a card
- use decorative AI colours
- show provenance by default on every row

## Asset styling

Use a compact list/table hybrid with:

- filename as primary label
- linked-from relationship as secondary context
- POI/transcode signals
- DAM location where useful
- direct Open in DAM
- Linked and Unlinked groups

Avoid large cards.

## Provenance styling

Progressive disclosure:

1. Operate: only a secondary Why? affordance
2. Understand: concise provenance summary in a restrained inspector
3. Verify: deeper source evidence with Jira/file links

Provenance must remain secondary to the primary task.

## Split-view styling

When a campaign is selected:

- left rail ~30-35%
- detail pane ~65-70%
- left rail shows only campaign name and status
- selected campaign is obvious
- close restores full table

Avoid nested card shells around the two panes. Use borders, neutral surfaces, and spacing to express structure.

## Mantine fallback map

| Need | Fallback |
| --- | --- |
| Campaigns table | Mantine Table |
| split layout | CSS Grid/Flex |
| expandable graph | Mantine Collapse / UnstyledButton / ActionIcon |
| compact check/status icon | Mantine ThemeIcon or Amplience icon |
| Tooltip | Mantine Tooltip |
| Textarea | Mantine Textarea |
| Modal mechanics | Mantine Modal styled to Amplience contract |
| Drawer mechanics | Mantine Drawer styled to Amplience contract |

Mantine is an implementation fallback, not permission to use default Mantine styling.

## Visual constraints

Prefer:

- dense but calm hierarchy
- white/neutral surfaces
- strong alignment
- compact rows
- restrained borders
- small semantic badges
- direct text links
- clear focus/hover/selected states
- progressive disclosure

Avoid:

- rounded SaaS cards everywhere
- gradients
- glowing AI effects
- sparkle/robot motifs
- giant KPI tiles
- dashboard charts
- excessive shadows
- oversized typography
- gratuitous animation/colour

## Accessibility

At minimum:

- status never communicated by colour alone
- visible keyboard focus
- semantic table markup
- links and buttons are distinct controls
- row selection must not swallow link clicks
- expand/collapse is keyboard operable
- Modal/Drawer manage focus correctly
- dense desktop sizing remains readable

## Agent implementation rule

Before changing visual or component behaviour:

1. read this contract
2. reuse an existing Campaign Production component where available
3. reuse the Amplience pattern where applicable
4. fall back to Mantine if needed
5. create bespoke UI only if necessary

Do not silently replace Amplience styling with framework defaults.
