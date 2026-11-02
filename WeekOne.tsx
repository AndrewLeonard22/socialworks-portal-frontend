"use client";

import { useEffect, useRef, useState } from "react";
import { DP_PRESETS, fmtNum, NETS, TOP_POSTS } from "../data";
import { V2Brand, V2Icon } from "../icons";
import { POST_IMG } from "../media";
import type { V2Range } from "../pops/DatePop";

const isUrl = (v?: string) => /\S+\.\S+/.test(v || "");

export function V2WeekCard({
  kind,
  eye,
  title,
  icon,
  label,
  val,
  foot,
  btn,
  onClick,
}: {
  kind: string;
  eye: string;
  title: string;
  icon: string;
  label: string;
  val: string;
  foot: string;
  btn: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`tcard ${kind}`}
      role={onClick ? "link" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick ? (e) => e.key === "Enter" && onClick() : undefined
      }
    >
      <div className="hd">
        <div>
          <div className="eyebrow">{eye}</div>
          <h3>{title}</h3>
        </div>
        <span className="go" aria-hidden="true">
          <span className="gi">
            <V2Icon name={icon} />
          </span>
          <span className="ga">
            <V2Icon name="arrowUR" />
          </span>
        </span>
      </div>
      <div className="vals">
        <div>
          <small>{label}</small>
          <strong className="num">{val}</strong>
        </div>
      </div>
      <div className="pattern" />
      <div className="ft">
        <span>{foot}</span>
        <button type="button" className="tbtn">
          {btn}
        </button>
      </div>
    </div>
  );
}

/* week-one dashboard: syncing hero, 2 gradient cards, Networks/Top posts tabs,
   company card, coming-up and for-you side cards */
export function V2WeekOne({
  userName,
  company,
  slot,
  range,
  onPeriodClick,
  onAction,
  onEditCompany,
}: {
  userName: string;
  company: { name: string; site: string; logo: string | null; social: Record<string, string> };
  slot?: string | null;
  range: V2Range | null;
  onPeriodClick: (el: HTMLElement) => void;
  onAction?: (a: string) => void;
  onEditCompany: () => void;
}) {
  const [tab, setTab] = useState<"net" | "posts">("net");
  const [syncPct, setSyncPct] = useState(64);
  const dateBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const t = setInterval(
      () => setSyncPct((p) => (p < 96 ? p + 1 : p)),
      4000
    );
    return () => clearInterval(t);
  }, []);

  const days = Math.max(
    1,
    range?.start && range?.end
      ? Math.round((+range.end - +range.start) / 86400000) + 1
      : 30
  );
  const f = days / 30;
  const visits = 2458 * f;
  const open = Math.max(3, Math.round(24 * f));
  const periodLabel =
    DP_PRESETS.find((x) => x[0] === range?.key)?.[1] ??
    `${range?.start?.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${range?.end?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  const nets = ["instagram", "facebook", "linkedin", "google"].filter((k) =>
    isUrl(company.social[k])
  );

  return (
    <>
      <div className="w-main d-e">
        <div className="greet">
          <h1>
            Good morning, {userName.split(" ")[0]}!<span>Here&apos;s your first week.</span>
          </h1>
          <button
            type="button"
            className="pill"
            ref={dateBtn}
            aria-haspopup="dialog"
            onClick={() => dateBtn.current && onPeriodClick(dateBtn.current)}
          >
            <V2Icon name="calendar" size={16} />
            <span className="period-lbl">{periodLabel}</span>
          </button>
        </div>
        <div className="progress hero">
          <div className="score">
            <div className="big num">
              {syncPct}
              <span>%</span>
            </div>
            <div>
              <h2>
                We&apos;re <b>syncing your data</b>
              </h2>
              <p>Meanwhile, here&apos;s how your social media is doing</p>
            </div>
            <button
              type="button"
              className="cta cur-cta"
              onClick={() => onAction?.("msg")}
            >
              Message strategist{" "}
              <span className="ar">
                <V2Icon name="arrowR" size={16} />
              </span>
            </button>
          </div>
        </div>
        <div className="cards">
          <V2WeekCard
            kind="green"
            eye="Top source"
            title="Instagram"
            icon="image"
            label="Website visits"
            val={fmtNum(visits * 0.52)}
            foot="52% of your visits from social"
            btn="See insights"
          />
          <V2WeekCard
            kind="violet"
            eye="Best post"
            title={TOP_POSTS[0][0]}
            icon="play"
            label="Engagement"
            val={`${TOP_POSTS[0][4]}%`}
            foot="2.4x your average engagement"
            btn="View post"
          />
        </div>
        <div className="tabwrap">
          <div className="tabs" role="tablist">
            <button
              className="tab"
              role="tab"
              aria-selected={tab === "net"}
              onClick={() => setTab("net")}
            >
              Networks
            </button>
            <button
              className="tab"
              role="tab"
              aria-selected={tab === "posts"}
              onClick={() => setTab("posts")}
            >
              Top posts
            </button>
          </div>
        </div>
        {tab === "net" ? (
          <div>
            {NETS.map(([k, n, , er, sh, note]) => (
              <div className="row" key={k}>
                <span className="ic">
                  <V2Brand name={k} />
                </span>
                <div className="tx">
                  <b>{n}</b>
                  <span>
                    {note}
                    {er ? ` · ${er.toFixed(1)}% engagement` : ""}
                  </span>
                </div>
                <span className="time num">{fmtNum(visits * sh)} visits</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="pgrid">
            {TOP_POSTS.map(([t, net, type, date, er, im], i) => (
              <a
                href="#"
                key={i}
                className={`pc${i === TOP_POSTS.length - 1 ? " weak" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  onAction?.("post");
                }}
              >
                <span className="pc-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={POST_IMG[im]}
                    alt=""
                    style={{
                      objectPosition: ["50% 40%", "50% 30%", "40% 50%", "70% 70%"][i],
                    }}
                  />
                  <i className="pc-net">
                    <V2Brand name={net} />
                  </i>
                  {type === "Reel" && (
                    <i className="pc-play">
                      <V2Icon name="play" />
                    </i>
                  )}
                  <span className="pc-er">
                    <b className="num">{er}%</b>
                    <small>engagement</small>
                  </span>
                </span>
                <b className="pc-t">{t}</b>
                <small>
                  {type} · {date}
                </small>
              </a>
            ))}
          </div>
        )}
      </div>
      <aside className="w-side d-e">
        <div className="card">
          <div className="chd">
            <span className={`w-logo${company.logo ? "" : " ph"}`}>
              {company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logo} alt="" />
              ) : (
                <V2Icon name="building" />
              )}
            </span>
            <div className="grow">
              <h3>{company.name || "Your company"}</h3>
              <p>{company.site || "Add your website"}</p>
            </div>
            <button type="button" className="pill w-edit" onClick={onEditCompany}>
              <V2Icon name="pencil" size={14} />
              Edit
            </button>
          </div>
          <ul className="ul-list">
            <li>
              <V2Icon name="user" />
              <span>Social profiles</span>
              <em className="w-soc">
                {nets.length ? (
                  nets.map((k) => (
                    <a
                      key={k}
                      href={`https://${company.social[k].replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noopener"
                      data-tip={company.social[k]}
                      aria-label={NETS.find((n) => n[0] === k)?.[1]}
                    >
                      <V2Brand name={k} />
                    </a>
                  ))
                ) : (
                  <span className="w-none">None linked</span>
                )}
              </em>
            </li>
            <li
              data-tip={NETS.filter((n) => n[2])
                .map((n) => `${n[1]} ${n[2].toLocaleString("en-US")}`)
                .join(" · ")}
            >
              <V2Icon name="lineChart" />
              <span>Total audience</span>
              <em className="w-v">
                {NETS.reduce((a, n) => a + n[2], 0).toLocaleString("en-US")}
              </em>
            </li>
            <li>
              <V2Icon name="chart" />
              <span>Avg. engagement</span>
              <em className="w-v good">4.1%</em>
            </li>
            <li>
              <V2Icon name="calendar" />
              <span>Posts per week</span>
              <em className="w-v bad">
                {days < 14 ? "1.0" : days > 60 ? "1.4" : "1.2"}
              </em>
            </li>
          </ul>
        </div>
        <div className="card">
          <div className="ul-hd">
            <h3 className="ul-t">Coming up</h3>
          </div>
          <ul className="ul-list">
            <li>
              <V2Icon name="calendar" />
              <span>Launch call with TJ</span>
              <em className="w-v">
                {(slot || "Tue, Oct 21, 11:00 AM").replace(/, (\d)/, " · $1")}
              </em>
            </li>
            <li>
              <V2Icon name="megaphone" />
              <span>Ads go live</span>
              <em className="w-v">Thu, Oct 22</em>
            </li>
          </ul>
        </div>
        <div className="card">
          <div className="ul-hd">
            <h3 className="ul-t">For you</h3>
          </div>
          <ul className="ul-list w-todo">
            <li onClick={() => onAction?.("comments")}>
              <V2Icon name="mail" />
              <span>Reply to {open} comments</span>
              <em>
                <V2Icon name="arrowR" />
              </em>
            </li>
            <li onClick={() => onAction?.("plan")}>
              <V2Icon name="pencil" />
              <span>Post 3 times this week</span>
              <em>
                <V2Icon name="arrowR" />
              </em>
            </li>
            <li onClick={() => onAction?.("tiktok")}>
              <V2Icon name="plus" />
              <span>Connect TikTok</span>
              <em>
                <V2Icon name="arrowR" />
              </em>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
