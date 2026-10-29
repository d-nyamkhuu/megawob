(function () {
  'use strict';
  const C = {
    site: 'design-set-date-range-10',
    title: 'Date Range Selector',
    icons: ['File', 'Edit', 'View', 'Tools', 'Help'],
    sideTitle: 'Choose the date range',
    sideNote: 'Select a start date and an end date.',
  };
  const ICON = {
    File: '<svg viewBox="0 0 40 40"><path d="M3 10V6h14l3 4h16v3h3v24H2V11z" fill="#171709"/><path d="M5 8h11l4 4h16v3H4z" fill="#f5dc79"/><path d="M4 16h32v19H4z" fill="#ead063"/><path d="M5 17h30v2H5zM5 18h2v16H5" fill="#fff5ad"/><path d="M34 17h2v18H5v-2h29z" fill="#b5a04d"/><path d="M3 12h32" stroke="#fff7be"/></svg>',
    Edit: '<svg viewBox="0 0 40 40"><path d="M6 2h27v36H6z" fill="#11143e"/><path d="M8 4h23v32H8z" fill="#f5f5f3"/><path d="M8 4h4v32H8" fill="#abb9d6"/><path d="M13 4h12v4H13z" fill="#45588d"/><path d="M14 13h14M14 19h14M14 25h14M14 31h8" stroke="#454b81" stroke-width="2"/><path d="M8 9h3M8 15h3M8 21h3M8 27h3" stroke="#243564" stroke-width="2"/><path d="M26 29h4v5h-4z" fill="#b2878e"/><path d="M31 4v32H8" fill="none" stroke="#90949e"/></svg>',
    View: '<svg viewBox="0 0 40 40"><path d="M10 1h22v18h5v5h2v14H2V23h3v-5h5z" fill="#121333"/><path d="M12 3h18v17H12z" fill="#b9c8e9"/><path d="M14 4h14v13H14z" fill="#f7f7fa"/><path d="M5 21h30v13H5z" fill="#a6abd0"/><path d="M7 19h5v4H7M30 19h3v4h-3" fill="#e9ecf4"/><path d="M4 27h31v5H4" fill="#7b82b1"/><path d="M11 28h19v10H11z" fill="#212457"/><path d="M13 30h15v6H13z" fill="#f4f4fa"/><path d="M15 32h11" stroke="#5d6694"/><path d="M6 24h5M31 24h2" stroke="#252352" stroke-width="2"/></svg>',
    Tools:
      '<svg viewBox="0 0 40 40"><path d="M5 2h29v37H5z" fill="#131636"/><path d="M7 4h25v33H7z" fill="#f6f5ef"/><path d="M8 5h3v30H8" fill="#c4cde5"/><path d="M12 6h15v3H12z" fill="#374173"/><path d="M12 13h16M12 18h16M12 23h16M12 28h16M12 33h16" stroke="#4f558d" stroke-width="2"/><path d="M30 4v31" stroke="#9ba9c4"/></svg>',
    Help: '<svg viewBox="0 0 40 40"><path d="M5 2h23l6 6v30H5z" fill="#182746"/><path d="M7 4h20v6h5v26H7z" fill="#ced9ed"/><path d="M28 4v5h4" fill="#f4f7fa"/><path d="M8 5h3v29H8" fill="#ecf2fa"/><path d="M15 9h10v3h3v8h-3v3h-4v5h-4v-8h5v-3h2v-4h-7v3h-4v-4h2zM17 30h5v4h-5z" fill="#18587f"/></svg>',
  };
  const BERRY =
    '<svg viewBox="0 0 30 40" shape-rendering="crispEdges"><g stroke="#17201a" stroke-width="1.3"><path d="M15 10C2 9 0 0 10 1l6 5c3-6 9-7 13-4-1 8-7 10-14 8z" fill="#32983c"/><path d="M7 3l8 6 9-5" fill="none" stroke="#8aca5d"/><g fill="#cb1742"><ellipse cx="9" cy="16" rx="5" ry="6"/><ellipse cx="20" cy="16" rx="5" ry="6"/><ellipse cx="5" cy="23" rx="4" ry="5"/><ellipse cx="14" cy="24" rx="5" ry="6"/><ellipse cx="24" cy="23" rx="4" ry="5"/><ellipse cx="9" cy="31" rx="4" ry="5"/><ellipse cx="20" cy="31" rx="4" ry="5"/><ellipse cx="15" cy="36" rx="4" ry="4"/></g></g><path d="M7 13h2v3H7M18 13h2v3h-2M12 21h2v3h-2M7 29h2v2H7M18 29h2v2h-2" fill="#fa6090"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endWords = (
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const defaultEnd = endWords.find((x) => x.trim().toLowerCase() === 'submit') || endWords[0] || 'Submit';
      const endLabel = endRng.bool(0.5) ? defaultEnd : endRng.pick(endWords);
      const placement = ctx.finish
        ? null
        : endRng.pick(['panel', 'panel', 'panel', 'panel', 'toolbar', 'toolbar', 'title', 'title']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endWords)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      const top = u.el('header', 'ds-top', document.body);
      const ic = u.el('span', 'ds-berry', top);
      ic.innerHTML = BERRY;
      u.el('span', 'ds-title', top, C.title);
      let submit = null;
      const endButton = (parent, cls, label, visible) => {
        const b = u.el('button', cls, parent, visible);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (placement === 'title') submit = endButton(top, 'ds-end-title', endLabel, '✓');
      const x = u.el('span', 'ds-close', top, '×');
      x.setAttribute('aria-hidden', 'true');
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('div', 'ds-content', body);
      const bar = u.el('nav', 'ds-menu', left);
      C.icons.forEach((t) => {
        const it = u.el('span', 'ds-icon', bar);
        const g = u.el('i', '', it);
        g.innerHTML = ICON[t];
        u.el('b', '', it, t);
      });
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'top';
      const side = u.el('aside', 'ds-side', body);
      u.el('div', 'ds-side-bar', side);
      const panel = u.el('div', 'ds-side-panel', side);
      u.el('h2', '', panel, C.sideTitle);
      u.el('p', '', panel, C.sideNote);
      if (mode === 'panel') u.el('div', 'ds-instruction ds-panel-instruction', panel, ctx.instruction);
      u.el('hr', '', panel);
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(left, 'ds-header-note');
      if (mode === 'toast') briefing(left, 'ds-toast');
      const main = u.el('div', 'ds-main', left);
      const stage = u.el('main', 'ds-stage', main);
      if (collide) {
        const d = u.el('button', 'ds-pq', panel, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (placement === 'panel') submit = endButton(panel, 'ds-submit', endLabel, endLabel);
      if (placement === 'toolbar') submit = endButton(bar, 'ds-end-toolbar', endLabel, endLabel);
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
