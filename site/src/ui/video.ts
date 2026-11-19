/** Click-to-load YouTube (privacy-enhanced). Nothing is requested from YouTube before the click. */
export function initVideo(): void {
  for (const wrap of document.querySelectorAll<HTMLElement>('[data-video]')) {
    const btn = wrap.querySelector<HTMLButtonElement>('[data-video-play]');
    btn?.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(wrap.dataset.video!)}?autoplay=1&rel=0`;
      f.title = wrap.dataset.videoTitle ?? 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      btn.replaceWith(f);
      f.focus();
    }, { once: true });
  }
}
