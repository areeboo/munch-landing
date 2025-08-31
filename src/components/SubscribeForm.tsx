"use client";
import { useEffect, useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"loading"|"ok"|"err">("idle");

  // Autofill helpers: prefill from URL or localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get("email");
      const fromStorage = localStorage.getItem("munch_sub") || "";
      const initial = (fromQuery || fromStorage || "").trim();
      if (initial) setEmail(initial);
    } catch {}
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    // Build passive analytics/context
    const nowISO = new Date().toISOString();
    const params = new URLSearchParams(window.location.search);

    function parseUtm(params: URLSearchParams) {
      const keys = [
        "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
        "aff", "affiliate", "aff_id", "affiliate_id", "ref", "ref_id", "referrer_id",
        "cid", "campaign", "campaign_id", "adgroup", "adset", "creative", "placement"
      ] as const;
      const out: Record<string, string> = {};
      for (const k of keys) {
        const v = params.get(k);
        if (v) out[k] = v;
      }
      const gclid = params.get("gclid");
      const fbclid = params.get("fbclid");
      const msclkid = params.get("msclkid");
      if (gclid) out.gclid = gclid;
      if (fbclid) out.fbclid = fbclid;
      if (msclkid) out.msclkid = msclkid;
      return out;
    }

    function getUtmString() {
      // Prefer last session UTM, fall back to current URL, then first UTM
      let utmStr = "";
      try {
        const last = sessionStorage.getItem("munch_last_utm");
        if (last) {
          const obj = JSON.parse(last);
          if (obj?.utm && typeof obj.utm === 'object') {
            utmStr = new URLSearchParams(obj.utm).toString();
          }
        }
        if (!utmStr) {
          const utm = parseUtm(params);
          if (Object.keys(utm).length > 0) utmStr = new URLSearchParams(utm).toString();
        }
        if (!utmStr) {
          const first = localStorage.getItem("munch_first_utm");
          if (first) {
            const obj = JSON.parse(first);
            if (obj?.utm && typeof obj.utm === 'object') {
              utmStr = new URLSearchParams(obj.utm).toString();
            }
          }
        }
      } catch {}
      // Truncate to 200 chars to match server constraint
      return utmStr.slice(0, 200);
    }

    function detectDeviceType() {
      const ua = navigator.userAgent || "";
      const w = window.innerWidth || 0;
      if (/Mobi|Android/i.test(ua) || w < 768) return "mobile";
      if (w < 1024) return "tablet";
      return "desktop";
    }

    function parseBrowserOS() {
      const ua = navigator.userAgent || "";
      // Very lightweight parsing
      let browser = "unknown";
      if (/Edg\//.test(ua)) browser = "Edge";
      else if (/OPR\//.test(ua)) browser = "Opera";
      else if (/Chrome\//.test(ua)) browser = "Chrome";
      else if (/Safari\//.test(ua) && /Version\//.test(ua)) browser = "Safari";
      else if (/Firefox\//.test(ua)) browser = "Firefox";

      let os = "unknown";
      if (/Windows NT/.test(ua)) os = "Windows";
      else if (/Mac OS X/.test(ua)) os = "macOS";
      else if (/Android/.test(ua)) os = "Android";
      else if (/(iPhone|iPad|iPod)/.test(ua)) os = "iOS";
      else if (/Linux/.test(ua)) os = "Linux";
      return { browser, os };
    }

    function collectClientContext() {
      const nav = navigator as any;
      const conn = (nav.connection || nav.mozConnection || nav.webkitConnection || null) as any;
      const screenObj = window.screen || ({} as any);
      const viewport = { width: window.innerWidth || 0, height: window.innerHeight || 0 };
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "");
      const tzOffset = -new Date().getTimezoneOffset();
      const { browser, os } = parseBrowserOS();
      const deviceType = detectDeviceType();
      let pathHistory: Array<{ path: string; ts: string }> = [];
      try {
        const raw = sessionStorage.getItem("munch_path_history");
        if (raw) pathHistory = JSON.parse(raw);
      } catch {}
      const sessionStart = sessionStorage.getItem('munch_session_start');
      const pageViews = parseInt(sessionStorage.getItem('munch_pageviews') || '0', 10) || 0;
      const sessionDurationMs = sessionStart ? (Date.now() - Date.parse(sessionStart)) : 0;
      const adBlock = localStorage.getItem('munch_adblock') === '1' ? true : (localStorage.getItem('munch_adblock') === '0' ? false : null);
      const firstTouch = {
        ts: localStorage.getItem("munch_first_ts") || null,
        url: localStorage.getItem("munch_first_url") || null,
        referrer: localStorage.getItem("munch_first_ref") || null,
        utm: (() => { try { return JSON.parse(localStorage.getItem("munch_first_utm") || "null"); } catch { return null; } })(),
      };
      const lastTouch = {
        ts: nowISO,
        url: window.location.href,
        utm: (() => { try { const l = sessionStorage.getItem("munch_last_utm"); return l ? JSON.parse(l) : null; } catch { return null; } })(),
      };
      const sid = localStorage.getItem("munch_sid") || null;
      return {
        client: {
          deviceType,
          browser,
          os,
          timeZone: tz,
          tzOffset,
          languages: navigator.languages || (navigator.language ? [navigator.language] : []),
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          dnt: (navigator as any).doNotTrack || (window as any).doNotTrack || null,
          screen: { width: screenObj.width || 0, height: screenObj.height || 0, pixelRatio: window.devicePixelRatio || 1 },
          viewport,
          deviceMemory: nav.deviceMemory || null,
          hardwareConcurrency: nav.hardwareConcurrency || null,
          connection: conn ? {
            effectiveType: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
            saveData: conn.saveData,
          } : null,
          sessionId: sid,
          session: {
            startTs: sessionStart,
            durationMs: sessionDurationMs,
            pageViews
          },
          pathHistory,
          firstTouch,
          lastTouch,
          referrer: document.referrer || null,
          adBlock,
          gclid: params.get("gclid"),
          fbclid: params.get("fbclid"),
          msclkid: params.get("msclkid"),
        }
      } as any;
    }

    const payload: any = {
      email,
      utm: getUtmString(),
      source: "landing",
      context: collectClientContext(),
    };

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const em = email.trim().toLowerCase();
      localStorage.setItem("munch_sub", em);
      await fetch("/api/subscribe/verify-subscriber", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em }), cache: "no-store",
      });
      window.location.href = "/thank-you";
    } else {
      setState("err");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2" autoComplete="on">
      <label htmlFor="email" className="sr-only">Email</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        id="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        autoFocus
        enterKeyHint="send"
        className="input input-bordered"
      />
      <button className="btn btn-primary" disabled={state==="loading"} aria-disabled={state==="loading"}>
        {state==="loading" ? "Subscribing…" : "Subscribe"}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === "loading" ? "Submitting" : state === "ok" ? "Success" : state === "err" ? "Error" : "Idle"}
      </span>
      {state==="ok" && <span className="text-success" role="status" aria-live="polite">You're in.</span>}
      {state==="err" && <span className="text-error" role="alert">Try again.</span>}
    </form>
  );
}
