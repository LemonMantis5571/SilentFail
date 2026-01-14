# Improved Terminal Response System

The SilentFail project now features an enhanced terminal response system that provides better formatting and multiple output formats for API responses.

## Features

- **Multiple Output Formats**: Support for ANSI (terminal), HTML, and plain text formats
- **Better Visual Design**: Improved layout with proper borders, colors, and spacing
- **Type Safety**: Strong typing for metrics data
- **Flexible Usage**: Easy to customize for different response types (success, error, warning)

## Available Formats

1. **ANSI Format** (`format: 'ansi'`): Traditional terminal-style output with colors
2. **HTML Format** (`format: 'html'`): Structured HTML with CSS classes for styling
3. **Text Format** (`format: 'text'`): Clean plain text output for HTTP responses

## Usage Example

```typescript
import { createTerminalCard } from '~/server/terminal-response';

// Basic usage with text format (recommended for HTTP responses)
const response = createTerminalCard({
  title: "ONLINE",
  metrics: {
    "Monitor Name": "Backup Script",
    "Status": "UP 🚀",
    "Latency": "42 ms",
    "Last Ping": "14:30:25",
    "Grace Period": "5 min",
    "Message": "Heartbeat synced"
  },
  type: 'success',
  format: 'text'  // Use 'text' for HTTP responses
});
```

## CSS Styling

When using the HTML format, include the terminal-card.css file to get proper styling:

```css
@import '~/styles/terminal-card.css';
```

## Integration Points

The terminal response system is integrated into:
- Ping API endpoints (`/api/ping/[key]`)
- Error responses throughout the API
- Status reporting for cron checks

## Benefits

- **Improved Readability**: Clear, structured output that's easy to parse visually
- **Cross-Environment Compatibility**: Works in terminals, browsers, and logs
- **Consistent Formatting**: Uniform appearance across all status responses
- **Maintainable Code**: Clean, well-typed implementation that's easy to extend