# Drag to Copy - Chrome Extension

A simple yet powerful Chrome Extension that automatically copies any text you drag-select to your clipboard — without pressing Ctrl+C.

## Features

✂️ **Drag to Copy**: Simply drag your mouse over any text on any webpage (including YouTube) to copy it instantly.

🎯 **Smart Detection**: Only copies meaningful selections (2+ characters).

📋 **Toast Notification**: Shows a brief "✓ Copied!" message at your cursor when text is copied.

⚙️ **Toggle Switch**: Enable/disable the extension with a single click in the popup.

🎬 **YouTube Support**: Fully compatible with YouTube's complex single-page app architecture.

💾 **Persistent Settings**: Your ON/OFF preference is saved across browser sessions.

## Project Structure

```
chrome-extension/
├── manifest.json          # Manifest V3 configuration
├── content.js             # Main content script (text selection & copy)
├── popup.html             # Extension popup UI
├── popup.js               # Popup toggle functionality
├── background.js          # Service worker (initialization)
├── setup-icons.js         # Script to generate icons
├── icons/
│   ├── icon16.png         # 16x16 extension icon
│   ├── icon48.png         # 48x48 extension icon
│   └── icon128.png        # 128x128 extension icon
└── README.md             # This file
```

## Installation & Setup

### Step 1: Generate Icons

The icons are generated from base64-encoded PNG data. If you haven't run the setup script yet:

```bash
node setup-icons.js
```

This creates the three PNG icon files in the `icons/` directory.

### Step 2: Load as Unpacked Extension in Chrome

1. Open Google Chrome and go to: **chrome://extensions/**

2. Enable **Developer mode** (toggle in the top right)

3. Click **Load unpacked**

4. Navigate to your extension folder (`c:\Users\pc\chrome extention`) and click **Select Folder**

5. The "Drag to Copy" extension should now appear in your extensions list with a scissors icon

### Step 3: Verify Installation

1. Visit any webpage (e.g., Google, Wikipedia)

2. Drag your mouse over some text

3. You should see a "✓ Copied!" notification appear

4. Paste anywhere (Ctrl+V) to verify the text was copied

## How to Use

### Basic Usage
- **Select text** by clicking and dragging over any text on a webpage
- **Text is automatically copied** to your clipboard when you release the mouse
- **No keyboard shortcuts needed** — just drag and release!

### Disabling/Enabling

- Click the **Drag to Copy** extension icon in your Chrome toolbar
- Toggle the **ON/OFF** switch to enable or disable the extension
- Your preference is saved and persists across browser sessions

### YouTube Support

The extension has special handling for YouTube:
- Works with video titles, descriptions, comments, chapters, and transcripts
- Handles YouTube's complex Single Page App (SPA) architecture
- Listens in both bubble and capture phases to ensure no events are missed

## Technical Details

### Content Script (`content.js`)
- Listens for `mouseup` events on the entire document
- Gets selected text using `window.getSelection().toString()`
- Copies to clipboard using:
  1. Modern `navigator.clipboard.writeText()` API
  2. Fallback to `document.execCommand('copy')` for older pages
- Shows floating toast notification near cursor
- Special handling for YouTube with capture phase listeners
- Checks extension enabled/disabled state from `chrome.storage.sync`

### Popup UI (`popup.html` + `popup.js`)
- Clean, modern dark-themed interface
- Toggle switch for enabling/disabling extension
- Status indicator ("Active on this tab" or "Disabled")
- Usage hint for user guidance
- Saves toggle state to `chrome.storage.sync`

### Service Worker (`background.js`)
- Initializes default storage values on extension install
- Sets `dragToCopyEnabled` to `true` by default

### Edge Cases Handled
✓ Ignores selections in input fields and textareas  
✓ Requires minimum 2-character selection (no accidental single-char copies)  
✓ Falls back to `execCommand('copy')` if Clipboard API is blocked  
✓ Works across iframes (uses `all_frames: true`)  
✓ Handles YouTube's navigation without re-initializing listeners  
✓ Uses fixed positioning for toast (doesn't affect page layout)  

## Debugging

The extension logs useful debug messages to the browser console with `[DragToCopy]` prefix.

Open Developer Tools (F12) and go to the **Console** tab to see logs like:
- `[DragToCopy] Content script injected`
- `[DragToCopy] YouTube detected...`
- `[DragToCopy] Copied via Clipboard API: [text preview]`
- `[DragToCopy] Ready! Drag any text to copy it.`

## Testing Checklist

- [ ] Load extension in `chrome://extensions/` (Developer mode)
- [ ] Visit https://www.youtube.com and select text from video title
- [ ] Drag over text on any Wikipedia page
- [ ] Try dragging over YouTube comments
- [ ] Try dragging over YouTube video description
- [ ] Disable extension via popup toggle, verify no toast appears
- [ ] Enable extension via popup toggle, verify functionality resumes
- [ ] Check console for debug messages with `[DragToCopy]` prefix
- [ ] Reload extension in chrome://extensions/ and test again
- [ ] Try text selection in an input field (should not copy)

## Browser Compatibility

- ✅ Chrome 88+ (Manifest V3 support)
- ✅ Edge 88+ (Chromium-based)
- ❌ Firefox (uses different extension API)
- ❌ Safari (uses different extension API)

## Permissions Used

- **clipboardWrite**: Write to user's clipboard
- **storage**: Save toggle state
- **activeTab**: Access current tab info
- **scripting**: Inject content script
- **<all_urls>**: Run on all websites

## License

Free to use and modify for personal use.

## Troubleshooting

**Toast notification not appearing?**
- Make sure you're selecting at least 2 characters
- Check that the extension is enabled (green toggle in popup)
- Check browser console for any errors

**Copy not working on some websites?**
- Some websites block the Clipboard API (the extension will fall back to `execCommand`)
- Try refreshing the page and trying again
- Check console logs for specific error messages

**Extension not working after browser restart?**
- Re-load the extension in `chrome://extensions/`
- Clear your `chrome.storage.sync` data if needed

---

**Enjoy drag-to-copy! 🎉**

# my-test-repo
This is a test repository for the Drag to Copy extension.

Creator: Pramod AI
