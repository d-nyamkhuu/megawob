(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-stock-11',
    'brand': 'Stock Watcher',
    'title': 'Place Order',
    'instruction': 'top',
    'rail': '',
    'menu': 'Watch|Charts|Orders|Notes|Settings',
    'briefTitle': 'Instructions',
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
      u.el('span', 'ds-brand', top, C.brand);
      const topTools = u.el('div', 'ds-top-tools', top);
      u.el('span', 'ds-window-buttons', top, '−    □    ×');
      const natural = C.instruction;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      const roomy = innerWidth >= 1260,
        tall = innerHeight >= 700;
      if (mode === 'left' && !roomy) mode = 'top';
      if (mode === 'toast' && !tall) mode = 'top';
      const endR = ctx.rng.fork('chrome/end');
      const common = !ctx.finish && endR.bool(0.5);
      const placement = ctx.finish ? null : common ? 'footer' : endR.pick(['toolbar', 'menubar']);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const normalize = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = ctx.finish ? null : common ? 'Submit' : normalize(endR.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = [...new Set(labels.map(normalize).filter((x) => x && x.toLowerCase() !== label.toLowerCase()))];
        if (pool.length) collide = collideR.pick(pool);
      }
      const decoy = (parent, text, collides) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
      };
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
        u.el('span', 'ds-stock-date', nav, 'Apr 26, 2018  10:24 AM');
        if (placement === 'toolbar') submit = end(topTools, 'ds-submit ds-end-toolbar', label);
        else if (placement === 'menubar') submit = end(nav, 'ds-submit ds-end-menu', label);
        u.el('span', 'ds-window-buttons ds-nav-window-buttons', nav, '−    □    ×');
      }
      if (collide) decoy(topTools, collide, true);
      const body = u.el('div', 'ds-body', document.body);
      const modeName = mode === 'hidden' ? 'hidden' : mode === 'toast' ? 'toast' : mode === 'left' ? 'left' : 'top';
      const content = u.el('div', 'ds-content', body);
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (modeName === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (modeName === 'left') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (modeName === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-ready', foot, 'Ready');
      if (!ctx.finish && placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (!ctx.finish && placement === 'footer' && collide) decoy(foot, collide, true);
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, 'Notifications (5)');
      u.el('ul', 'ds-quick-values', quick);
      const notices = u.el('section', 'ds-notifications', quick);
      [
        ['✉', 'News Alert', '10:12 AM', 'Market update: tech stocks rally further today.'],
        ['♟', 'Watchlist Update', '10:09 AM', '3 symbols hit new 52-week highs.'],
        ['▤', 'System Message', '10:06 AM', 'Platform maintenance scheduled this weekend.'],
        ['▥', 'Research Note', '10:03 AM', 'New report available on renewable energy sector.'],
        ['◆', 'Promotion', '9:58 AM', 'Get 3 months of real-time data at a discount.'],
      ].forEach((a) => {
        const n = u.el('article', 'ds-notification', notices);
        n.dataset.icon = a[0];
        u.el('b', '', n, a[1]);
        u.el('small', '', n, a[2]);
        u.el('span', '', n, a[3]);
        u.el('i', '', n, '×');
      });
      const dismiss = u.el('button', 'ds-dismiss-all', quick, 'Dismiss all');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => {
        notices.remove();
        dismiss.remove();
      });
      const preview = u.el('aside', 'ds-preview', document.body);
      u.el('div', 'ds-preview-title', preview, 'Preview – JCA');
      u.el('div', 'ds-preview-plot', preview);
      const ins = content.querySelector('.ds-header-note .ds-instruction');
      if (ins) {
        let fs = innerHeight > 820 ? 50 : 31;
        while (fs > 20) {
          ins.style.fontSize = fs + 'px';
          if (ins.getBoundingClientRect().height <= (innerHeight > 820 ? 62 : 40)) break;
          fs -= 1;
        }
      }
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
