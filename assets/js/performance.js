// Simple performance monitoring
window.addEventListener("load", () => {
  setTimeout(() => {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
  }, 0);
});

// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  });
}
