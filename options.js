// Options page script
document.addEventListener('DOMContentLoaded', () => {
  const pauseVideosCheckbox = document.getElementById('pauseVideos');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  const openShortcutsLink = document.getElementById('openShortcuts');
  
  // Load saved settings
  chrome.storage.sync.get({
    pauseVideos: true
  }, (items) => {
    pauseVideosCheckbox.checked = items.pauseVideos;
  });
  
  // Save settings
  saveBtn.addEventListener('click', () => {
    const settings = {
      pauseVideos: pauseVideosCheckbox.checked
    };
    
    chrome.storage.sync.set(settings, () => {
      // Show status message
      statusDiv.textContent = 'Settings saved successfully!';
      statusDiv.className = 'status success';
      
      // Hide status after 3 seconds
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 3000);
    });
  });
  
  // Open shortcuts page
  openShortcutsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });
});
