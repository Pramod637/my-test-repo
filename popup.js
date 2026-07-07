'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusLabel = document.getElementById('statusLabel');

  // Load saved setting
  chrome.storage.sync.get({ dragToCopyEnabled: true }, (result) => {
    const isEnabled = result.dragToCopyEnabled;
    toggleSwitch.checked = isEnabled;
    updateStatusLabel(isEnabled);
  });

  // Listen for toggle changes
  toggleSwitch.addEventListener('change', (event) => {
    const isEnabled = event.target.checked;
    chrome.storage.sync.set({ dragToCopyEnabled: isEnabled }, () => {
      updateStatusLabel(isEnabled);
      console.log('[DragToCopy] Extension toggled:', isEnabled ? 'ON' : 'OFF');
    });
  });

  /**
   * Update status label based on enabled state
   */
  function updateStatusLabel(isEnabled) {
    if (isEnabled) {
      statusLabel.textContent = 'Active on this tab';
      statusLabel.className = 'status-active';
    } else {
      statusLabel.textContent = 'Disabled';
      statusLabel.className = 'status-inactive';
    }
  }
});
