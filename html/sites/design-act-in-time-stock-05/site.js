(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-stock-05',
    brand: 'MarketTrader Pro',
    title: 'Trade Stock',
    instruction: 'top',
    rail: '',
    menu: 'File|Edit|View|Tools|Help',
    briefTitle: 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        body = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', body, C.brand);
      u.el('span', 'ds-window-controls', body, '−    □    ×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
        u.el('span', 'ds-stock-date', nav, 'Mon Apr 27, 2009  10:24 AM');
      }
      const page = u.el('div', 'ds-body', document.body);
      const quotes = u.el('aside', 'ds-quotes', page);
      u.el('h2', '', quotes, 'Quotes');
      const search = u.el('div', 'ds-quote-search', quotes);
      const input = u.el('input', '', search);
      input.value = 'JCA';
      input.setAttribute('aria-label', 'Search quotes');
      const find = u.el('button', '', search, '⌕');
      find.type = 'button';
      find.addEventListener('click', () => env.log('decoy', { label: 'Search quotes' }));
      const active = u.el('section', 'ds-quote-active', quotes);
      u.el('b', '', active, 'JCA');
      u.el('strong', '', active, '$55.62');
      u.el('em', '', active, '+0.78  (+1.42%)');
      const rows = u.el('div', 'ds-quote-rows', quotes);
      [
        ['AAPL', '127.14', '+0.56'],
        ['MSFT', '23.11', '-0.12'],
        ['GE', '14.87', '+0.03'],
        ['T', '24.01', '-0.18'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-quote-row', rows);
        row.forEach((v, i) => u.el('span', i === 2 ? (v[0] === '-' ? 'negative' : 'positive') : '', r, v));
      });
      const content = u.el('div', 'ds-content', page),
        mode =
          ctx.display === 'hidden'
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
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, 'Watchlist');
      u.el('ul', 'ds-quick-values', quick);
      const account = u.el('section', 'ds-account', document.body);
      u.el('h3', '', account, 'Account');
      [
        ['Cash', '$12,350.00'],
        ['Positions', '$8,420.00'],
        ['Total', '$20,770.00'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'ds-account-row', account);
        u.el('span', '', row, k);
        u.el('b', '', row, v);
      });
      let placement = null,
        label = null,
        collide = null,
        submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['footer', 'footer', 'header', 'link']);
        const labels = (
          ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        )
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter(Boolean);
        const primary = labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0] || 'Submit';
        const alternatives = labels.filter((x) => x !== primary);
        label = er.bool(0.5) || !alternatives.length ? primary : er.pick(alternatives);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) collide = cr.pick(pool);
        }
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide) {
        const where = ctx.rng.fork('chrome/collide-place').pick(['header', 'footer']);
        if (where === 'header') decoy(body, collide, true);
        else {
          const holder = u.el('div', 'ds-pq-footer', document.body);
          decoy(holder, collide, true);
        }
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      if (!ctx.finish) {
        if (placement === 'footer') submit = end(foot, 'ds-submit', label);
        else if (placement === 'link') submit = end(foot, 'ds-end-link', label + ' ›');
        else submit = end(body, 'ds-submit ds-submit-header', label);
      }
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      if (submit && placement === 'footer') foot.insertBefore(clear, submit);
      const ins = content.querySelector('.ds-header-note .ds-instruction');
      if (ins) {
        let fs = innerHeight > 820 ? 50 : 31;
        while (fs > 20) {
          ins.style.fontSize = fs + 'px';
          if (ins.getBoundingClientRect().height <= (innerHeight > 820 ? 62 : 40)) break;
          fs--;
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
