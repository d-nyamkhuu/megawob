// This design uses pixel portraits, dated post times, and arrow controls on the feed scrollbar.
(function () {
  'use strict';

  function portrait(handle, shirt) {
    let hash = 0;
    for (const c of handle) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
    const hair = ['#70400e', '#f0cc32', '#17120b', '#8b4d1c'][hash % 4];
    const widget = ['#ffd293', '#edb677', '#ce873f'][hash % 3];
    const long = hash % 4 === 1;
    return `<svg viewBox="0 0 64 64" shape-rendering="crispEdges"><path fill="#c0c0c0" d="M0 0h64v64H0z"/><path fill="#000" d="M6 64v-7h3v-4h6v-3h10v-6h-5v-5h-3v-7h-3V20h2v-7h4V9h4V6h15v2h5v3h4v5h2v16h-3v7h-3v5h-5v6h10v3h6v4h3v7z"/><path fill="${shirt}" d="M8 63v-5h3v-4h6v-2h8v3h4v2h7v-2h4v-3h8v2h6v4h3v5z"/><path fill="${hair}" d="M16 26V20h2v-6h4v-4h4V8h12v2h6v4h3v5h1v9h-3V18h-6v2h-6v-2h-5v3h-5v-2h-3v9h-4z${long ? 'M15 26h5v16h-2v3h-5v-4h2zM45 24h5v17h2v4h-7z' : ''}"/><path fill="${widget}" d="M20 23h5v-3h6v1h5v-1h7v10h3v5h-3v5h-4v4h-4v7h3v2h-3v2h-6v-2h-3v-2h2v-7h-4v-3h-3v-5h-3v-5h2z"/><path fill="#b7783c" d="M18 31h2v4h-2zM43 31h2v4h-2zM24 39h2v4h4v2h-4v-2h-2zM28 47h7v2h-7z"/><path fill="#000" d="M23 24h5v1h-5zM36 24h5v1h-5zM25 28h2v3h-2zM37 28h2v3h-2zM31 29h1v5h3v1h-5v-1h1zM27 38h2v1h6v-1h2v2h-2v1h-6v-1h-2zM16 58h1v6h-1zM48 58h1v6h-1z"/><path fill="#fff" d="M24 26h4v2h-4zM36 26h4v2h-4z"/></svg>`;
  }

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-08',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    template: 'use-social-feed/feed',
    design: {
      icons: {
        like: '<path fill="#fff" d="M8 20h11l2-9h-7l1-6-2-2-2 7-3 3z"/><path fill="#008080" d="M4 12h4v8H4z"/>',
        share: '<path fill="#fff" d="M3 20v-7c0-4 5-6 11-6V3l7 7-7 7v-5c-6 0-9 3-11 8z"/>',
      },
      parts: {
        avatar: (base) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          av.style.background = '#c0c0c0';
          av.innerHTML = portrait(post.handle, R.colorOf(post.handle));
          return av;
        },
        timeText: () => (R, post) => {
          const age = post.time.match(/(\d+)\s*([mhd])/i);
          const ago = age ? Number(age[1]) * { m: 1, h: 60, d: 1440 }[age[2].toLowerCase()] : 0;
          const instant = 12 * 1440 + 14 * 60 + 36 - ago;
          const day = Math.floor(instant / 1440);
          const minutes = ((instant % 1440) + 1440) % 1440;
          return `Mar ${day}, 1992  ${Math.floor(minutes / 60) % 12 || 12}:${String(minutes % 60).padStart(2, '0')} ${minutes >= 720 ? 'PM' : 'AM'}`;
        },
        afterText: (base) => (R, main, post, p, parts, row, m) => {
          base(R, main, post, p, parts, row, m);
          const tx = parts.text;
          if (tx.scrollHeight > parseFloat(getComputedStyle(tx).lineHeight) * 1.5) row.classList.add('two-lines');
        },
        scrollbar: (base) => (R) => {
          const sb = base(R);
          const feed = R.box.querySelector('.as-feed');
          for (const [label, delta, cls] of [['Scroll up', -90, 'up'], ['Scroll down', 90, 'down']]) {
            const arrow = R.util.el('button', `as-arrow ${cls}`, sb.track);
            arrow.type = 'button';
            arrow.setAttribute('aria-label', label);
            arrow.addEventListener('pointerdown', (e) => e.stopPropagation());
            arrow.addEventListener('click', (e) => {
              e.stopPropagation();
              feed.scrollTop += delta;
              R.report();
            });
            sb.track.insertBefore(arrow, sb.thumb);
          }
          return sb;
        },
      },
    },
  });
})();
