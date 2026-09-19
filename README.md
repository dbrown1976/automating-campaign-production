# Automating Campaign Production

Prototype for a lightweight Campaign Production control layer over Amplience CMS/DAM workflows.

## Read this first

Before changing product or visual behaviour, read:

1. `docs/PRODUCT-CONTRACT.md`
2. `docs/DESIGN-SYSTEM.md`
3. `docs/FIGMA-AUDIT.md`

These documents are the source of truth for the first POC.

## Product premise

Campaign Production is a wayfinder and control layer, not a replacement CMS or DAM.

- **Attention** tells users what needs them.
- **Campaigns** tells users what is happening.
- Selecting a campaign opens an in-situ split view rather than navigating away.
- The detail surface exposes the content graph, linked assets, readiness signals, and progressive provenance.
- Detailed content work remains in the CMS.
- Detailed asset work remains in the DAM.

## Implementation rule

Component precedence is:

**Amplience pattern -> Mantine themed with Amplience tokens -> bespoke React**

Do not introduce generic shadcn styling where an Amplience or Mantine equivalent exists.

## POC default state

Active campaigns:

- Autumn Trail, Needs attention
- Black Friday, Needs review
- Winter Running, Needs review

Historical signed-off campaigns:

- Summer Trail
- Spring Reset
- Winter Essentials
- Holiday Gifting

The prototype will include demo-only controls that can restore this canonical state.

## Next build step

Set up the React/Next foundation, token/theme layer, canonical seed data, and the small component subset described in the design-system contract before assembling the main screen in v0.
