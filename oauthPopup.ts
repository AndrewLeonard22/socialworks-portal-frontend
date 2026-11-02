/**
 * OAuth / provider connect windows. Browsers treat window.open("_blank")
 * without chrome features as a new tab; width/height (+ popup=yes) forces
 * a real popup window instead.
 */
const OAUTH_POPUP_FEATURES = [
  "popup=yes",
  "width=600",
  "height=720",
  "left=120",
  "top=80",
  "menubar=no",
  "toolbar=no",
  "location=yes",
  "status=no",
  "scrollbars=yes",
  "resizable=yes",
].join(",");

/**
 * Open a blank OAuth popup synchronously. Must run inside the click
 * handler before any await — after a fetch, user activation is gone and
 * the browser blocks the popup.
 *
 * Do not pass "noopener" in features: that makes window.open return null
 * so we cannot navigate the popup after the authorize URL arrives.
 */
export function openOAuthPopup(name = "sw_oauth"): Window | null {
  const popup = window.open("", name, OAUTH_POPUP_FEATURES);
  if (popup) {
    try {
      popup.opener = null;
    } catch {
      // sealed / cross-origin — ignore
    }
  }
  return popup;
}

/** Point an opened popup at the authorize URL, or fall back to same-tab. */
export function navigateOAuthPopup(popup: Window | null, url: string): void {
  if (popup && !popup.closed) {
    popup.location.href = url;
    popup.focus();
    return;
  }
  window.location.assign(url);
}

/** One-shot open when the URL is already known (still from a click). */
export function openOAuthUrl(url: string, name = "sw_oauth"): Window | null {
  const popup = window.open(url, name, OAUTH_POPUP_FEATURES);
  if (popup) {
    try {
      popup.opener = null;
    } catch {
      // sealed / cross-origin — ignore
    }
    popup.focus();
  }
  return popup;
}

/**
 * Popup -> opener result channel. window.opener is deliberately sealed
 * in openOAuthPopup, so the result travels over a same-origin
 * BroadcastChannel instead. window.name survives the cross-origin hop
 * back from the provider, so it is the reliable "I am an OAuth popup"
 * signal.
 */
const OAUTH_CHANNEL = "sw_oauth";
const OAUTH_RESULT_TYPE = "sw_oauth_result";

export interface OAuthResult {
  /** Provider key that finished connecting (e.g. "meta"). */
  provider?: string;
  /** Provider-supplied or callback error code. */
  error?: string;
}

/** True inside a window opened by openOAuthPopup / openOAuthUrl. */
export function isOAuthPopup(): boolean {
  return typeof window !== "undefined" && window.name.startsWith(OAUTH_CHANNEL);
}

/**
 * Popup side: broadcast the outcome to every same-origin context, then
 * close. window.close only works on script-opened windows, so callers
 * should keep rendering a "you can close this" fallback behind it.
 */
export function finishOAuthPopup(result: OAuthResult): void {
  try {
    new BroadcastChannel(OAUTH_CHANNEL).postMessage({
      type: OAUTH_RESULT_TYPE,
      ...result,
    });
  } catch {
    // BroadcastChannel unsupported - the window still closes below.
  }
  window.close();
}

/** Opener side: subscribe to popup results. Returns an unsubscribe. */
export function onOAuthResult(
  cb: (result: OAuthResult) => void
): () => void {
  if (typeof BroadcastChannel === "undefined") return () => {};
  const channel = new BroadcastChannel(OAUTH_CHANNEL);
  channel.onmessage = (event) => {
    const data = event.data as { type?: string } & OAuthResult;
    if (data?.type === OAUTH_RESULT_TYPE) cb(data);
  };
  return () => channel.close();
}
