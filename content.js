'use strict';

(function () {
  console.log('[DragToCopy] Content script injected');

  // Minimum text length to trigger copy
  const MIN_TEXT_LENGTH = 2;

  // Toast notification timeout (ms)
  const TOAST_DURATION = 1500;

  /**
   * Show a floating toast notification near cursor
   */
  function showToast(x, y) {
    const toast = document.createElement('div');
    toast.textContent = '✓ Copied!';
    toast.style.cssText = `
      position: fixed;
      left: ${x + 10}px;
      top: ${y - 40}px;
      background-color: #1a1a2e;
      color: white;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      z-index: 999999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease-in;
      white-space: nowrap;
    `;

    document.body.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });

    // Fade out and remove
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 200);
    }, TOAST_DURATION);
  }

  /**
   * Check if an element is an input or textarea
   */
  function isInputElement(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName === 'input' || tagName === 'textarea';
  }

  /**
   * Copy text to clipboard with fallback
   */
  async function copyToClipboard(text) {
    try {
      // Modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        console.log('[DragToCopy] Copied via Clipboard API:', text.substring(0, 50));
        return true;
      }
    } catch (err) {
      console.warn('[DragToCopy] Clipboard API failed, trying fallback', err);
    }

    // Fallback: document.execCommand
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (success) {
        console.log('[DragToCopy] Copied via execCommand:', text.substring(0, 50));
        return true;
      }
    } catch (err) {
      console.warn('[DragToCopy] execCommand fallback failed', err);
    }

    return false;
  }

  /**
   * Main handler for text selection on mouseup
   */
  async function handleMouseUp(event) {
    // Check if extension is enabled
    chrome.storage.sync.get({ dragToCopyEnabled: true }, (result) => {
      if (!result.dragToCopyEnabled) {
        console.log('[DragToCopy] Extension disabled, skipping');
        return;
      }

      // Don't copy if user was typing in an input
      if (event.target && isInputElement(event.target)) {
        console.log('[DragToCopy] Event target is input, skipping');
        return;
      }

      // Delay slightly on YouTube to let SPA settle
      const delayMs = isYouTubeVideo() ? 100 : 0;

      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection) {
          return;
        }

        const selectedText = selection.toString().trim();

        // Only copy if meaningful text selected
        if (selectedText.length >= MIN_TEXT_LENGTH) {
          copyToClipboard(selectedText).then((success) => {
            if (success) {
              showToast(event.clientX, event.clientY);
              console.log('[DragToCopy] Copied:', selectedText.substring(0, 50));
            }
          });
        } else {
          console.log('[DragToCopy] Selection too short, ignoring');
        }
      }, delayMs);
    });
  }

  /**
   * Detect if current page is YouTube
   */
  function isYouTubeVideo() {
    return (
      window.location.hostname.includes('youtube.com') ||
      window.location.hostname.includes('youtu.be')
    );
  }

  /**
   * Set up event listeners
   */
  function setupListeners() {
    // Standard mouseup listener
    document.addEventListener('mouseup', handleMouseUp, false);

    // YouTube: also listen in capture phase to catch events before YouTube's SPA intercepts
    if (isYouTubeVideo()) {
      console.log('[DragToCopy] YouTube detected, adding capture phase listener');
      document.addEventListener('mouseup', handleMouseUp, true);
    }
  }

  /**
   * Handle YouTube navigation (when user goes to a new video)
   */
  function setupYouTubeNavigation() {
    if (isYouTubeVideo()) {
      window.addEventListener('yt-navigate-finish', () => {
        console.log('[DragToCopy] YouTube navigation detected, re-initializing');
        // Listeners persist across navigations, so no need to re-attach
      });
    }
  }

  // Initialize
  setupListeners();
  setupYouTubeNavigation();

  console.log('[DragToCopy] Ready! Drag any text to copy it.');
})();
