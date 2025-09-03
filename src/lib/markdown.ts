// Minimal Markdown -> HTML converter for server-side rendering
// Supports: headings, paragraphs, bold, italics, code, links, and unordered lists

export function renderMarkdownToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const html: string[] = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (let raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) {
      flushList();
      html.push("");
      continue;
    }

    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushList();
      const level = h[1].length;
      const text = inline(h[2]);
      html.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    // Unordered list item
    if (/^[-*+]\s+/.test(line)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      const item = line.replace(/^[-*+]\s+/, "");
      html.push(`<li>${inline(item)}</li>`);
      continue;
    }

    // Paragraph
    flushList();
    html.push(`<p>${inline(line)}</p>`);
  }

  flushList();
  return html.join("\n");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  // Escape first to avoid accidental injection, then re-insert allowed HTML from markdown constructs
  let out = escapeHtml(s);

  // Inline code: `code`
  out = out.replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`);

  // Bold: **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, (_m, bold) => `<strong>${bold}</strong>`);

  // Italic: *text*
  out = out.replace(/(^|\W)\*([^*]+)\*(?=\W|$)/g, (_m, pre, italic) => `${pre}<em>${italic}</em>`);

  // Links: [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
    const safeUrl = String(url).replace(/"/g, "&quot;");
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  return out;
}

