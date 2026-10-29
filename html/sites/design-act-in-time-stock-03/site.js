(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-stock-03',
    instruction: 'panel',
    menu: 'File|Edit|View|Help',
    briefTitle: 'Task Briefing',
  };
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
      u.el('span', 'ds-brand', top, 'RISC OS');
      u.el('span', 'ds-system-date', top, 'Mon 12 Jun 1989  10:24');
      const nav = u.el('nav', 'ds-menu', document.body);
      u.el('span', 'ds-fruit', nav, '●');
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const title = u.el('div', 'ds-window-title', document.body);
      u.el('span', '', title, 'Share Dealing');
      u.el('button', 'ds-window-close', title, '×');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const bar = u.el('nav', 'ds-appbar', content);
      ['Desk', 'Apps', 'Net', 'Share Dealing', 'Prices', 'Watchlist', 'Settings'].forEach((t, i) => {
        const item = u.el('div', 'ds-appitem' + (i === 3 ? ' selected' : ''), bar);
        u.el('span', 'ds-appicon icon-' + i, item, ['⌂', '▱', '◉', '▤', '▥', '▤', '⚒'][i]);
        u.el('span', '', item, t);
      });
      const mode =
        ctx.display === 'header'
          ? 'top'
          : ctx.display === 'hidden'
            ? 'hidden'
            : ctx.display === 'toast'
              ? 'toast'
              : ctx.display === 'panel'
                ? 'left'
                : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        if (cls === 'ds-brief') {
          u.el(
            'p',
            'ds-brief-copy',
            b,
            'Monitor the share price on the right. Wait until it is below your target, then place the order and Submit.',
          );
          u.el('div', 'ds-brief-meta', b, 'Ticker and target price are shown in the market panel.');
          u.el('div', 'ds-brief-rule', b, 'Note: Do not buy at or above the target price.');
        }
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const endRng = ctx.rng.fork('chrome/end');
      const labels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const others = labels.filter((x) => x !== 'Submit');
      const classic = endRng.bool(0.5);
      const label = classic ? 'Submit' : endRng.pick(others.length ? others : labels);
      const placement = classic ? 'footer' : endRng.pick(['header', 'link', 'icon']);
      let submit = null;
      const makeEnd = (parent, kind, text) => {
        const b = u.el(kind === 'link' ? 'a' : 'button', kind === 'link' ? 'ds-end-link' : 'ds-submit', parent, text);
        if (kind === 'link') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish && placement === 'header') submit = makeEnd(bar, 'header', label);
      if (!ctx.finish && placement === 'icon') submit = makeEnd(foot, 'icon', '✓');
      if (!ctx.finish && placement === 'link') submit = makeEnd(foot, 'link', label + ' ›');
      if (!ctx.finish && placement === 'footer') submit = makeEnd(foot, 'footer', label);
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      if (submit && submit.parentNode === foot) foot.insertBefore(clear, submit);
      else foot.appendChild(clear);
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = labels.filter((x) => x !== label);
        const decoy = u.el('button', 'ds-xtra', placement === 'header' ? foot : bar, collideRng.pick(options));
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
      }
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, 'Quick Notes');
      u.el('ul', 'ds-quick-values', quick);
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
