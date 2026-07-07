'use strict';

/**
 * Service Worker for Drag to Copy extension
 * Handles install event and initializes storage
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[DragToCopy] Extension installed');

  // Set default values if not already set
  chrome.storage.sync.get({ dragToCopyEnabled: null }, (result) => {
    if (result.dragToCopyEnabled === null) {
      chrome.storage.sync.set({ dragToCopyEnabled: true }, () => {
        console.log('[DragToCopy] Default settings initialized');
      });
    }
  });
});
