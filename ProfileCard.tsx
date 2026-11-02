"use client";

import { ChangeEvent, useRef } from "react";
import { SOC } from "../data";
import { V2Brand, V2Icon } from "../icons";
import type { V2Profile } from "../types";

const isUrl = (v?: string) => /\S+\.\S+/.test(v || "");

function MediaDrop({
  assets,
  onBrowse,
  onSeeAll,
}: {
  assets: V2Profile["assets"];
  onBrowse: () => void;
  onSeeAll: () => void;
}) {
  const all = [
    ...assets.images.map((f) => ({ f, v: 0 })),
    ...assets.video.map((f) => ({ f, v: 1 })),
  ];
  const n = all.length;
  const peek = all.slice(0, 4);
  return (
    <>
      {n ? (
        <button
          type="button"
          className="lstack up-peek"
          aria-label={`See all ${n} files`}
          data-tip="See all media"
          onClick={onSeeAll}
        >
          {peek.map(({ f, v }, i) => (
            <i key={i}>
              {v ? (
                <video
                  src={`${f.url}#t=0.1`}
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt="" />
              )}
            </i>
          ))}
          {n > 4 && <i className="more num">+{n - 4}</i>}
        </button>
      ) : (
        <span className="av-drop-ic">
          <V2Icon name="upload" />
        </span>
      )}
      <b>{n ? `${n} file${n > 1 ? "s" : ""} added` : "Drop your photos and videos here"}</b>
      <small>Job photos and videos · JPG, PNG, HEIC or MP4</small>
      <button type="button" className="obtn" onClick={onBrowse}>
        {n ? "Add More" : "Browse Files"}
      </button>
    </>
  );
}

export function V2ProfileCard({
  profile,
  social,
  socOpen,
  onProfileChange,
  onSocialChange,
  onSocOpen,
  onSeeAllMedia,
  onLogoFile,
  onAssetFiles,
  onLogoRemove,
  editableName = true,
  pendingNames,
  soc = SOC,
  alwaysShowSite = false,
}: {
  profile: V2Profile;
  social: Record<string, string>;
  socOpen?: string | null;
  onProfileChange: (p: Partial<V2Profile>) => void;
  onSocialChange: (k: string, v: string | null) => void;
  onSocOpen: (k: string | null) => void;
  onSeeAllMedia: () => void;
  /** real mode: upload the picked logo instead of storing an object URL */
  onLogoFile?: (f: File) => void;
  /** real mode: upload dropped/picked asset files */
  onAssetFiles?: (files: File[]) => void;
  /** real mode: logo cannot be deleted server-side - pass null to hide the x */
  onLogoRemove?: (() => void) | null;
  editableName?: boolean;
  /** filenames currently uploading (shown under the drop zone) */
  pendingNames?: string[];
  /** [key, label, placeholder][] - real app uses the gbp key for Google */
  soc?: [string, string, string][];
  /** demo hides the website row until it has a value; real mode needs it visible */
  alwaysShowSite?: boolean;
}) {
  const logoInput = useRef<HTMLInputElement>(null);
  const assetsInput = useRef<HTMLInputElement>(null);
  const logoRemove = onLogoRemove === undefined
    ? () => onProfileChange({ logo: null })
    : onLogoRemove;

  const pickLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (onLogoFile) {
      onLogoFile(f);
      return;
    }
    onProfileChange({
      logo: { name: f.name, size: f.size, url: URL.createObjectURL(f) },
    });
  };

  const addFiles = (files: File[]) => {
    if (!files.length) return;
    if (onAssetFiles) {
      onAssetFiles(files);
      return;
    }
    const images = [
      ...profile.assets.images,
      ...files
        .filter((f) => /^image\//.test(f.type))
        .map((f) => ({ name: f.name, size: f.size, url: URL.createObjectURL(f) })),
    ];
    const video = [
      ...profile.assets.video,
      ...files
        .filter((f) => /^video\//.test(f.type))
        .map((f) => ({ name: f.name, size: f.size, url: URL.createObjectURL(f) })),
    ];
    onProfileChange({ assets: { ...profile.assets, images, video } });
  };

  const addAssets = (e: ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    addFiles(files);
  };

  return (
    <div className="card profile" id="profileCard">
      <div className="prof-top">
        <button
          className={`logo-slot${profile.logo ? " filled" : ""}`}
          type="button"
          aria-label={profile.logo ? "Replace logo" : "Upload logo"}
          onClick={() => logoInput.current?.click()}
        >
          {profile.logo ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.logo.url} alt="" />
              {logoRemove && (
                <span
                  className="ls-x"
                  role="button"
                  aria-label="Remove logo"
                  onClick={(e) => {
                    e.stopPropagation();
                    logoRemove();
                  }}
                >
                  <V2Icon name="x" size={12} />
                </span>
              )}
              <span className="ls-up">
                <V2Icon name="swap" size={14} />
              </span>
            </>
          ) : (
            <>
              <span className="ls-ph">
                <V2Icon name="logoMark" />
              </span>
              <span className="ls-up">
                <V2Icon name="plus" size={16} />
              </span>
            </>
          )}
        </button>
        {editableName ? (
          <label className="edit-row">
            <span className="sizer co-name" data-v={profile.name || "Enter company name"}>
              <input
                placeholder="Enter company name"
                aria-label="Company name"
                autoComplete="organization"
                size={1}
                value={profile.name}
                onChange={(e) => {
                  onProfileChange({ name: e.target.value });
                  e.currentTarget.parentElement!.dataset.v =
                    e.target.value || e.currentTarget.placeholder;
                }}
              />
            </span>
            <span className="pen pen-name">
              <V2Icon name="pencil" size={14} />
            </span>
          </label>
        ) : (
          <span className="co-name-txt">{profile.name || "Your company"}</span>
        )}
        <label className="edit-row" hidden={!alwaysShowSite && !profile.site.trim()}>
          <span className="sizer co-site" data-v={profile.site || "Add website link"}>
            <input
              placeholder="Add website link"
              aria-label="Website"
              autoComplete="url"
              size={1}
              value={profile.site}
              onChange={(e) => {
                onProfileChange({ site: e.target.value });
                e.currentTarget.parentElement!.dataset.v =
                  e.target.value || e.currentTarget.placeholder;
              }}
            />
          </span>
        </label>
        <input
          type="file"
          ref={logoInput}
          accept="image/png,image/svg+xml,image/jpeg,image/webp,.svg"
          hidden
          onChange={pickLogo}
        />
      </div>
      <div
        className="up-drop"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("drop");
        }}
        onDragLeave={(e) => e.currentTarget.classList.remove("drop")}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("drop");
          addFiles([...e.dataTransfer.files]);
        }}
      >
        <MediaDrop
          assets={profile.assets}
          onBrowse={() => assetsInput.current?.click()}
          onSeeAll={onSeeAllMedia}
        />
      </div>
      <input
        type="file"
        ref={assetsInput}
        multiple
        accept="image/*,video/*"
        hidden
        onChange={addAssets}
      />
      {pendingNames && pendingNames.length > 0 && (
        <ul className="up-pending">
          {pendingNames.map((name, i) => (
            <li key={`${name}-${i}`}>
              <V2Icon name="file" />
              <span>{name}</span>
              <em>Uploading...</em>
            </li>
          ))}
        </ul>
      )}
      <div className="soc-hd">
        <span className="lbl">Social profiles</span>
      </div>
      <div className="soc-row">
        {soc.map(([k, n]) => {
          const on = isUrl(social[k]);
          return (
            <button
              key={k}
              type="button"
              className={`soc${on ? " on" : ""}${socOpen === k ? " open" : ""}`}
              aria-label={on ? `${n} connected` : `Add ${n}`}
              aria-expanded={socOpen === k}
              onClick={() => onSocOpen(socOpen === k ? null : k)}
            >
              <V2Brand name={k} />
              {on ? (
                <i
                  role="button"
                  aria-label={`Disconnect ${n}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSocialChange(k, null);
                  }}
                >
                  <V2Icon name="x" size={12} />
                </i>
              ) : (
                <i>
                  <V2Icon name="plus" size={14} />
                </i>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
