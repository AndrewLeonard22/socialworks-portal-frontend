"use client";

import { ChangeEvent, useRef, useState } from "react";
import { fmtSize } from "../data";
import { V2Icon } from "../icons";
import type { V2AssetFile, V2Profile } from "../types";

const AV_TABS: [string, string][] = [
  ["images", "Photos"],
  ["video", "Videos"],
];

/* Assets page: media grid by type, add/replace/remove per file, bulk select
   bar, and the same company card (logo + drop area) as onboarding */
export function V2AssetsView({
  profile,
  onProfileChange,
  onToast,
}: {
  profile: V2Profile;
  onProfileChange: (p: Partial<V2Profile>) => void;
  onToast?: (msg: string, icon?: string) => void;
}) {
  const [tab, setTab] = useState<string>("images");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [repAt, setRepAt] = useState<{ k: string; i: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const repRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const kindRef = useRef<string>("images");

  const A = profile.assets;
  const counts = { images: A.images.length, video: A.video.length };

  const pick = (k: string) => {
    kindRef.current = k;
    if (fileRef.current) {
      fileRef.current.accept = k === "video" ? "video/*" : "image/*";
      fileRef.current.click();
    }
  };

  const addFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const k = kindRef.current as "images" | "video";
    const files = [...(e.target.files ?? [])].map((f) => ({
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
    }));
    e.target.value = "";
    if (files.length) {
      onProfileChange({ assets: { ...A, [k]: [...A[k], ...files] } });
      onToast?.(`${files.length} file${files.length > 1 ? "s" : ""} added`);
    }
  };

  const repFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f || !repAt) return;
    const k = repAt.k as "images" | "video";
    const next = [...A[k]];
    if (next[repAt.i]?.url) URL.revokeObjectURL(next[repAt.i].url!);
    next[repAt.i] = { name: f.name, size: f.size, url: URL.createObjectURL(f) };
    onProfileChange({ assets: { ...A, [k]: next } });
    setRepAt(null);
    onToast?.(`${f.name} replaced`, "swap");
  };

  const remove = (k: string, i: number) => {
    const key = k as "images" | "video";
    const next = [...A[key]];
    const [rm] = next.splice(i, 1);
    if (rm?.url) URL.revokeObjectURL(rm.url);
    onProfileChange({ assets: { ...A, [key]: next } });
    setSel(new Set());
    onToast?.("Removed", "trash");
  };

  const delSel = () => {
    const by: Record<string, number[]> = {};
    sel.forEach((k) => {
      const [t, i] = k.split(":");
      (by[t] = by[t] || []).push(+i);
    });
    const assets = { ...A };
    let n = 0;
    Object.entries(by).forEach(([t, ix]) => {
      const key = t as "images" | "video";
      const list = [...assets[key]];
      ix.sort((a, b) => b - a).forEach((i) => {
        const [rm] = list.splice(i, 1);
        if (rm?.url) URL.revokeObjectURL(rm.url);
        n++;
      });
      assets[key] = list;
    });
    onProfileChange({ assets });
    setSel(new Set());
    onToast?.(`${n} file${n > 1 ? "s" : ""} deleted`, "trash");
  };

  const item = (k: "images" | "video", f: V2AssetFile, i: number) => {
    const key = `${k}:${i}`;
    const on = sel.has(key);
    return (
      <div className={`av-it${on ? " sel" : ""}`} key={key}>
        <span className="av-th">
          {k === "video" ? (
            <>
              <video src={f.url} muted loop playsInline preload="metadata" />
              <i className="av-play">
                <V2Icon name="play" />
              </i>
            </>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.url} alt="" />
          )}
          <button
            type="button"
            className={`av-ck${on ? " on" : ""}`}
            role="checkbox"
            aria-checked={on}
            aria-label="Select"
            onClick={() =>
              setSel((s) => {
                const ns = new Set(s);
                if (ns.has(key)) ns.delete(key);
                else ns.add(key);
                return ns;
              })
            }
          >
            <V2Icon name="check" size={14} />
          </button>
          <span className="av-acts">
            <button
              type="button"
              className="av-ib"
              aria-label="Replace"
              data-tip="Replace"
              onClick={() => {
                setRepAt({ k, i });
                if (repRef.current) {
                  repRef.current.accept = k === "video" ? "video/*" : "image/*";
                  repRef.current.click();
                }
              }}
            >
              <V2Icon name="swap" />
            </button>
            <button
              type="button"
              className="av-ib"
              aria-label="Remove"
              data-tip="Remove"
              onClick={() => remove(k, i)}
            >
              <V2Icon name="trash" />
            </button>
          </span>
        </span>
        <b>{f.name}</b>
        <small>{fmtSize(f.size || 0)}</small>
      </div>
    );
  };

  const sections = AV_TABS.filter(([k]) => tab === "all" || k === tab);
  const selectable = AV_TABS.filter(([k]) => tab === "all" || k === tab).flatMap(
    ([k]) => A[k as "images"].map((_, i) => `${k}:${i}`)
  );

  return (
    <section className="dash av" style={{ position: "static" }}>
      <div className="av-main">
        <div className="greet">
          <h1>
            Brand assets<span>Everything we create with.</span>
          </h1>
        </div>
        <div className="tabwrap">
          <div className="tabs" role="tablist">
            {AV_TABS.map(([k, l]) => (
              <button
                key={k}
                className="tab"
                role="tab"
                aria-selected={tab === k}
                onClick={() => {
                  setTab(k);
                  setSel(new Set());
                }}
              >
                {l} <span className="count num">{counts[k as "images"]}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          {sections.map(([k, l]) => (
            <section className="av-sec" key={k}>
              {tab === "all" && (
                <div className="av-hd">
                  <h3>{l}</h3>
                  <button
                    type="button"
                    className="av-more"
                    onClick={() => setTab(k)}
                  >
                    See all
                  </button>
                </div>
              )}
              <div className="av-grid">
                <button
                  type="button"
                  className="av-add"
                  onClick={() => pick(k)}
                >
                  <V2Icon name="plus" />
                  {k === "video" ? "Add videos" : "Add photos"}
                </button>
                {(A[k as "images"] as V2AssetFile[]).map((f, i) =>
                  item(k as "images", f, i)
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
      <aside className="av-side">
        <div className="card profile av-co">
          <div className="prof-top">
            <button
              type="button"
              className={`logo-slot${profile.logo ? " filled" : ""}`}
              aria-label={profile.logo ? "Replace logo" : "Add logo"}
              data-tip={profile.logo ? "Replace logo" : undefined}
              onClick={() => logoRef.current?.click()}
            >
              {profile.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.logo.url} alt="" />
              ) : (
                <span className="ls-ph">
                  <V2Icon name="logoMark" />
                </span>
              )}
              <span className="ls-up">
                <V2Icon name={profile.logo ? "swap" : "plus"} size={14} />
              </span>
            </button>
            <h3 className="av-co-n">{profile.name || "Your company"}</h3>
            {profile.site && <p className="av-co-s">{profile.site}</p>}
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
              const files = [...e.dataTransfer.files];
              const images = files.filter((f) => /^image\//.test(f.type));
              const video = files.filter((f) => /^video\//.test(f.type));
              onProfileChange({
                assets: {
                  ...A,
                  images: [
                    ...A.images,
                    ...images.map((f) => ({
                      name: f.name,
                      size: f.size,
                      url: URL.createObjectURL(f),
                    })),
                  ],
                  video: [
                    ...A.video,
                    ...video.map((f) => ({
                      name: f.name,
                      size: f.size,
                      url: URL.createObjectURL(f),
                    })),
                  ],
                },
              });
            }}
          >
            <span className="av-drop-ic">
              <V2Icon name="upload" />
            </span>
            <b>Drop files here</b>
            <small>Job photos and videos · JPG, PNG, HEIC or MP4</small>
            <button type="button" className="obtn" onClick={() => pick("images")}>
              Browse Files
            </button>
          </div>
        </div>
      </aside>
      <input type="file" ref={fileRef} multiple hidden onChange={addFiles} />
      <input type="file" ref={repRef} hidden onChange={repFile} />
      <input
        type="file"
        ref={logoRef}
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f)
            onProfileChange({
              logo: { name: f.name, size: f.size, url: URL.createObjectURL(f) },
            });
        }}
      />
      <div
        className={`av-bulk${sel.size ? " on" : ""}`}
        role="toolbar"
        aria-label="Selected files"
      >
        {sel.size > 0 && (
          <>
            <i className="av-bhl" aria-hidden="true" />
            <b className="num">{sel.size} selected</b>
            <button
              type="button"
              onClick={() => setSel(new Set(selectable))}
            >
              Select all
            </button>
            <button type="button" onClick={() => setSel(new Set())}>
              Clear
            </button>
            <button type="button" className="av-bdel" onClick={delSel}>
              <V2Icon name="trash" size={16} />
              Delete
            </button>
          </>
        )}
      </div>
    </section>
  );
}
