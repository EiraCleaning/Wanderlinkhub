export function scrollAfterLayout(el: HTMLElement, { maxWaitMs = 1200 } = {}) {
  // Blur any focused input to avoid iOS keyboard refocus jump
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

  let cancelled = false;
  const start = performance.now();

  const run = async () => {
    // Wait for layout to settle: 2 RAFs + microtask
    await new Promise(r => requestAnimationFrame(() =>
      requestAnimationFrame(() => r(null))));
    await Promise.resolve();

    // If the element is gone or we've waited too long, bail
    if (!el || cancelled || performance.now() - start > maxWaitMs) return;

    // Try scrolling
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Guard: if layout still changing (map/images), retry a few times within the window
    requestAnimationFrame(() => {
      const stillLoading = document.querySelector('[data-listings-loading="true"]');
      if (!stillLoading && performance.now() - start < maxWaitMs) return;
      if (performance.now() - start < maxWaitMs) run();
    });
  };

  run();
  return () => { cancelled = true; };
}
