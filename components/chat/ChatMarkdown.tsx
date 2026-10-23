import { Fragment, type ReactNode } from "react";

/*
 * A tiny, safe Markdown subset for assistant replies: paragraphs, "-" / "1."
 * lists, **bold**, `code`, [links](url) and bare URLs. Everything renders as
 * React elements, so model output can never inject HTML.
 */

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s<>()]+[^\s<>().,!?;:'"])/g;
const LIST_ITEM = /^\s*(?:[-*•]|\d+[.)])\s+/;
const SAFE_HREF = /^(https?:|mailto:|tel:)/i;

function renderLink(href: string, label: ReactNode, key: number) {
  if (!SAFE_HREF.test(href)) return <Fragment key={key}>{label}</Fragment>;
  const external = /^https?:/i.test(href);
  return (
    <a key={key} href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
      {label}
    </a>
  );
}

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((token, i) => {
    if (i % 2 === 0) return token;
    if (token.startsWith("**")) return <strong key={i}>{token.slice(2, -2)}</strong>;
    if (token.startsWith("`")) return <code key={i}>{token.slice(1, -1)}</code>;
    if (token.startsWith("[")) {
      const split = token.indexOf("](");
      return renderLink(token.slice(split + 2, -1), token.slice(1, split), i);
    }
    return renderLink(token, token, i);
  });
}

type Block = { kind: "p" | "ul" | "ol"; lines: string[] };

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      blocks.push({ kind: "p", lines: [] });
      continue;
    }
    const kind = LIST_ITEM.test(line) ? (/^\s*\d/.test(line) ? "ol" : "ul") : "p";
    const content = kind === "p" ? line.replace(/^#{1,6}\s+/, "") : line.replace(LIST_ITEM, "");
    const last = blocks.at(-1);
    if (last && last.kind === kind && (kind !== "p" || last.lines.length > 0)) last.lines.push(content);
    else blocks.push({ kind, lines: [content] });
  }
  return blocks.filter((block) => block.lines.length > 0);
}

export function ChatMarkdown({ text }: { text: string }) {
  return toBlocks(text).map((block, i) => {
    if (block.kind === "p") {
      return (
        <p key={i}>
          {block.lines.map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {renderInline(line)}
            </Fragment>
          ))}
        </p>
      );
    }
    const List = block.kind;
    return (
      <List key={i}>
        {block.lines.map((line, j) => (
          <li key={j}>{renderInline(line)}</li>
        ))}
      </List>
    );
  });
}
