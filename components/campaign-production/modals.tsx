import { Modal, Checkbox } from "@mantine/core";
import { useState } from "react";
import type { Campaign } from "@/data/campaigns";

export function FailReviewModal({
  opened,
  campaign,
  onClose,
  onConfirm,
}: {
  opened: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onConfirm: (targetId: string, comment: string) => void;
}) {
  const [targetId, setTargetId] = useState("");
  const [comment, setComment] = useState("");

  const options = [
    ...(campaign?.content.map((item) => ({
      id: item.id,
      label: `${item.name} (${item.contentType})`,
    })) ?? []),
    ...(campaign?.assets.map((asset) => ({
      id: asset.id,
      label: `${asset.filename} (Asset)`,
    })) ?? []),
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Fail review"
      centered
      radius="xs"
      shadow="sm"
    >
      <div className="cp-modal-stack">
        <p className="cp-meta">
          Select the affected object and add a comment. The campaign will move to
          Needs attention and the item will appear in Attention.
        </p>
        <div className="cp-field">
          <label htmlFor="fail-target">Affected object</label>
          <select
            id="fail-target"
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
          >
            <option value="">Select an object</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="cp-field">
          <label htmlFor="fail-comment">Comment</label>
          <textarea
            id="fail-comment"
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Describe what needs to change"
          />
        </div>
        <div className="cp-inline-actions">
          <button type="button" className="cp-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="cp-button"
            data-variant="danger"
            disabled={!targetId || !comment.trim()}
            onClick={() => {
              onConfirm(targetId, comment.trim());
              setTargetId("");
              setComment("");
            }}
          >
            Fail review
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function DuplicateModal({
  opened,
  campaign,
  onClose,
  onConfirm,
}: {
  opened: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onConfirm: (options: {
    cmsFolderName: string;
    cmsLocation: string;
    duplicateAssets: boolean;
    damFolderName?: string;
    damLocation?: string;
  }) => void;
}) {
  const [cmsFolderName, setCmsFolderName] = useState(
    campaign ? `${campaign.name} copy` : "",
  );
  const [cmsLocation, setCmsLocation] = useState("Campaigns / 2026 / Copies");
  const [duplicateAssets, setDuplicateAssets] = useState(false);
  const [damFolderName, setDamFolderName] = useState(
    campaign ? `${campaign.name} assets` : "",
  );
  const [damLocation, setDamLocation] = useState(
    "Campaign Photography / 2026 / Copies",
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Duplicate campaign"
      centered
      radius="xs"
      shadow="sm"
      size="lg"
    >
      <div className="cp-modal-stack">
        <p className="cp-meta">
          Content is always duplicated. Copied items get new unique IDs, keep
          human-readable names, and recreate internal relationships between the
          copies.
        </p>
        <div className="cp-field">
          <label htmlFor="cms-folder-name">CMS destination folder name</label>
          <input
            id="cms-folder-name"
            value={cmsFolderName}
            onChange={(event) => setCmsFolderName(event.target.value)}
          />
        </div>
        <div className="cp-field">
          <label htmlFor="cms-location">CMS destination location</label>
          <input
            id="cms-location"
            value={cmsLocation}
            onChange={(event) => setCmsLocation(event.target.value)}
          />
        </div>
        <Checkbox
          checked={duplicateAssets}
          onChange={(event) => setDuplicateAssets(event.currentTarget.checked)}
          label="Duplicate campaign assets"
        />
        {duplicateAssets ? (
          <>
            <div className="cp-field">
              <label htmlFor="dam-folder-name">DAM destination folder name</label>
              <input
                id="dam-folder-name"
                value={damFolderName}
                onChange={(event) => setDamFolderName(event.target.value)}
              />
            </div>
            <div className="cp-field">
              <label htmlFor="dam-location">DAM destination location</label>
              <input
                id="dam-location"
                value={damLocation}
                onChange={(event) => setDamLocation(event.target.value)}
              />
            </div>
          </>
        ) : (
          <p className="cp-help">
            If assets are not duplicated, copied content continues to reference
            the existing assets.
          </p>
        )}
        <div className="cp-inline-actions">
          <button type="button" className="cp-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="cp-button"
            data-variant="primary"
            disabled={!cmsFolderName.trim() || !cmsLocation.trim()}
            onClick={() =>
              onConfirm({
                cmsFolderName: cmsFolderName.trim(),
                cmsLocation: cmsLocation.trim(),
                duplicateAssets,
                damFolderName: damFolderName.trim(),
                damLocation: damLocation.trim(),
              })
            }
          >
            Duplicate
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ArchiveModal({
  opened,
  campaign,
  onClose,
  onConfirm,
}: {
  opened: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Archive campaign"
      centered
      radius="xs"
      shadow="sm"
    >
      <div className="cp-modal-stack">
        <p>
          Archive <strong>{campaign?.name}</strong> in Campaign Production local
          state? Underlying CMS and DAM objects are not archived by this action.
        </p>
        <div className="cp-inline-actions">
          <button type="button" className="cp-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="cp-button"
            data-variant="danger"
            onClick={onConfirm}
          >
            Archive
          </button>
        </div>
      </div>
    </Modal>
  );
}
