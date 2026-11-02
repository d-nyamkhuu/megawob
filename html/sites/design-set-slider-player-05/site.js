// Early-Material video details page: indigo header over a left inspector, task area right, bottom dock.
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const icon = (parent, d, size) => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', size || 24);
    s.setAttribute('height', size || 24);
    s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', 'currentColor');
    s.appendChild(p);
    parent.appendChild(s);
    return s;
  };
  const ICON = {
    film: 'M18 4v1h-2V4H8v1H6V4H4v16h2v-1h2v1h8v-1h2v1h2V4h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z',
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z',
    music: 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z',
    check: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
  };

  // Scenic picture (mountain lake) drawn inline, used for the video and the thumbnail.
  const scene = (parent, cls) => {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 160 90');
    s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    s.setAttribute('class', cls);
    s.innerHTML =
      '<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f82d4"/><stop offset="1" stop-color="#a9cdee"/></linearGradient>' +
      '<linearGradient id="lk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d5a77"/><stop offset="1" stop-color="#1c4268"/></linearGradient></defs>' +
      '<rect width="160" height="90" fill="url(#sk)"/>' +
      '<path d="M0 44 L22 30 L34 36 L58 18 L70 12 L84 24 L100 20 L122 8 L140 22 L160 26 V52 H0Z" fill="#8c98a8"/>' +
      '<path d="M58 18 L70 12 L84 24 L72 22 L66 28Z M122 8 L140 22 L128 20 L120 26Z" fill="#f2f5f8"/>' +
      '<path d="M0 46 L30 38 L60 44 L100 34 L130 40 L160 32 V54 H0Z" fill="#3d6b52"/>' +
      '<path d="M0 50 H160 V54 H0Z" fill="#244a2f"/>' +
      '<rect y="54" width="160" height="36" fill="url(#lk)"/>' +
      '<g fill="#173d27"><path d="M0 54 L4 34 L8 54Z M8 54 L12 30 L17 54Z M18 54 L22 36 L27 54Z M30 54 L34 33 L39 54Z M44 54 L48 38 L52 54Z M70 54 L74 37 L78 54Z M96 54 L100 35 L105 54Z M120 54 L124 33 L129 54Z M140 54 L145 31 L150 54Z M150 54 L154 36 L160 54Z"/></g>' +
      '<g fill="#173d27" opacity=".55"><path d="M0 54 L4 74 L8 54Z M8 54 L12 78 L17 54Z M30 54 L34 76 L39 54Z M96 54 L100 74 L105 54Z M120 54 L124 78 L129 54Z M140 54 L145 80 L150 54Z"/></g>' +
      '<path d="M130 90 L140 78 L160 74 V90Z" fill="#4a4a48"/>';
    parent.appendChild(s);
    return s;
  };

  const ROWS = [
    ['Description', 'A morning view of a mountain lake with clear skies and reflections in the water.'],
    ['Location', 'Rocky Mountain National Park, Colorado, USA'],
    ['Length', '0:56'],
    ['Dimensions', '1920 × 1080'],
    ['File size', '125 MB'],
    ['Format', 'H.264, AAC'],
  ];

  env.site({
    name: 'design-set-slider-player-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/set-slider-horizontal-11',
    design: { parts: {
    frame: () => function frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['header', 'header', 'dock', 'link', 'icon']);
      const labels = ctx.content && ctx.content.END_LABELS;
      const endLabel = endRng.pick(Array.isArray(labels) && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Save', 'OK']);
      const label = typeof endLabel === 'string' ? endLabel : endLabel.label || endLabel.text || endLabel.name || String(endLabel);
      const xr = ctx.rng.fork('chrome/collide');
      const pool = (Array.isArray(labels) && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Save', 'OK'])
        .map(x => typeof x === 'string' ? x : x.label || x.text || x.name || String(x))
        .filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collision = xr.bool(0.3) && pool.length ? xr.pick(pool) : null;

      document.body.className = `mat instruction-${ctx.display}`;
      const side = u.el('aside', 'inspector', document.body);
      const bar = u.el('header', 'side-bar', side);
      icon(bar, ICON.film, 30);
      u.el('h1', '', bar, 'Video Details');
      const scroll = u.el('div', 'side-body', side);
      const top = u.el('div', 'side-top', scroll);
      const th = u.el('div', 'thumb', top);
      scene(th, 'scene');
      const meta = u.el('div', 'meta', top);
      u.el('h2', '', meta, 'Mountain Lake');
      for (const t of ['MP4 Video', '1920 × 1080', '125 MB', 'Oct 14, 2014, 10:24 AM']) u.el('div', '', meta, t);
      const rows = u.el('dl', 'props', scroll);
      for (const [k, v] of ROWS) {
        const row = u.el('div', 'prop', rows);
        u.el('dt', '', row, k);
        u.el('dd', '', row, v);
      }
      let panel = null;
      if (ctx.display === 'panel') {
        panel = u.el('div', 'note-card', scroll);
        u.el('h3', '', panel, 'Task');
        u.el('p', '', panel, ctx.instruction);
      }

      const right = u.el('div', 'right', document.body);
      const tool = u.el('header', 'toolbar', right);
      const noteBox = u.el('div', 'note', tool);
      if (ctx.display === 'header') noteBox.textContent = ctx.instruction;
      const acts = u.el('div', 'tool-acts', tool);
      const stage = u.el('main', 'stage-wrap', right);
      stage.dataset.role = 'stage';

      const dock = u.el('nav', 'dock', document.body);
      [['Library', ICON.home], ['Videos', ICON.film], ['Photos', ICON.image], ['Music', ICON.music]].forEach(([t, d], i) => {
        const b = u.el('div', 'tab' + (i === 0 ? ' on' : ''), dock);
        icon(b, d, 28);
        u.el('span', '', b, t);
      });
      const dockActs = u.el('div', 'dock-acts', dock);

      let submit = null;
      const mk = (parent, cls, text, withIcon) => {
        const b = u.el('button', cls, parent);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        if (withIcon) icon(b, ICON.check, 24); else b.textContent = text;
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') submit = mk(acts, 'raised', label);
        else if (placement === 'dock') submit = mk(dockActs, 'raised light', label);
        else if (placement === 'icon') submit = mk(acts, 'icon-btn', '', true);
        else {
          submit = u.el('a', 'dock-link', dockActs, label);
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.onclick = e => { e.preventDefault(); ctx.submit(); };
        }
      }
      if (collision) {
        const parent = placement === 'header' || placement === 'icon' ? dockActs : acts;
        const d = u.el('button', 'ref-xtra raised' + (parent === dockActs ? ' light' : ''), parent, collision);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.onclick = () => env.log('decoy', { label: collision, collide: true });
      }
      const reset = u.el('button', 'flat', dockActs, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';

      if (ctx.display === 'toast') {
        const t = u.el('div', 'snack', document.body);
        u.el('span', '', t, ctx.instruction);
        const c = u.el('button', 'flat', t, 'Close');
        c.type = 'button';
        c.onclick = () => { t.hidden = true; };
      }
      return { stage, submit };
    },
    drawOverlay: () => function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('aside', 'ovl ovl-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const text = ({
        chat: 'Hi! Need help with the player?',
        cookie: 'This site uses cookies to remember your preferences.',
        toast: 'Library synced.',
        promo: 'Try Photos Plus free for 30 days.',
        banner: 'New: shared playlists are now available.',
      })[ctx.kind];
      u.el('p', '', el, text);
      const b = u.el('button', 'raised', el, ctx.kind === 'cookie' ? 'Got it' : 'Dismiss');
      b.type = 'button';
      b.onclick = () => ctx.dismiss('dismiss');
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
    } },
  });
})();
