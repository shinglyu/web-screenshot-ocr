// Background script for handling keyboard commands
chrome.commands.onCommand.addListener((command) => {
  if (command === 'take-screenshot') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'takeScreenshot' });
      }
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'screenshotCaptured') {
    // Open a new tab or popup to display the OCR results
    chrome.storage.local.set({ 
      latestScreenshot: request.imageData,
      latestOcrText: request.ocrText 
    }, () => {
      // Optionally notify the user
      console.log('Screenshot and OCR result saved');
    });
  }
});
