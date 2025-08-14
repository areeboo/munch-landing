import dns from "node:dns/promises";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

let disposableSet: Set<string> | null = null;
async function loadDisposable(): Promise<Set<string>> {
  if (disposableSet) return disposableSet;
  const mod = await import("disposable-email-domains");
  const arr: string[] = (mod as any).default || (mod as any);
  disposableSet = new Set(arr.map((d) => String(d).toLowerCase()));
  return disposableSet!;
}

function domainOf(email: string) {
  return email.split("@")[1]?.toLowerCase() || "";
}

async function hasMx(domain: string, timeoutMs = 2500): Promise<boolean> {
  try {
    const res = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error("dns_timeout")), timeoutMs)
      ),
    ]);
    return Array.isArray(res) && res.length > 0;
  } catch {
    return false;
  }
}

export async function verifyFree(emailRaw: string) {
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { deliverable: false, result: "invalid_format", mx: false, disposable: false };
  }
  const dom = domainOf(email);
  const disp = (await loadDisposable()).has(dom);
  if (disp) {
    return { deliverable: false, result: "disposable_domain", mx: false, disposable: true };
  }
  const mx = await hasMx(dom);
  if (!mx) {
    return { deliverable: false, result: "no_mx", mx: false, disposable: false };
  }
  return { deliverable: true, result: "mx_ok", mx: true, disposable: false };
}