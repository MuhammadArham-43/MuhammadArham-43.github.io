document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  if (!body) return;

  const isBlogPage = body.classList.contains('layout--posts');
  if (!isBlogPage) return;

  const anchors = document.querySelectorAll('.archive__item-title a, .archive__item-excerpt a');
  const siteHost = window.location.host;

  anchors.forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href) return;

    const isAbsolute = /^https?:\/\//i.test(href);
    if (!isAbsolute) return;

    const linkHost = (() => {
      try {
        return new URL(href).host;
      } catch (_) {
        return null;
      }
    })();

    if (!linkHost || linkHost === siteHost) return;

    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  });
});

