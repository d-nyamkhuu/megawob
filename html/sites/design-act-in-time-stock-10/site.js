(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-stock-10',
    'brand': 'Rivermere Capital',
    'title': 'Place Order',
    'instruction': 'top',
    'rail': '',
    'menu': 'INVEST|PLAN|RESEARCH|ACCOUNT',
    'briefTitle': 'Task',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      document.body.classList.remove('ds-end-in-header');
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '−    □    ×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
        u.el('span', 'ds-stock-date', nav, 'Mon, Apr 14, 2008  10:27 AM ET');
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const requested = ctx.display || 'header';
      const small = innerWidth < 1150 || innerHeight < 670;
      const mode = small && (requested === 'panel' || requested === 'toast') ? 'header' : requested;
      ['header', 'panel', 'toast', 'hidden'].forEach((x) =>
        document.body.classList.toggle('ds-display-' + x, mode === x),
      );
      document.body.classList.toggle('ds-finish', !!ctx.finish);
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        let place = er.pick(['footer', 'footer', 'footer', 'toolbar', 'link', 'notes']);
        if (small && place === 'toolbar') place = 'footer';
        let label = 'Submit';
        const labels = ((ctx.content && ctx.content.END_LABELS) || []).filter(
          (x) => (typeof x === 'string' ? x : x.label || x.text || '').toLowerCase() !== 'submit',
        );
        if (er.bool(0.5) && labels.length) {
          const picked = er.pick(labels);
          label = typeof picked === 'string' ? picked : picked.label || picked.text || 'Submit';
        }
        submit = u.el('button', 'ds-submit', foot, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
        if (place === 'toolbar') {
          submit.textContent = '✓';
          submit.title = label;
          submit.setAttribute('aria-label', label);
          submit.classList.add('ds-end-toolbar');
          top.appendChild(submit);
        } else if (place === 'link') submit.classList.add('ds-end-link');
        else if (place === 'notes') submit.classList.add('ds-end-notes');
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = ((ctx.content && ctx.content.END_LABELS) || [])
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || ''))
            .filter((x) => x && x.toLowerCase() !== label.toLowerCase());
          if (pool.length) {
            const dl = cr.pick(pool);
            const decoy = u.el('button', 'ds-xtra', top, dl);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: dl, collide: true }));
          }
        }
      }
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      if (submit && submit.parentNode === foot) foot.insertBefore(clear, submit);
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, 'Notes');
      if (mode === 'header' || mode === 'panel') u.el('div', 'ds-instruction', quick, ctx.instruction);
      u.el('p', 'ds-right-intro', quick, 'Check the current price and recent history before placing an order.');
      u.el('h4', 'ds-recent-title', quick, 'Recent Prices');
      const rt = u.el('table', 'ds-recent-table', quick);
      const rh = u.el('tr', '', u.el('thead', '', rt));
      ['Date / Time', 'Price', 'Change'].forEach((t) => u.el('th', '', rh, t));
      const rb = u.el('tbody', '', rt);
      [
        ['Apr 14, 10:27 AM', '52.18', '+0.67'],
        ['Apr 14, 9:54 AM', '51.96', '+0.45'],
        ['Apr 11, 4:00 PM', '52.03', '-0.12'],
        ['Apr 10, 4:00 PM', '51.44', '-0.38'],
        ['Apr 9, 4:00 PM', '51.82', '+0.21'],
        ['Apr 8, 4:00 PM', '51.61', '-0.06'],
      ].forEach((row) => {
        const tr = u.el('tr', '', rb);
        row.forEach((v) => u.el('td', '', tr, v));
      });
      u.el('ul', 'ds-quick-values', quick);
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
