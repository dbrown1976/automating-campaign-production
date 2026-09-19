# Campaign Production POC: Figma Audit and Component Subset

Audit type: read-only  
Figma source: AI Playground Design System  
File key: `KXz75tzHn6zslLdEiabWmm`

## What was inspected

The audit covered:

- file pages and system structure
- local variable collections
- Current vs Legacy token modes
- local typography styles
- local shadow styles
- published Design System library references
- relevant component sets and variants for Campaign Production

No Figma nodes, variables, styles, components, or files were modified.

## Foundation findings

### Typography

The system uses IBM Plex Sans and IBM Plex Mono.

Operational body text is 14px / 24px.

Caption/meta text is 12px.

This is well suited to the dense Campaign Production interface.

### Spacing

Current scale:

`2, 4, 8, 12, 20, 24, 30, 40, 50, 80px`

### Radius

Current scale:

`0, 4, 8, 12, 16, 100px`

### Colour

The system has strong Ocean neutrals plus semantic Primary, Danger, Warning, Success, Information and Azure families.

No new palette is required for Campaign Production.

### Shadows

Available:

`none, xs, sm, md, lg, xl`

The POC should use little elevation outside overlays.

## Relevant component findings

### Strong direct matches

- Badge
- Link
- Tabs
- Drawer
- FieldSet
- Checkbox
- TextInput
- StatusMessage
- Button family
- IconButton family
- CloseButton

### Usable with restraint

- Modal
- Tooltip
- TextArea
- icons

### Do not port as-is

`ARCHIVE/Table`

The table is explicitly archived in the audited system.

Campaign Production should build its new table/split-view composition using Mantine or semantic HTML as the implementation base while applying Amplience tokens and interaction treatment.

## Relevant Figma component references

- Badge: `ee96e5388cf196ceb41c38e8acb9e9cfbe765857`
- Button: `a20580d00b0046f6b3fc2b292d07ff7172e5f51b`
- Tabs / tab: `cd68f12e0c8871434dcad1b24524bb9e30c3a0e6`
- Tabs / outline: `916fe49ed8291b682f57bef290e41355e5f04180`
- Drawer: `d966902e5e2d08035991f4f4e1fa5a4bfaf30f36`
- FieldSet: `d10630b5e251aa01bd556502095c9f108b8bb255`
- TextInput: `e48334830ffa105ca8024dec78d5ce1e6225dda3`

## Campaign Production implementation subset

The POC needs:

1. CampaignStatusBadge
2. AmplienceButton / IconButton / CloseButton
3. AmplienceLink
4. AmplienceTabs
5. AmplienceCheckbox
6. AmplienceModal
7. AmplienceDrawer
8. AmplienceTextInput
9. AmplienceTextArea or Mantine fallback
10. AmplienceTooltip or Mantine fallback
11. CampaignsTable
12. CampaignRail
13. CampaignDetailPane
14. ContentGraphTree
15. AssetReadinessList
16. AttentionItem
17. ProvenanceInspector
18. DemoControls

The product-specific compositions should not be promoted into the global design system during the POC.

## Mantine fallback rule

Use:

**Amplience -> Mantine themed with Amplience tokens -> bespoke React**

The strongest expected Mantine fallbacks are:

- Table
- Collapse/accordion behaviour for the content graph
- modal/drawer mechanics if needed
- Tooltip
- Textarea

Do not use default Mantine visual styling.

## Recommended repo structure

```text
automating-campaign-production/
  app/
  components/
    amplience/
    campaign-production/
  data/
    campaigns.ts
  docs/
    PRODUCT-CONTRACT.md
    DESIGN-SYSTEM.md
    FIGMA-AUDIT.md
  styles/
    tokens.css
    mantine-theme.ts
```

The next implementation step is to establish tokens and canonical demo data before asking v0 to assemble the first screen.
