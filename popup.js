'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusLabel = document.getElementById('statusLabel');

  if (!toggleSwitch || !statusLabel) {
    console.warn('[DragToCopy] Popup missing expected elements');
    return;
  }

  // Load saved setting
  try {
    chrome.storage.sync.get({ dragToCopyEnabled: true }, (result) => {
      const isEnabled = result.dragToCopyEnabled;
      toggleSwitch.checked = isEnabled;
      updateStatusLabel(isEnabled);
    });
  } catch (err) {
    console.warn('[DragToCopy] Failed to read storage:', err);
  }

  // Listen for toggle changes
  toggleSwitch.addEventListener('change', (event) => {
    const isEnabled = event.target.checked;
    try {
      chrome.storage.sync.set({ dragToCopyEnabled: isEnabled }, () => {
        updateStatusLabel(isEnabled);
        console.log('[DragToCopy] Extension toggled:', isEnabled ? 'ON' : 'OFF');
      });
    } catch (err) {
      console.warn('[DragToCopy] Failed to save setting:', err);
    }
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
