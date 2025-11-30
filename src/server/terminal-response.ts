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

export function createTerminalCard(title: string, metrics: Record<string, any>, type: CardType = 'success') {
  const mainColor = type === 'error' ? STYLES.red : (type === 'warning' ? STYLES.yellow : STYLES.green);
  const icon = type === 'error' ? '❌' : '✅';

  const border = `${STYLES.dim}─────────────────────────────────────────────${STYLES.reset}`;

  const header = `\n${mainColor}╭${border}╮${STYLES.reset}\n` +
    `│ ${STYLES.bold}${mainColor}${icon} SYSTEM STATUS: ${title.padEnd(26)} ${STYLES.reset} │\n` +
    `${mainColor}├${border}┤${STYLES.reset}`;

  let body = "";
  for (const [key, value] of Object.entries(metrics)) {
    const keyStr = `${STYLES.cyan}${key}:${STYLES.reset}`;
    body += `\n│  ${keyStr.padEnd(25)} ${STYLES.bold}${value}${STYLES.reset}`;
  }

  const footer = `\n${mainColor}╰${border}╯${STYLES.reset}\n`;

  return header + body + footer;
}