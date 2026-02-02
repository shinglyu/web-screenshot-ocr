// Popup script
document.addEventListener('DOMContentLoaded', () => {
  const captureBtn = document.getElementById('captureBtn');
  const optionsBtn = document.getElementById('optionsBtn');
  const preview = document.getElementById('preview');
  const ocrResult = document.getElementById('ocrResult');
  
  // Handle capture button click
  captureBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'takeScreenshot' });
        window.close();
      }
    });
  });
  
  // Handle options button click
  optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // Load and display the latest screenshot if available
  chrome.storage.local.get(['latestScreenshot', 'latestOcrText'], (result) => {
    if (result.latestScreenshot) {
      preview.src = result.latestScreenshot;
      preview.style.display = 'block';
    }
    
    if (result.latestOcrText) {
      ocrResult.value = result.latestOcrText;
      ocrResult.style.display = 'block';
    }
  });
});
