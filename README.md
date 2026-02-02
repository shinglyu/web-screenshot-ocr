# Web Screenshot OCR

A browser extension to take screenshots of web pages and extract text using OCR (Optical Character Recognition) powered by [Tesseract.js](https://github.com/naptha/tesseract.js).

## Features

- 📸 **Screenshot Capture**: Capture screenshots of the current webpage with a single click or keyboard shortcut
- 🔍 **OCR Text Extraction**: Automatically extract text from screenshots using Tesseract.js
- ⌨️ **Customizable Keyboard Shortcut**: Default shortcut is `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (macOS)
- 📹 **Video Pause Option**: Automatically pause any playing videos before taking a screenshot to avoid motion blur
- 💾 **Results Display**: View extracted text in a modal with the ability to copy it to clipboard
- ⚙️ **Settings Page**: Configure extension behavior including video pause option

## Installation

### From Source (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/shinglyu/web-screenshot-ocr.git
   cd web-screenshot-ocr
   ```

2. Open Chrome/Edge and navigate to `chrome://extensions/`

3. Enable "Developer mode" using the toggle in the top right corner

4. Click "Load unpacked" and select the repository folder

5. The extension should now be installed and active!

## Usage

### Taking a Screenshot

There are two ways to capture a screenshot:

1. **Keyboard Shortcut**: Press `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (macOS)
2. **Extension Popup**: Click the extension icon and press the "Take Screenshot Now" button

### Viewing Results

After taking a screenshot:
- A modal will appear showing the captured screenshot
- The extracted text will be displayed in a text area below the image
- You can copy the extracted text using the "Copy Text" button
- Click the × button or click outside the modal to close it

### Customizing Settings

1. Click the extension icon
2. Click the "⚙️ Settings" button
3. Configure your preferences:
   - **Pause videos before taking screenshot**: Toggle this option to automatically pause videos
   - **Keyboard Shortcut**: Click "Open Keyboard Shortcuts Settings" to customize the shortcut

## Technical Details

### Technologies Used

- **Manifest V3**: Latest Chrome extension manifest version
- **Tesseract.js**: OCR engine for text extraction
- **html2canvas**: Library for capturing webpage screenshots
- **Chrome Extension APIs**: For keyboard shortcuts, storage, and messaging

### Architecture

- `manifest.json`: Extension configuration and permissions
- `background.js`: Service worker handling keyboard commands
- `content.js`: Content script for screenshot capture and OCR processing
- `popup.html/js`: Extension popup interface
- `options.html/js`: Settings page for configuration

## Permissions

The extension requires the following permissions:
- `activeTab`: To capture screenshots of the current tab
- `storage`: To save settings and recent screenshots
- `commands`: To register keyboard shortcuts

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Edge
- ⚠️ Firefox (may require modifications for Manifest V2)

## Privacy

This extension:
- Does NOT send any data to external servers
- Processes all screenshots and OCR locally in your browser
- Only stores settings and the most recent screenshot locally
- Does NOT track or collect user data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this extension for personal or commercial projects.

## Support

If you encounter any issues or have feature requests, please open an issue on GitHub.
