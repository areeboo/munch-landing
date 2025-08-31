import { NextRequest, NextResponse } from 'next/server';

function parseUtmFromUrl(url: URL) {
  const keys = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    "aff", "affiliate", "aff_id", "affiliate_id", "ref", "ref_id", "referrer_id",
    "cid", "campaign", "campaign_id", "adgroup", "adset", "creative", "placement"
  ]; 
  const out: Record<string, string> = {};
  let any = false;
  for (const k of keys) {
    const v = url.searchParams.get(k);
    if (v) { out[k] = v; any = true; }
  }
  const gclid = url.searchParams.get("gclid");
  const fbclid = url.searchParams.get("fbclid");
  const msclkid = url.searchParams.get("msclkid");
  if (gclid) { out.gclid = gclid; any = true; }
  if (fbclid) { out.fbclid = fbclid; any = true; }
  if (msclkid) { out.msclkid = msclkid; any = true; }
  return any ? out : null;
}

export function middleware(req: NextRequest) {
  // Only for non-API requests
  if (req.nextUrl.pathname.startsWith('/api')) return NextResponse.next();

  const res = NextResponse.next();

  const firstVisit = req.cookies.get('munch_first_visit');
  if (!firstVisit) {
    const nowISO = new Date().toISOString();
    res.cookies.set('munch_first_visit', nowISO, { sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 });
    res.cookies.set('munch_first_url', req.nextUrl.toString(), { sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 });
    res.cookies.set('munch_referrer', req.headers.get('referer') || '', { sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  const utm = parseUtmFromUrl(req.nextUrl);
  if (utm) {
    const value = JSON.stringify(utm).slice(0, 512);
    // Persist first UTM if not set, and always update last UTM
    if (!req.cookies.get('munch_first_utm')) {
      res.cookies.set('munch_first_utm', value, { sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 });
    }
    res.cookies.set('munch_last_utm', value, { sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
  }

  return res;
}

export const config = {
  matcher: [
    // Run on all paths except Next internals and static files, allow all pages
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
