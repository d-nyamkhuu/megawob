(function () {
  'use strict';
  const C = { 'site': 'design-choose-option-dropdown-03', 'brand': 'Media Settings', 'instruction': 'top' };
  const S = (p) =>
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
    p +
    '</svg>';
  const RAIL = [
    [
      'Playback',
      '<svg viewBox="0 0 48 48" fill="currentColor"><path fill-rule="evenodd" d="M6 3h36v42H6zM10 7v5h4V7zM10 16v5h4v-5zM10 25v5h4v-5zM10 34v6h4v-6zM34 7v5h4V7zM34 16v5h4v-5zM34 25v5h4v-5zM34 34v6h4v-6zM18 7v9h12V7zM18 20v9h12v-9zM18 33v8h12v-8z"/></svg>',
    ],
    [
      'Audio',
      '<svg viewBox="0 0 48 48" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M6 18h8l10-9v30l-10-9H6z"/><path d="M30 17q5 7 0 14M36 12q9 12 0 24" fill="none"/></svg>',
    ],
    [
      'Subtitles',
      '<svg viewBox="0 0 48 48"><rect x="3" y="7" width="42" height="34" rx="3" fill="currentColor"/><text x="24" y="31" text-anchor="middle" font-family="Arial" font-weight="700" font-size="20" fill="#5b8fc0">CC</text></svg>',
    ],
    ['Video', S('<rect x="5" y="7" width="38" height="26" rx="2"/><path d="M18 41h12M24 33v8"/>')],
    [
      'General',
      '<svg viewBox="0 0 48 48" fill="currentColor"><path fill-rule="evenodd" d="M20 3h8l2 7 4 2 6-3 5 7-5 5v6l5 5-5 7-6-3-4 2-2 7h-8l-2-7-4-2-6 3-5-7 5-5v-6l-5-5 5-7 6 3 4-2zM24 16a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"/></svg>',
    ],
    [
      'Help',
      '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="currentColor"/><text x="24" y="33" text-anchor="middle" font-family="Arial" font-weight="700" font-size="28" fill="#5b8fc0">?</text></svg>',
    ],
  ];
  const PREVIEW =
    '<svg viewBox="0 0 1400 140" preserveAspectRatio="none"><defs><linearGradient id="vsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb4cf"/><stop offset=".6" stop-color="#dfe4ec"/><stop offset="1" stop-color="#e9e6e2"/></linearGradient><linearGradient id="vsw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f969e"/><stop offset="1" stop-color="#4b616b"/></linearGradient></defs><rect width="1400" height="140" fill="url(#vsk)"/><path d="M300 78Q420 55 520 62T760 60T1000 70T1400 62V100H300Z" fill="#6e8a98"/><rect y="88" width="1400" height="14" fill="#8b9a78"/><rect y="100" width="1400" height="40" fill="url(#vsw)"/><path d="M0 0H300L285 18L262 30L240 52L205 70L160 85L90 95L0 100Z" fill="#1f3a28"/><path d="M0 20L60 5L120 30L170 15L215 50L170 80L90 90L0 95Z" fill="#2c4a30"/><path d="M1400 30L1350 16L1330 40L1280 28L1240 56L1190 48L1140 70L1060 74L1000 92L1400 98Z" fill="#26402d"/><path d="M1400 55L1340 40L1300 62L1240 60L1180 82L1100 88L1400 98Z" fill="#17301f"/><pattern id="vst" width="16" height="34" patternUnits="userSpaceOnUse"><path d="M0 34L8 0L16 34Z" fill="#2b4a33"/></pattern><rect x="900" y="58" width="500" height="34" fill="url(#vst)"/><rect x="330" y="76" width="570" height="14" fill="#5c7a5a" opacity=".6"/></svg>';
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const ic = u.el('span', 'ds-appicon', top);
      ic.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="#1b2f4a" stroke-width="1.7"><defs><linearGradient id="filmglass" x2="1" y2="1"><stop stop-color="#f1f6fa"/><stop offset="1" stop-color="#a3bbcb"/></linearGradient></defs><rect x="3" y="1" width="18" height="22" rx="3" fill="url(#filmglass)"/><path d="M7 2v20M17 2v20M8 8h8M8 16h8M3 6h4M3 12h4M3 18h4M17 6h4M17 12h4M17 18h4"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wb = u.el('span', 'ds-wbtns', top);
      u.el('i', 'ds-wb', wb, '');
      u.el('i', 'ds-wb ds-wmax', wb, '');
      u.el('i', 'ds-wb ds-wclose', wb, '×');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      RAIL.forEach(([t, svg], i) => {
        const it = u.el('div', 'ds-rail-item' + (i === 0 ? ' on' : ''), rail);
        const g = u.el('span', 'ds-rail-ic', it);
        g.innerHTML = svg;
        u.el('span', '', it, t);
      });
      const content = u.el('div', 'ds-content', body);
      const hd = u.el('div', 'ds-page-head', content);
      u.el('h1', '', hd, 'Playback Settings');
      u.el('p', '', hd, 'Customize how media is played back, including audio, subtitles and display options.');
      const group = u.el('section', 'ds-group', content);
      u.el('div', 'ds-legend', group, 'Subtitles');
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(group, 'ds-header-note');
      const main = u.el('div', 'ds-main', group);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(group, 'ds-toast');
        group.insertBefore(note, main);
      }
      const pv = u.el('section', 'ds-group ds-preview', content);
      u.el('div', 'ds-legend', pv, 'Preview');
      const pic = u.el('div', 'ds-pic', pv);
      pic.innerHTML = PREVIEW;
      u.el('div', 'ds-sub', pic, 'Sample subtitle text will appear here.');
      const endR = ctx.rng.fork('chrome/end');
      const original = endR.bool(0.5);
      const placement = original ? 'footer' : endR.pick(['header', 'link']);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const label = original ? 'Submit' : labelOf(endR.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const options = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = collideR.pick(options);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const rb = u.el('button', 'ds-btn ds-restore', foot, 'Restore Defaults');
      rb.type = 'button';
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'ds-btn ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endButton(foot, 'ds-submit', label);
        else if (placement === 'header') submit = endButton(group, 'ds-submit ds-end-head', label);
        else {
          submit = endButton(foot, 'ds-end-link', label + ' ›');
        }
      }
      if (collide) decoy(foot, collide);
      const cb = u.el('button', 'ds-btn', foot, 'Cancel');
      cb.type = 'button';
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
