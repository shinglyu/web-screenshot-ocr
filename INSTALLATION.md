# Installation and Testing Guide

## Installation Steps

### 1. Install the Extension

1. Open Chrome or Edge browser
2. Navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked"
5. Select this repository folder
6. The extension should now appear in your extensions list

### 2. Verify Installation

You should see:
- Extension icon in the toolbar (green icon with "OCR" text)
- Extension listed in chrome://extensions/ with version 1.0.0

## Testing the Extension

### Test 1: Basic Screenshot and OCR

1. Open the included `test.html` file in your browser
2. Click the extension icon in the toolbar
3. Click "Take Screenshot Now" button
4. Wait for processing (this may take 10-30 seconds for first OCR)
5. Verify:
   - Modal appears with screenshot
   - Text is extracted and displayed
   - "Copy Text" button works

### Test 2: Keyboard Shortcut

1. Open any webpage with text
2. Press `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac)
3. Verify screenshot is taken and OCR modal appears

### Test 3: Video Pause Feature

1. Open `test.html` which has an auto-playing video
2. Ensure "Pause videos before taking screenshot" is enabled in settings:
   - Click extension icon → Settings button
   - Check that "Pause videos before taking screenshot" is checked
3. Take a screenshot using the extension
4. Verify the video is paused before screenshot is taken

### Test 4: Custom Settings

1. Click extension icon
2. Click "⚙️ Settings" button
3. Toggle "Pause videos before taking screenshot"
4. Click "Save Settings"
5. Verify success message appears

### Test 5: Keyboard Shortcut Customization

1. Click extension icon → Settings
2. Click "Open Keyboard Shortcuts Settings"
3. You should be taken to `chrome://extensions/shortcuts`
4. Find "Web Screenshot OCR" in the list
5. Click the pencil icon to edit the shortcut
6. Set a custom shortcut (e.g., `Ctrl+Shift+X`)
7. Test the new shortcut works

## Expected Behavior

### When Taking a Screenshot:

1. If "Pause videos" is enabled, all playing videos are paused
2. Page is captured using html2canvas
3. Green notification appears: "Processing screenshot with OCR..."
4. OCR processing happens (powered by Tesseract.js)
5. Modal displays with:
   - Captured screenshot image
   - Extracted text in editable textarea
   - Copy button to copy text to clipboard
6. Results are also saved and viewable in extension popup

### In Extension Popup:

- Shows keyboard shortcut hint
- "Take Screenshot Now" button triggers screenshot
- "Settings" button opens options page
- Latest screenshot and OCR results are displayed (if any)

## Troubleshooting

### Extension Doesn't Load

- Ensure all files are present in the directory
- Check browser console for errors (F12 → Console)
- Verify manifest.json is valid

### OCR Not Working

- First OCR run takes longer as Tesseract.js loads
- Check browser console for errors
- Ensure internet connection (for loading external libraries)

### Keyboard Shortcut Not Working

- Check if another extension is using the same shortcut
- Go to chrome://extensions/shortcuts to verify/change
- Some pages (like chrome:// pages) block extension shortcuts

### Videos Not Pausing

- Ensure setting is enabled in options page
- Some videos in iframes may not be accessible
- Third-party video players may not use <video> tags

## Development Notes

### Files Structure:

```
web-screenshot-ocr/
├── manifest.json         # Extension configuration
├── background.js         # Service worker for commands
├── content.js           # Screenshot & OCR logic
├── popup.html/js        # Extension popup UI
├── options.html/js      # Settings page
├── icons/               # Extension icons
├── test.html           # Test page
└── README.md           # Documentation
```

### Technologies Used:

- **Tesseract.js**: OCR engine (loaded from CDN)
- **html2canvas**: Screenshot library (loaded from CDN)
- **Chrome Extensions API**: Manifest V3

### External Dependencies:

Both libraries are loaded dynamically from CDN:
- Tesseract.js v5: https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
- html2canvas v1.4.1: https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js

## Known Limitations

1. **First OCR is slow**: Tesseract.js needs to download and initialize (10-30 seconds)
2. **Accuracy**: OCR accuracy depends on image quality and text clarity
3. **Large pages**: Very long pages may take longer to process
4. **CORS restrictions**: Some images may not load due to CORS policies
5. **Special pages**: Cannot capture chrome:// or extension pages

## Performance Tips

1. Close unnecessary tabs before taking screenshots
2. Wait for page to fully load before capturing
3. For better OCR results, ensure text is clearly visible
4. First screenshot will be slower (library loading)