// Design of this site on the use-social-feed/feed template (templates/use-social-feed/feed.js): the reference app inside an
// application window, with photographs and portraits cropped from the design's image sheets and the timeline
// tabs placed in the window's toolbar.
(function () {
  'use strict';
  const ASSETS = 'sites/design-use-social-feed-menu-03/assets/';
  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-menu-03',
    name: 'design',
    split: 'train',
    scenarios: ['menu'],
    template: 'use-social-feed/feed',
    design: {
      timeFormat: 'plain',
      scrollSet: 'model',
      parts: {
        // Keep seeded, functional timeline tabs in the application toolbar.
        headed: () => (R) => {
          if (R.live) R.ctx.stage.previousElementSibling.append(R.head);
        },
        photoSvg: () => (hue, k) => {
          if (k === 0) return `<svg viewBox="246 414 772 217" preserveAspectRatio="xMidYMid slice"><image href="${ASSETS}reference-scene.webp" width="1672" height="941"/></svg>`;
          const x = (k % 3) * 418;
          return `<svg viewBox="${x} 418 418 418" preserveAspectRatio="xMidYMid slice"><image href="${ASSETS}reference-photos.webp" width="1254" height="1254"/></svg>`;
        },
        avatar: (base) => (R, row, post, p, m) => {
          const av = base(R, row, post, p, m);
          const tile = [2, 5, 0, 1][p % 4];
          av.innerHTML = `<svg viewBox="${tile % 3 * 418} ${Math.floor(tile / 3) * 418} 418 418" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${ASSETS}reference-photos.webp" width="1254" height="1254"/></svg>`;
          if (p % 4 < 2) av.innerHTML = `<svg viewBox="129 ${p % 4 === 0 ? 297 : 718} 92 92" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${ASSETS}reference-scene.webp" width="1672" height="941"/></svg>`;
          av.title = post.name;
          return av;
        },
        menuItem: (base) => (R, panel, k, post) => {
          const el = base(R, panel, k, post);
          if (k === 'report') el.classList.add('separator');
          return el;
        },
        menuLeft: () => (R, c, t, w) => Math.round(Math.max(8, Math.min(c.width - w - 16, t.left - c.left - 16))),
        // A row is in view when it fits, or when its top is shown with its More button (the menu scenario's only
        // control): an expanded long post can be taller than the room under the oracle's scroll target.
        inView: () => (R, p, row, r, top0, h) => {
          const pt = R.fd.parts.get(p);
          const mb = pt && pt.more ? pt.more.getBoundingClientRect() : null;
          return r.top >= top0 - 0.5 && (r.bottom <= top0 + h + 0.5 || (mb && mb.top >= top0 - 0.5 && mb.bottom <= top0 + h + 0.5));
        },
      },
    },
  });
})();
