/**
 * DocuSign opens in a new tab (iframes break on it), and its returnUrl
 * lands back on /onboarding?signed=1&event=<outcome> in THAT tab. The
 * tab is script-opened so window.close works; the outcome travels to
 * the onboarding tab over a same-origin BroadcastChannel.
 */
const SIGN_CHANNEL = "sw_esign";
const SIGN_RESULT_TYPE = "sw_esign_result";

export interface SignReturnResult {
  /** DocuSign event: signing_complete, cancel, decline,
   *  session_timeout, ttl_expired, exception, id_check_failed. */
  event: string;
}

/** Return-tab side: broadcast the outcome, then close this tab. */
export function reportSignReturn(result: SignReturnResult): void {
  try {
    new BroadcastChannel(SIGN_CHANNEL).postMessage({
      type: SIGN_RESULT_TYPE,
      ...result,
    });
  } catch {
    // BroadcastChannel unsupported - the tab still closes below.
  }
  window.close();
}

/** Onboarding-tab side: subscribe to return outcomes. */
export function onSignReturn(
  cb: (result: SignReturnResult) => void
): () => void {
  if (typeof BroadcastChannel === "undefined") return () => {};
  const channel = new BroadcastChannel(SIGN_CHANNEL);
  channel.onmessage = (event) => {
    const data = event.data as { type?: string } & SignReturnResult;
    if (data?.type === SIGN_RESULT_TYPE) cb(data);
  };
  return () => channel.close();
}
