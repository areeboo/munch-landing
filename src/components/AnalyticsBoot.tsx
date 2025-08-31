"use client";
import { useEffect } from "react";

// Utility: safe JSON parse
function safeParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

// Store cookie (session or long-lived)
function setCookie(name: string, value: string, days = 365) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  } catch {}
}

// Read cookie by name
function getCookie(name: string): string | null {
  try {
    const nameEQ = name + "=";
    const parts = document.cookie.split("; ");
    for (const p of parts) {
      if (p.startsWith(nameEQ)) return decodeURIComponent(p.substring(nameEQ.length));
    }
  } catch {}
  return null;
}

function parseUtm(params: URLSearchParams) {
  const keys = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    // broader campaign/affiliate keys
    "aff", "affiliate", "aff_id", "affiliate_id", "ref", "ref_id", "referrer_id",
    "cid", "campaign", "campaign_id", "adgroup", "adset", "creative", "placement"
  ];
  const out: Record<string, string> = {};
  let any = false;
  for (const k of keys) {
    const v = params.get(k);
    if (v) { out[k] = v; any = true; }
  }
  const gclid = params.get("gclid");
  const fbclid = params.get("fbclid");
  const msclkid = params.get("msclkid");
  if (gclid) { out.gclid = gclid; any = true; }
  if (fbclid) { out.fbclid = fbclid; any = true; }
  if (msclkid) { out.msclkid = msclkid; any = true; }
  return any ? out : null;
}

function detectAdBlockViaBait(): boolean | null {
  try {
    const bait = document.createElement('div');
    bait.className = 'adsbox ads banner ad-unit ad-container advertising';
    bait.style.position = 'absolute';
    bait.style.left = '-999px';
    bait.style.height = '10px';
    document.body.appendChild(bait);
    const blocked = getComputedStyle(bait).display === 'none' || bait.clientHeight === 0;
    bait.remove();
    return !!blocked;
  } catch { return null; }
}

export default function AnalyticsBoot() {
  useEffect(() => {
    try {
      const nowISO = new Date().toISOString();
      const url = new URL(window.location.href);
      const params = url.searchParams;

      // Ensure a persistent visitor/session id
      let sid = localStorage.getItem("munch_sid");
      if (!sid) {
        sid = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
        localStorage.setItem("munch_sid", sid);
      }

      // First touch info (persisted)
      if (!localStorage.getItem("munch_first_ts")) {
        localStorage.setItem("munch_first_ts", nowISO);
        localStorage.setItem("munch_first_url", url.toString());
        localStorage.setItem("munch_first_ref", document.referrer || "");
      }

      // Also set first-touch cookies if not present (middleware also handles this server-side)
      if (!getCookie("munch_first_visit")) setCookie("munch_first_visit", nowISO, 365);
      if (!getCookie("munch_first_url")) setCookie("munch_first_url", url.toString(), 365);
      if (!getCookie("munch_referrer")) setCookie("munch_referrer", document.referrer || "", 365);

      // UTM capture
      const utm = parseUtm(params);
      if (utm) {
        sessionStorage.setItem("munch_last_utm", JSON.stringify({ ts: nowISO, url: url.toString(), utm }));
        if (!localStorage.getItem("munch_first_utm")) {
          localStorage.setItem("munch_first_utm", JSON.stringify({ ts: nowISO, url: url.toString(), utm }));
        }
        // cookie copy for server-side access
        setCookie("munch_last_utm", JSON.stringify(utm), 30);
        if (!getCookie("munch_first_utm")) setCookie("munch_first_utm", JSON.stringify(utm), 365);
      }

      // Track simple path history for this session
      const key = "munch_path_history";
      const history = safeParse<Array<{ path: string; ts: string }>>(sessionStorage.getItem(key), []);
      const path = window.location.pathname + (window.location.search || "");
      if (history.length === 0 || history[history.length - 1]?.path !== path) {
        history.push({ path, ts: nowISO });
      }
      // Cap size to 50
      const capped = history.slice(-50);
      sessionStorage.setItem(key, JSON.stringify(capped));

      // Session counters
      if (!sessionStorage.getItem('munch_session_start')) {
        sessionStorage.setItem('munch_session_start', nowISO);
      }
      const pv = parseInt(sessionStorage.getItem('munch_pageviews') || '0', 10) || 0;
      sessionStorage.setItem('munch_pageviews', String(pv + 1));

      // Ad blocker detection (best-effort)
      const adblk = detectAdBlockViaBait();
      if (adblk !== null) {
        localStorage.setItem('munch_adblock', adblk ? '1' : '0');
      }

      // Expose minimal diagnostics (non-sensitive) for debugging
      (window as any).__munch = {
        sid,
        first: {
          ts: localStorage.getItem("munch_first_ts"),
          url: localStorage.getItem("munch_first_url"),
          ref: localStorage.getItem("munch_first_ref"),
          utm: safeParse(localStorage.getItem("munch_first_utm"), null)
        },
        lastUtm: safeParse(sessionStorage.getItem("munch_last_utm"), null),
        history: capped,
        adBlock: localStorage.getItem('munch_adblock') === '1',
      };
    } catch {}
  }, []);

  return null;
}
