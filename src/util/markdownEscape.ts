// Source: https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Util.js#L76

/**
 * Options used to escape markdown.
 * @typedef {Object} EscapeMarkdownOptions
 * @property {boolean} [codeBlock=true] Whether to escape code blocks or not
 * @property {boolean} [inlineCode=true] Whether to escape inline code or not
 * @property {boolean} [bold=true] Whether to escape bolds or not
 * @property {boolean} [italic=true] Whether to escape italics or not
 * @property {boolean} [underline=true] Whether to escape underlines or not
 * @property {boolean} [strikethrough=true] Whether to escape strikethroughs or not
 * @property {boolean} [spoiler=true] Whether to escape spoilers or not
 * @property {boolean} [codeBlockContent=true] Whether to escape text inside code blocks or not
 * @property {boolean} [inlineCodeContent=true] Whether to escape text inside inline code or not
 * @property {boolean} [quote=true] Whether to escape quotes or not
 */

/**
 * Escapes any Discord-flavour markdown in a string.
 * @param {string} text Content to escape
 * @param {EscapeMarkdownOptions} [options={}] Options for escaping the markdown
 * @returns {string}
 */
function escapeMarkdown(
  text: string,
  {
    codeBlock = true,
    inlineCode = true,
    bold = true,
    italic = true,
    underline = true,
    strikethrough = true,
    spoiler = true,
    codeBlockContent = true,
    inlineCodeContent = true,
    quote = true
  } = {}
): string {
  if (!codeBlockContent) {
    return text
      .split("```")
      .map((subString, index, array) => {
        if (index % 2 && index !== array.length - 1) return subString;
        return escapeMarkdown(subString, {
          inlineCode,
          bold,
          italic,
          underline,
          strikethrough,
          spoiler,
          inlineCodeContent
        });
      })
      .join(codeBlock ? "\\`\\`\\`" : "```");
  }
  if (!inlineCodeContent) {
    return text
      .split(/(?<=^|[^`])`(?=[^`]|$)/g)
      .map((subString, index, array) => {
        if (index % 2 && index !== array.length - 1) return subString;
        return escapeMarkdown(subString, {
          codeBlock,
          bold,
          italic,
          underline,
          strikethrough,
          spoiler
        });
      })
      .join(inlineCode ? "\\`" : "`");
  }
  if (inlineCode) text = escapeInlineCode(text);
  if (codeBlock) text = escapeCodeBlock(text);
  if (italic) text = escapeItalic(text);
  if (bold) text = escapeBold(text);
  if (underline) text = escapeUnderline(text);
  if (strikethrough) text = escapeStrikethrough(text);
  if (spoiler) text = escapeSpoiler(text);
  if (quote) text = escapeQuote(text);
  return text;
}

/**
 * Escapes code block markdown in a string.
 * @param {string} text Content to escape
 * @returns {string}
 */
function escapeCodeBlock(text: string): string {
  return text.replace(/```/g, "\\`\\`\\`");
}

/**
 * Escapes inline code markdown in a string.
 * @param {string} text Content to escape
 * @returns {string}
 */
function escapeInlineCode(text: string): string {
  return text.replace(/(?<=^|[^`])``?(?=[^`]|$)/g, match => (match.length === 2 ? "\\`\\`" : "\\`"));
}

/**
 * Escapes italic markdown in a string.
 * @param {string} text Content to escape
 * @returns {string}
 */
function escapeItalic(text: string): string {
  let i = 0;
  text = text.replace(/(?<=^|[^*])\*([^*]|\*\*|$)/g, (_, match) => {
    if (match === "**") return ++i % 2 ? `\\*${match}` : `${match}\\*`;
    return `\\*${match}`;
  });
  i = 0;
  return text.replace(/(?<=^|[^_])_([^_]|__|$)/g, (_, match) => {
    if (match === "__") return ++i % 2 ? `\\_${match}` : `${match}\\_`;
    return `\\_${match}`;
  });
}

/**
 * Escapes bold markdown in a string.
 * @param {string} text Content to escape
 * @returns {string}
 */
function escapeBold(text: string): string {
  let i = 0;
  return text.replace(/\*\*(\*)?/g, (_, match) => {
    if (match) return ++i % 2 ? `${match}\\*\\*` : `\\*\\*${match}`;
    return "\\*\\*";
  });
}

/**
 * Escapes underline markdown in a string.
 * @param {string} text Content to escape
 * @returns {string}
 */
function escapeUnderline(text: string): string {
  let i = 0;
  return text.replace(/__(_)?/g, (_, match) => {
    if (match) return ++i % 2 ? `${match}\\_\\_` : `\\_\\_${match}`;
    return "\\_\\_";
  });
}

/**
 * Escapes strikethrough markdown in a string.
 * @param {string} text Content to escape
 * @returns {string}
 */
function escapeStrikethrough(text: string): string {
  return text.replace(/~~/g, "\\~\\~");
}

/**
 * Escapes spoiler markdown in a string.
 * @param {string} text Content to escape
 * @returns {string}
 */
function escapeSpoiler(text: string): string {
  return text.replace(/\|\|/g, "\\|\\|");
}

function escapeQuote(text: string): string {
  return text.replace(/\>/g, "\\>");
}

export default escapeMarkdown;
