export const STYLES = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  bgGreen: "\x1b[42m",
  bgRed: "\x1b[41m",
};

type CardType = 'success' | 'error' | 'warning';

export interface TerminalCardOptions {
  title: string;
  metrics: Record<string, string | number>;
  type?: CardType;
  format?: 'ansi' | 'html' | 'text';
}

export function createTerminalCard(options: TerminalCardOptions): string {
  const { title, metrics, type = 'success', format = 'ansi' } = options;

  if (format === 'html') {
    return createHtmlTerminalCard(title, metrics, type);
  } else if (format === 'text') {
    return createTextTerminalCard(title, metrics, type);
  } else {
    return createAnsiTerminalCard(title, metrics, type);
  }
}

function createAnsiTerminalCard(title: string, metrics: Record<string, string | number>, type: CardType): string {
  const mainColor = type === 'error' ? STYLES.red : (type === 'warning' ? STYLES.yellow : STYLES.green);
  const icon = type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : '✅');
  const statusText = type.charAt(0).toUpperCase() + type.slice(1);

  const border = `${STYLES.dim}─────────────────────────────────────────────${STYLES.reset}`;

  const header = `\n${mainColor}╭${border}╮${STYLES.reset}\n` +
    `│ ${STYLES.bold}${mainColor}${icon} ${statusText.toUpperCase()}: ${title.padEnd(30)} ${STYLES.reset} │\n` +
    `${mainColor}├${border}┤${STYLES.reset}`;

  let body = "";
  for (const [key, value] of Object.entries(metrics)) {
    const keyStr = `${STYLES.cyan}${key}:${STYLES.reset}`;
    body += `\n│  ${keyStr.padEnd(25)} ${STYLES.bold}${value}${STYLES.reset} │`;
  }

  const footer = `\n${mainColor}╰${border}╯${STYLES.reset}\n`;

  return header + body + footer;
}

function createHtmlTerminalCard(title: string, metrics: Record<string, string | number>, type: CardType): string {
  const icon = type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : '✅');
  const statusClass = type;
  const statusText = type.charAt(0).toUpperCase() + type.slice(1);

  let html = `
<div class="terminal-card ${statusClass}">
  <div class="card-header">
    <span class="icon">${icon}</span>
    <span class="status">${statusText.toUpperCase()}: ${title}</span>
  </div>
  <div class="card-body">
`;

  for (const [key, value] of Object.entries(metrics)) {
    html += `    <div class="metric-row"><span class="metric-key">${key}:</span> <span class="metric-value">${value}</span></div>\n`;
  }

  html += `  </div>\n</div>`;

  return html.trim();
}

function createTextTerminalCard(title: string, metrics: Record<string, string | number>, type: CardType): string {
  const icon = type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : '✅');
  const statusText = type.charAt(0).toUpperCase() + type.slice(1);

  let text = `\n┌─ ${icon} ${statusText.toUpperCase()}: ${title} ──────────────────────────────────────┐\n`;

  for (const [key, value] of Object.entries(metrics)) {
    text += `│  ${key}: ${value} │\n`;
  }

  text += `└────────────────────────────────────────────────────────────────────────┘\n`;

  return text;
}