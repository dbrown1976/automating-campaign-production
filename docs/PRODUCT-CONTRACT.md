# Campaign Production POC: Product Contract

Version: 0.1  
Status: Foundation for first coded prototype

## Product purpose

Campaign Production is a lightweight control layer over campaign assembly in Amplience.

It does not replace the CMS, DAM, Jira, or the detailed production workflow. It gives users one place to:

- see campaigns in automated assembly
- see what needs human attention
- inspect the overall shape of assembled content and assets
- move directly into the CMS, DAM, or source ticket when detailed work is required
- review the assembled campaign at a high level
- pass or fail the automated assembly
- retrieve, duplicate, or archive previously signed-off campaigns

Core interaction principle:

> **Attention tells me what needs me. Campaigns tells me what is happening.**

Detailed content editing belongs in the CMS. Detailed asset editing belongs in the DAM.

## Top-level information architecture

There are two primary views.

### Attention

A prioritised operational inbox containing things that require human action. The unit is an intervention, not a campaign.

### Campaigns

A list of campaigns and the main way into investigating a particular campaign. Campaigns includes active and historical signed-off campaigns.

## Campaign lifecycle

### Assembling

Automated assembly is still doing useful work and can continue without human input.

### Needs attention

One or more human interventions are required before the campaign can progress.

Needs attention does not imply system failure. It means the process has reached something that requires a person to resolve, waive, or redirect.

### Needs review

Automated assembly has completed sufficiently for a human to assess the overall shape of the campaign.

### Signed off

The reviewer approves the overall machine-assembled structure.

Signed off does not mean publication-ready. It means automated assembly has been accepted and the campaign is ready for detailed human production work.

### Archived

The campaign record is removed from the normal active/signed-off workflow but remains retrievable.

## Review transitions

### Pass

`Needs review -> Signed off`

Passing means:

> I approve of the overall shape of this automated assembly and it is ready for detailed human production work.

### Fail

`Needs review -> Needs attention`

A failed review must allow a comment to be attached to the affected content item, asset, relationship, or campaign object. That comment becomes part of the resulting Needs attention item.

The POC does not include approval chains, legal review, publishing approval, or detailed assignment workflows.

## Source ticket and provenance

Every campaign originates from a source ticket.

Store:

- source system, initially Jira
- ticket ID
- ticket title where available
- direct ticket URL
- campaign name
- go-live date
- source attachments/files where available

The source ticket ID must be a direct link back to the source system.

If the ticket changes to a terminal state such as **Won't do**, Campaign Production raises a campaign-level Needs attention item with:

- an explanation that the source request has been cancelled
- a direct link to the source ticket
- an action to archive all campaign content items created in the CMS

Asset handling for this cancellation action is outside the first POC unless later specified.

## Full Campaigns view

When no campaign is selected, Campaigns uses the full available width.

Columns:

- Campaign
- Status
- Go live
- Source
- CMS
- DAM

Source ticket, CMS folder, and DAM folder are direct links. Clicking those links must not select the row.

Clicking elsewhere on a row selects the campaign.

## Split-view interaction

Selecting a campaign stays on the same screen.

- campaign list compresses to approximately 30-35% width
- detail pane occupies approximately 65-70%
- compressed rail shows only campaign name and status
- selected campaign is visually clear
- selecting another campaign updates the detail pane immediately
- closing the pane restores the full table

The full table is for scanning and comparison. The compressed rail is only for switching campaigns. The detail pane is for understanding and action.

## Campaign detail pane

Primary tabs:

- Overview
- Content
- Assets

Do not add a chatbot, AI tab, analytics dashboard, or full editor.

The detail pane retains direct links to:

- source ticket
- CMS campaign folder
- DAM campaign folder

## Content model

Each content item stores at minimum:

- unique content ID
- human-readable name
- content type
- campaign association
- CMS folder/location
- CMS deep link
- workflow status
- assignee where relevant
- validation state
- references to child content
- references to assets
- provenance/source references where available

### Content naming

Automated content items follow an agreed naming convention containing:

- week number
- campaign number
- human-readable title
- content type

Example:

`W39-CAM1842-Autumn-Trail-Homepage-Carousel`

Human-readable names do not need to be unique because content items have unique system IDs. Duplicated content may retain the same name.

### Validation

Campaign Production only needs to know whether a content item validates.

When validation fails show:

- content item name
- content type
- Needs attention status
- Open content action

The detailed validation reason belongs in the CMS.

## Workflow status and assignees

Content uses the existing configurable workflow-status system. Campaign Production must show the real workflow badge and assignee where relevant.

Do not invent a parallel content workflow.

## Content graph

Content is primarily understood as a graph, not a flat inventory.

Use an expandable hierarchy, for example:

- Homepage
  - Hero banner
  - Homepage carousel
    - Trail Pro slide
    - Ridge slide
    - Accessories slide
  - Promotional banner

Referenced assets should appear in context beneath or alongside the content item that references them.

Users must be able to:

- see parent-child relationships
- see assets referenced from each content item
- see unlinked content where relevant
- open any content item in the CMS
- open any asset in the DAM

Do not use a free-form node-and-line graph for the POC.

## Relationship readiness

Object readiness and relationship readiness are separate.

For Needs review:

- all required content-to-content references resolve
- all required content-to-asset references resolve
- no relationship decision still requires human input
- the graph is valid for the underlying content models

## Asset model

Each asset stores at minimum:

- asset ID
- original filename
- current filename
- campaign association
- DAM folder/location
- DAM deep link
- linked content item(s)
- linked/unlinked state
- point-of-interest state where relevant
- transcode-profile state where relevant
- readiness/resolution state
- provenance/source references where available

## Asset naming recommendations

Campaign Production may suggest more descriptive filenames.

Example:

`IMG_4837.jpg -> autumn-trail-ridge-carousel.jpg`

Actions:

- Accept
- Ignore
- Don't flag this class of recommendation in future

The final action changes policy and should not be presented as an accidental single click.

## Point of interest and transcode profiles

For an image requiring a POI:

- surface the missing POI
- primary action is Open in DAM
- POI is set off-screen in DAM
- Campaign Production recognises the underlying state change
- show a positive readiness indicator automatically

A POI requirement may also be explicitly waived where allowed.

The same model applies to video transcode profiles.

A requirement is resolved when either completed or explicitly waived.

## Linked and unlinked assets

Group campaign assets into:

### Linked

Referenced by campaign content.

### Unlinked

Associated with the campaign but not referenced by the graph.

Unlinked is not automatically a failure.

Actions may include:

- Find destination
- Mark unused
- Open in DAM

An asset marked unused is resolved.

## Folder placement

Expose where campaign objects live.

At campaign level:

- CMS campaign folder path and link
- DAM campaign folder path and link

At object level show the relevant CMS/DAM location where useful.

The interface should consistently answer:

- what exists
- how it connects
- whether it is ready
- where it lives

## Needs attention

Needs attention can occur at three levels.

### Campaign-level

Example: source Jira ticket changes to Won't do.

### Content-level

Example: content item fails CMS validation.

Campaign Production identifies the item and provides Open content. Detailed validation remains in CMS.

### Asset-level

Examples:

- filename suggestion
- missing POI
- missing transcode profile
- unlinked asset

Attention items should be derived from underlying state, not treated as a disconnected manual task system.

## Provenance and investigation

Provenance is progressive disclosure, especially within Needs attention.

### Level 1: Operate

Show the object, state, and primary action.

### Level 2: Understand

A secondary Why? action shows a concise provenance summary:

- source file
- source location where available
- direct / inferred / generated
- resulting object or relationship

### Level 3: Verify

Provide links back to original evidence:

- Jira ticket
- source attachment
- source file/section/row where available
- original attached asset

Use the model:

`evidence -> interpretation -> resulting action`

Do not claim to expose private model reasoning.

## Needs review

Needs review is a high-level structural review of automated assembly.

The reviewer sees the content graph as the main surface and can see:

- content hierarchy
- linked assets
- unlinked content/assets
- CMS and DAM links
- page delivery key/slug where relevant
- POI state for images
- transcode-profile state for video
- workflow status where useful

The reviewer is deciding whether the overall assembled shape is credible enough for detailed human production work.

## Object-specific review signals

### Page

- delivery key / slug
- workflow status

### Other content

- workflow status
- child/reference structure where relevant

### Image

- linked location
- POI state

### Video

- linked location
- transcode-profile state

### Any asset

- linked/unlinked state
- Open in DAM

Only show readiness properties meaningful to that object type.

## Signed-off campaign actions

Signed-off campaigns remain retrievable and inspectable.

Available campaign-level actions:

- Duplicate
- Archive

### Archive

Archive removes the campaign record from the normal signed-off view while retaining it for retrieval.

It does not automatically archive CMS content or DAM assets.

This differs from the Jira Won't do flow, which can explicitly archive generated CMS content.

## Duplicate campaign

Duplicate opens a modal.

### Content

Content is always duplicated.

User specifies:

- CMS destination folder name
- CMS destination location

System:

- copies all content items
- creates new unique IDs
- preserves human-readable names
- recreates internal references between the new copies
- places copied graph in the selected CMS folder

### Assets

Asset duplication is optional.

If assets are not duplicated, copied content retains references to existing DAM assets.

If selected, user specifies:

- DAM destination folder name
- DAM destination location

System copies campaign assets and rewires copied content to the new asset IDs.

There is **no replace-assets workflow** in this POC.

## Canonical POC data

Default active campaigns:

- Autumn Trail — Needs attention
- Black Friday — Needs review
- Winter Running — Needs review

Historical signed-off campaigns:

- Summer Trail
- Spring Reset
- Winter Essentials
- Holiday Gifting

Assembling remains a valid product state even if no campaign uses it in the canonical seed.

Failing a review:

- requires a comment against an affected item
- changes campaign to Needs attention
- surfaces the resulting intervention in Attention

Passing review:

- changes campaign to Signed off

## Demo-only controls

The prototype includes controls visually separate from the product.

### Reset demo

Restore the complete canonical state, including:

- campaign statuses
- review comments
- workflow states
- POI/transcode states
- linked/unlinked states
- folders
- graph relationships
- archive state
- duplicates
- ignored recommendations and waivers

Demo controls must be clearly identifiable as prototype tooling.

## Out of scope

Do not build:

- chatbot
- prompt-first campaign generator
- replacement CMS or DAM
- detailed content editor
- detailed asset editor
- publishing workflow
- scheduling automation
- legal/multi-stage approvals
- asset replacement during duplication
- real Jira/CMS/DAM integrations
- backend persistence
- analytics dashboard
- decorative AI effects

The first POC proves the control-layer interaction and workflow.
