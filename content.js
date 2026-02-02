// Content script for capturing screenshots and pausing videos
let isProcessing = false;
let tesseractLoaded = false;
let html2canvasLoaded = false;

// Function to pause all videos on the page
function pauseAllVideos() {
  const videos = document.querySelectorAll('video');
  const pausedVideos = [];
  
  videos.forEach((video) => {
    if (!video.paused) {
      video.pause();
      pausedVideos.push(video);
    }
  });
  
  return pausedVideos;
}

// Function to perform OCR on the captured screenshot
async function performOCR(imageData) {
  try {
    // Load Tesseract.js only once
    // Note: For production, consider bundling libraries locally or using SRI hashes
    if (!tesseractLoaded) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = () => {
          tesseractLoaded = true;
          resolve();
        };
      });
    }
    
    const worker = await Tesseract.createWorker('eng');
    const result = await worker.recognize(imageData);
    await worker.terminate();
    
    return result.data.text;
  } catch (error) {
    console.error('OCR Error:', error);
    return 'OCR processing failed: ' + error.message;
  }
}

// Function to take a screenshot
async function takeScreenshot() {
  if (isProcessing) {
    console.log('Already processing a screenshot');
    return;
  }
  
  isProcessing = true;
  
  try {
    // Get settings from storage
    const settings = await chrome.storage.sync.get({
      pauseVideos: true
    });
    
    let pausedVideos = [];
    
    // Pause videos if option is enabled
    if (settings.pauseVideos) {
      pausedVideos = pauseAllVideos();
    }
    
    // Small delay to ensure videos are paused
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture the visible tab
    const canvas = await html2canvas(document.body, {
      allowTaint: true,
      useCORS: true,
      logging: false,
      width: window.innerWidth,
      height: window.innerHeight,
      x: window.scrollX,
      y: window.scrollY
    });
    
    const imageData = canvas.toDataURL('image/png');
    
    // Show processing message
    showNotification('Processing screenshot with OCR...');
    
    // Perform OCR
    const ocrText = await performOCR(imageData);
    
    // Send results to background script
    chrome.runtime.sendMessage({
      action: 'screenshotCaptured',
      imageData: imageData,
      ocrText: ocrText
    });
    
    // Show results in a modal
    displayResults(imageData, ocrText);
    
  } catch (error) {
    console.error('Screenshot error:', error);
    showNotification('Error taking screenshot: ' + error.message, true);
  } finally {
    isProcessing = false;
  }
}

// Function to show a notification
function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background-color: ${isError ? '#f44336' : '#4CAF50'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 999999;
    font-family: Arial, sans-serif;
    font-size: 14px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Function to display results in a modal
function displayResults(imageData, ocrText) {
  // Remove existing modal if any
  const existingModal = document.getElementById('ocr-results-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'ocr-results-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background-color: white;
    border-radius: 8px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    padding: 20px;
    position: relative;
  `;
  
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: #666;
  `;
  closeButton.onclick = () => modal.remove();
  
  const title = document.createElement('h2');
  title.textContent = 'OCR Results';
  title.style.cssText = 'margin-top: 0; color: #333;';
  
  const imageContainer = document.createElement('div');
  imageContainer.style.cssText = 'margin: 15px 0;';
  
  const img = document.createElement('img');
  img.src = imageData;
  img.style.cssText = 'max-width: 100%; border: 1px solid #ddd; border-radius: 4px;';
  imageContainer.appendChild(img);
  
  const textTitle = document.createElement('h3');
  textTitle.textContent = 'Extracted Text:';
  textTitle.style.cssText = 'color: #333; margin-top: 20px;';
  
  const textArea = document.createElement('textarea');
  textArea.value = ocrText;
  textArea.style.cssText = `
    width: 100%;
    min-height: 200px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: monospace;
    resize: vertical;
  `;
  
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy Text';
  copyButton.style.cssText = `
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `;
  copyButton.onclick = async () => {
    try {
      await navigator.clipboard.writeText(textArea.value);
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy Text';
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      textArea.select();
      document.execCommand('copy');
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy Text';
      }, 2000);
    }
  };
  
  content.appendChild(closeButton);
  content.appendChild(title);
  content.appendChild(imageContainer);
  content.appendChild(textTitle);
  content.appendChild(textArea);
  content.appendChild(copyButton);
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'takeScreenshot') {
    takeScreenshot();
  }
});

// Load html2canvas library once on page load
// Note: For production, consider bundling libraries locally or using SRI hashes
if (!html2canvasLoaded) {
  const html2canvasScript = document.createElement('script');
  html2canvasScript.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
  html2canvasScript.crossOrigin = 'anonymous';
  html2canvasScript.onload = () => {
    html2canvasLoaded = true;
  };
  document.head.appendChild(html2canvasScript);
}
